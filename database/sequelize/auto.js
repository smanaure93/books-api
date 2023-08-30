const Sequelize = require('sequelize-auto');

const databaseConfig = {
  env: "development",
  DB_CONFIG: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "books_api",
    schema: "public",
  },
};

const auto_models = new Sequelize(
  databaseConfig.DB_CONFIG.database,
  databaseConfig.DB_CONFIG.user,
  databaseConfig.DB_CONFIG.password,
  {
    host: databaseConfig.DB_CONFIG.host,
    port: databaseConfig.DB_CONFIG.port,
    dialect: "postgres",
    directory: "database/objects/models",
    caseFile: "c",
    caseModel: "c",
    caseProp: "c",
    lang: "ts",
    skipTables: [],
    additional: {
      timestamps: false,
    },
  }
);

auto_models.run().then((resp) => {
  // eslint-disable-next-line no-console
  console.log(resp);
});
