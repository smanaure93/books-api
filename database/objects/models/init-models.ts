import type { Sequelize } from "sequelize";
import { authorBook as _authorBook } from "./authorBook";
import type { authorBookAttributes, authorBookCreationAttributes } from "./authorBook";
import { authors as _authors } from "./authors";
import type { authorsAttributes, authorsCreationAttributes } from "./authors";
import { books as _books } from "./books";
import type { booksAttributes, booksCreationAttributes } from "./books";
import { booksInspirations as _booksInspirations } from "./booksInspirations";
import type { booksInspirationsAttributes, booksInspirationsCreationAttributes } from "./booksInspirations";

export {
  _authorBook as authorBook,
  _authors as authors,
  _books as books,
  _booksInspirations as booksInspirations,
};

export type {
  authorBookAttributes,
  authorBookCreationAttributes,
  authorsAttributes,
  authorsCreationAttributes,
  booksAttributes,
  booksCreationAttributes,
  booksInspirationsAttributes,
  booksInspirationsCreationAttributes
};

export function initModels(sequelize: Sequelize) {
  const authorBook = _authorBook.initModel(sequelize);
  const authors = _authors.initModel(sequelize);
  const books = _books.initModel(sequelize);
  const booksInspirations = _booksInspirations.initModel(sequelize);

  authorBook.belongsTo(authors, { as: "author", foreignKey: "authorId"});
  authors.hasMany(authorBook, { as: "authorBooks", foreignKey: "authorId"});
  
  authorBook.belongsTo(books, { as: "book", foreignKey: "bookId"});
  books.hasMany(authorBook, { as: "authorBooks", foreignKey: "bookId"});

  booksInspirations.belongsTo(books, { as: "currentBook", foreignKey: "bookId"});
  books.hasMany(booksInspirations, { as: "currentBook", foreignKey: "bookId"});
  
  booksInspirations.belongsTo(books, { as: "inspiredBy", foreignKey: "inspirationId"});
  books.hasMany(booksInspirations, { as: "inspiredBy", foreignKey: "inspirationId"});
  
  return {
    authorBook: authorBook,
    authors: authors,
    books: books,
    booksInspirations: booksInspirations,
  };
}
