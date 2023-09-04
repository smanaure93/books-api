import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { authors, authorsId } from './authors';
import type { books, booksId } from './books';

export interface authorBookAttributes {
  id: number;
  authorId: number;
  bookId: number;
}

export type authorBookPk = "id";
export type authorBookId = authorBook[authorBookPk];
export type authorBookOptionalAttributes = "id";
export type authorBookCreationAttributes = Optional<authorBookAttributes, authorBookOptionalAttributes>;

export class authorBook extends Model<authorBookAttributes, authorBookCreationAttributes> implements authorBookAttributes {
  id!: number;
  authorId!: number;
  bookId!: number;

  // authorBook belongsTo authors via authorId
  author!: authors;
  getAuthor!: Sequelize.BelongsToGetAssociationMixin<authors>;
  setAuthor!: Sequelize.BelongsToSetAssociationMixin<authors, authorsId>;
  createAuthor!: Sequelize.BelongsToCreateAssociationMixin<authors>;
  // authorBook belongsTo books via bookId
  book!: books;
  getBook!: Sequelize.BelongsToGetAssociationMixin<books>;
  setBook!: Sequelize.BelongsToSetAssociationMixin<books, booksId>;
  createBook!: Sequelize.BelongsToCreateAssociationMixin<books>;

  static initModel(sequelize: Sequelize.Sequelize): typeof authorBook {
    return authorBook.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'authors',
        key: 'id'
      },
      field: 'author_id'
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      },
      field: 'book_id'
    }
  }, {
    sequelize,
    tableName: 'author_book',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "author_book_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
