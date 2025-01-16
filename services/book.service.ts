import { Op } from "sequelize";
import { HTTP_STATUS } from "../constants/http_status";
import { CreateBookRequest } from "../types/book.types";
import { GenericResponse } from "../types/shared.types";

/**
 * Removes keys with undefined or empty values from an object
 * @param data The object to be cleaned
 * @returns The cleaned object
 */
export const  cleanUpUndefinedData = (data: any) => {
  for (const key in data) {
    if (data[key] === undefined || data[key].length === 0) {
      delete data[key];
    }
  }
  return data;
}
class BookService {
  bookModel: any;
  authorModel: any;
  authorBookModel: any;
  booksInspirationsModel: any;
  constructor(bookModel, authorModel, authorBookModel, booksInspirationsModel) {
    this.bookModel = bookModel;
    this.authorModel = authorModel;
    this.authorBookModel = authorBookModel;
    this.booksInspirationsModel = booksInspirationsModel;
  }

/**
 * Retrieves all books from the database, including associated authors and inspirations.
 * 
 * This method fetches all book records from the database and includes associated
 * authors and inspiration data through related models. It returns a generic response
 * containing the list of books with their details, including titles, pages, chapters,
 * authors, books they are inspired by, and books they have inspired.
 *
 * @returns {Promise<GenericResponse>} A promise that resolves to a generic response
 * containing the status, description, and data (list of books) retrieved from the database.
 * 
 * @throws Will throw an error if there is an issue retrieving the books from the database.
 */

  async getAll() {
    const loggerIdentifier = `[${this.constructor.name}].[${this.getAll.name}]`;
    try {
      console.log(`${loggerIdentifier}: Buscando libros...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al buscar libros",
      };

      const booksOnDb = await this.bookModel.findAll({
        include: [
          {
            model: this.authorBookModel,
            as: "authorBooks",
            include: { model: this.authorModel, as: "author" },
          },
          {
            model: this.booksInspirationsModel,
            as: "currentBook",
            include: { model: this.bookModel, as: "inspiredBy" },
          },
          {
            model: this.booksInspirationsModel,
            as: "inspiredBy",
            include: { model: this.bookModel, as: "currentBook" },
          },
        ],
      });

      const books = booksOnDb.map((book) => {
        return cleanUpUndefinedData({
          id: book.id,
          title: book.title,
          pages: book.pages,
          chapters: book.chapters,
          authors: book.authorBooks.map((author) => author.author),
          inspiredBy: book.currentBook.map((inspiredBy) => inspiredBy.inspiredBy),
          inspired: book.inspiredBy.map((currentBook) => currentBook.currentBook),
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

  /**
   * This method fetches a single book record from the database and includes associated
   * authors and inspiration data through related models. It returns a generic response
   * containing the status, description, and data (list of books) retrieved from the database.
   * If the book is not found, it returns a NOT_FOUND status with an appropriate description.
   *
   * @param {number} id The id of the book to be retrieved.
   * @returns {Promise<GenericResponse>} A promise that resolves to a generic response
   * containing the status, description, and data (book) retrieved from the database.
   * @throws Will throw an error if there is an issue retrieving the book from the database.
   */
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
        return response;
      }
      response.status = HTTP_STATUS.SUCCESS;
      response.description = "Libros obtenidos exitosamente";
      response.data = books;

      return response;
    } catch (error: any) {
      throw `${loggerIdentifier}: ${error.message}`;
    }
  }

/**
 * Creates a new book record in the database with the provided details.
 * It checks if a book with the same title already exists and returns a BAD_REQUEST
 * response if so. If the book is successfully created, it associates the book
 * with authors and inspirations as specified in the request.
 * 
 * @param {CreateBookRequest} book - The book details including title, chapters, pages,
 * authors, and inspirations.
 * @returns {Promise<GenericResponse>} A promise that resolves to a generic response
 * with the status and description of the creation process. On success, it contains
 * a success message; otherwise, it contains an error message.
 * @throws Will throw an error if there is an issue creating the book.
 */

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

      for await (const inspiration of book.inspirations) {
        const inspirationValidation = await this.getDetail(inspiration);
        if (inspirationValidation.status === HTTP_STATUS.SUCCESS) {
          await this.booksInspirationsModel.create({
            inspirationId: inspiration,
            bookId: bookCreated.id,
          });
        }
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
