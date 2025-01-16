import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { authors, authorsId } from './authors';
import type { books, booksId } from './books';

export interface booksInspirationsAttributes {
  id: number;
  bookId: number;
  inspirationId: number;
}

export type booksInspirationsPk = "id";
export type booksInspirationsId = booksInspirations[booksInspirationsPk];
export type booksInspirationsOptionalAttributes = "id";
export type booksInspirationsCreationAttributes = Optional<booksInspirationsAttributes, booksInspirationsOptionalAttributes>;

export class booksInspirations extends Model<booksInspirationsAttributes, booksInspirationsCreationAttributes> implements booksInspirationsAttributes {
  id!: number;
  bookId!: number;
  inspirationId!: number;

  // booksInspirations belongsTo books via bookId
  book!: books;
  getBook!: Sequelize.BelongsToGetAssociationMixin<books>;
  setBook!: Sequelize.BelongsToSetAssociationMixin<books, booksId>;
  createBook!: Sequelize.BelongsToCreateAssociationMixin<books>;
  // booksInspirations belongsTo books via inspirationId
  inspiration!: books;
  getInspiration!: Sequelize.BelongsToGetAssociationMixin<books>;
  setInspiration!: Sequelize.BelongsToSetAssociationMixin<books, booksId>;
  createInspiration!: Sequelize.BelongsToCreateAssociationMixin<books>;

  static initModel(sequelize: Sequelize.Sequelize): typeof booksInspirations {
    return booksInspirations.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    inspirationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      },
      field: 'inspiration_id'
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
    tableName: 'books_inspirations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "books_inspirations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
