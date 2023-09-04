import { Op } from "sequelize";
import { HTTP_STATUS } from "../constants/http_status";
import { CreateBookRequest } from "../types/book.types";
import { GenericResponse } from "../types/shared.types";

class BookService {
  bookModel: any;
  authorModel: any;
  authorBookModel: any;
  constructor(bookModel, authorModel, authorBookModel) {
    this.bookModel = bookModel;
    this.authorModel = authorModel;
    this.authorBookModel = authorBookModel;
  }

  async getAll() {
    const loggerIdentifier = `[${this.constructor.name}].[${this.getAll.name}]`;
    try {
      console.log(`${loggerIdentifier}: Buscando libros...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al buscar libros",
      };

      const booksOnDb = await this.bookModel.findAll();
      const books = [];
      const booksIds = booksOnDb.map((book) => {
        books.push({
          ...book.dataValues,
          pageAverage: (book.pages / book.chapters).toFixed(2),
          authors: [],
        });
        return book.id;
      });

      const authorBookRelationship = await this.authorBookModel.findAll({
        where: {
          bookId: {
            [Op.in]: booksIds,
          },
        },
        include: "author",
      });
      const authorsInfo = [];
      authorBookRelationship.forEach((info) => {
        authorsInfo.push({ ...info.author.dataValues, bookId: info.bookId });
      });

      authorsInfo.forEach((info) => {
        books.forEach((book) => {
          if (book.id === info.bookId)
            book.authors.push({ id: info.id, name: info.name });
        });
      });

      response.status = HTTP_STATUS.SUCCESS;
      response.description = "Libros obtenidos exitosamente";
      response.data = books;

      return response;
    } catch (error: any) {
      throw `${loggerIdentifier}: ${error.message}`;
    }
  }

  async getDetail(id: number) {
    const loggerIdentifier = `[${this.constructor.name}].[${this.getDetail.name}]`;
    try {
      console.log(`${loggerIdentifier}: Buscando libros...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al buscar libros",
      };

      const allBooks = await this.getAll();
      const books = allBooks.data.filter((item) => item.id === id);
      if (!books.length) {
        response.status = HTTP_STATUS.NOT_FOUND;
        response.description = `No se encontró el libro: ${id}`;
        return response
      }
      response.status = HTTP_STATUS.SUCCESS;
      response.description = "Libros obtenidos exitosamente";
      response.data = books;

      return response;
    } catch (error: any) {
      throw `${loggerIdentifier}: ${error.message}`;
    }
  }

  async create(book: CreateBookRequest) {
    const loggerIdentifier = `[${this.constructor.name}].[${this.create.name}]`;
    try {
      console.log(`${loggerIdentifier}: Creando libro...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al crear el libro",
      };

      const bookOnDb = await this.bookModel.findOne({
        where: {
          title: book.title,
        },
      });

      if (bookOnDb) {
        response.status = HTTP_STATUS.BAD_REQUEST;
        response.description = `Libro ${book.title} ya existe`;
        return response;
      }

      const bookCreated = await this.bookModel.create({
        title: book.title,
        chapters: book.chapters,
        pages: book.pages,
      });

      for await (const author of book.authors) {
        await this.authorBookModel.create({
          authorId: author,
          bookId: bookCreated.id,
        });
      }

      response.status = HTTP_STATUS.SUCCESS;
      response.description = "Libro creado exitosamente";

      return response;
    } catch (error: any) {
      throw `${loggerIdentifier}: ${error.message}`;
    }
  }
}

export default BookService;
