import { Op } from "sequelize";
import { HTTP_STATUS } from "../constants/http_status";
import { Author } from "../types/author.types";
import { GenericResponse } from "../types/shared.types";

class AuthorService {
  bookModel: any;
  authorModel: any;
  authorBookModel: any;
  constructor(bookModel, authorModel, authorBookModel) {
    this.bookModel = bookModel;
    this.authorModel = authorModel;
    this.authorBookModel = authorBookModel;
  }

  async create(author: Author) {
    const loggerIdentifier = `[${this.constructor.name}].[${this.create.name}]`;
    try {
      console.log(`${loggerIdentifier}: Creando autor...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al crear el autor",
      };

      const authorOnDb = await this.authorModel.findOne({
        where: {
          name: author.name,
        },
      });

      if (authorOnDb) {
        response.status = HTTP_STATUS.BAD_REQUEST;
        response.description = `Autor ${author.name} ya existe`;
        return response;
      }

      await this.authorModel.create(author);

      console.log(`${loggerIdentifier}: Autor creado...`);

      response.status = HTTP_STATUS.SUCCESS;
      response.description = "Autor creado exitosamente";

      return response;
    } catch (error: any) {
      throw `${loggerIdentifier}: ${error.message}`;
    }
  }

  async getAll() {
    const loggerIdentifier = `[${this.constructor.name}].[${this.getAll.name}]`;
    try {
      console.log(`${loggerIdentifier}: Buscando Autores...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al buscar autores",
      };

      const authorsOnDb = await this.authorModel.findAll();
      const authors = [];
      const authorsIds = authorsOnDb.map((author) => {
        authors.push({
          ...author.dataValues,
          books: [],
        });
        return author.id;
      });

      const authorBookRelationship = await this.authorBookModel.findAll({
        where: {
          authorId: {
            [Op.in]: authorsIds,
          },
        },
        include: "book",
      });
      const booksInfo = [];
      authorBookRelationship.forEach((info) => {
        booksInfo.push({ ...info.book.dataValues, authorId: info.authorId });
      });

      booksInfo.forEach((info) => {
        authors.forEach((author) => {
          if (author.id === info.authorId)
            author.books.push({
              id: info.id,
              title: info.title,
              chapters: info.chapters,
              pages: info.pages,
              pageAverage: (info.pages / info.chapters).toFixed(2),
            });
        });
      });

      response.status = HTTP_STATUS.SUCCESS;
      response.description = "Autores obtenidos exitosamente";
      response.data = authors;

      return response;
    } catch (error: any) {
      throw `${loggerIdentifier}: ${error.message}`;
    }
  }
}

export default AuthorService;
