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

export default databaseConfig;
