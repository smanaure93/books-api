import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { authorBook, authorBookId } from './authorBook';

export interface authorsAttributes {
  id: number;
  name: string;
}

export type authorsPk = "id";
export type authorsId = authors[authorsPk];
export type authorsOptionalAttributes = "id";
export type authorsCreationAttributes = Optional<authorsAttributes, authorsOptionalAttributes>;

export class authors extends Model<authorsAttributes, authorsCreationAttributes> implements authorsAttributes {
  id!: number;
  name!: string;

  // authors hasMany authorBook via authorId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof authors {
    return authors.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'authors',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "authors_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
