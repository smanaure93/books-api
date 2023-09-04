import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { authorBook, authorBookId } from './authorBook';

export interface booksAttributes {
  id: number;
  title: string;
  chapters: number;
  pages: number;
}

export type booksPk = "id";
export type booksId = books[booksPk];
export type booksOptionalAttributes = "id";
export type booksCreationAttributes = Optional<booksAttributes, booksOptionalAttributes>;

export class books extends Model<booksAttributes, booksCreationAttributes> implements booksAttributes {
  id!: number;
  title!: string;
  chapters!: number;
  pages!: number;

  // books hasMany authorBook via bookId
  authorBooks!: authorBook[];
  getAuthorBooks!: Sequelize.HasManyGetAssociationsMixin<authorBook>;
  setAuthorBooks!: Sequelize.HasManySetAssociationsMixin<authorBook, authorBookId>;
  addAuthorBook!: Sequelize.HasManyAddAssociationMixin<authorBook, authorBookId>;
  addAuthorBooks!: Sequelize.HasManyAddAssociationsMixin<authorBook, authorBookId>;
  createAuthorBook!: Sequelize.HasManyCreateAssociationMixin<authorBook>;
  removeAuthorBook!: Sequelize.HasManyRemoveAssociationMixin<authorBook, authorBookId>;
  removeAuthorBooks!: Sequelize.HasManyRemoveAssociationsMixin<authorBook, authorBookId>;
  hasAuthorBook!: Sequelize.HasManyHasAssociationMixin<authorBook, authorBookId>;
  hasAuthorBooks!: Sequelize.HasManyHasAssociationsMixin<authorBook, authorBookId>;
  countAuthorBooks!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof books {
    return books.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    chapters: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'books',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "books_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
