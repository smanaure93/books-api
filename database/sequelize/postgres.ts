import { Sequelize } from 'sequelize';
import databaseConfig from '../config';


// instance postgres connection

var sequelizeOptions : any = {
  host: databaseConfig.DB_CONFIG.host,
  port: databaseConfig.DB_CONFIG.port,
  sync: {
    searchPath: databaseConfig.DB_CONFIG.schema,
  },
  dialect: 'postgres',
  logging: false,
  pool: {
    acquire: 60000,
  }
}

const dbConnection = new Sequelize(
  databaseConfig.DB_CONFIG.database,
  databaseConfig.DB_CONFIG.user,
  databaseConfig.DB_CONFIG.password,
  sequelizeOptions
);

export { dbConnection };