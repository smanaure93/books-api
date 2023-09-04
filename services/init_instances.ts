import {
  books,
  authorBook,
  authors,
} from "../database/objects/models/init-models";
import BookService from "./book.service";
import AuthorService from "./author.service";

export const bookService: BookService = new BookService(
  books,
  authors,
  authorBook
);

export const authorService: AuthorService = new AuthorService(
  books,
  authors,
  authorBook
);
