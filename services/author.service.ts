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

  /**
   * This method creates a new author record in the database. It takes an author model as
   * an argument and returns a generic response containing the status, description, and
   * data (author) retrieved from the database. If the author already exists in the
   * database, it returns a BAD_REQUEST status with an appropriate description.
   *
   * @param {Author} author The author model to be created.
   * @returns {Promise<GenericResponse>} A promise that resolves to a generic response
   * containing the status, description, and data (author) retrieved from the database.
   * @throws Will throw an error if there is an issue creating the author in the database.
   */
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

/**
 * Fetches all authors from the database including their associated books.
 * The method returns a generic response containing the status, description,
 * and the data (list of authors with their books) retrieved from the database.
 * In case of an error during retrieval, it returns a BACKEND_ERROR status with
 * an appropriate description.
 *
 * @returns {Promise<GenericResponse>} A promise that resolves to a generic response
 * containing the status, description, and data (list of authors) retrieved from the database.
 * @throws Will throw an error if there is an issue retrieving the authors from the database.
 */

  async getAll() {
    const loggerIdentifier = `[${this.constructor.name}].[${this.getAll.name}]`;
    try {
      console.log(`${loggerIdentifier}: Buscando Autores...`);

      const response: GenericResponse = {
        status: HTTP_STATUS.BACKEND_ERROR,
        description: "Ocurrió un error al buscar autores",
      };

      // Get raw database data
      const authorsOnDb = await this.authorModel.findAll({
        include: {
          model: this.authorBookModel,
          as: "authorBooks",
          include: { model: this.bookModel, as: "book" },
        },
      });

      // Map to human readable
      const authors = authorsOnDb.map((author) => ({
        id: author.id,
        name: author.name,
        books: author.authorBooks.map((book) => book.book),
      }));

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
