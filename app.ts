import express from "express";
import cors from "cors";
import helmet from "helmet";
import { initModels } from "./database/objects/models/init-models";
import { dbConnection } from "./database/sequelize/postgres";
import { authorRouter, bookRouter } from "./routes";

/**
 * App Variables
 */

const PORT: number = 4300;

const app = express();

/**
 * Database connection
 */
initModels(dbConnection)

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 *  Routes
 */
app.use('/api/authors', authorRouter)
app.use('/api/books', bookRouter)

/**
 * Se inicia el servidor
 */

app.listen(PORT, () => {
  console.log(`BOOK API RUNNING. Listening on port ${PORT}`);
});
