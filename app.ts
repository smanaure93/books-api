import express from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import * as db from "./db.json";

/**
 * App Variables
 */

const PORT: number = 4300;

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 *  Routes
 */
// Obtener los libros
app.get("/books", (req, res) => {
  const { books } = db;
  res.status(200).json(books);
});
// Crear libro
app.post("/books", (req, res) => {
  const body = req.body;
  const data = { ...db };
  let id = 1;
  data.books.forEach((book) => {
    if (book.id >= id) {
      id = book.id + 1;
    }
  });
  data.books.push({ ...body, id });
  const dataSave = JSON.stringify({ books: data.books, authors: data.authors });
  fs.writeFileSync("db.json", dataSave);
  res.status(201).json({
    msg: `Libro ${body.title} creado exitosamente`,
  });
});
// Obtener los promedios de paginas
app.get("/books/avegare/:id", (req, res) => {
  const { books } = db;
  const id = +req.params.id;
  const book = books.find((b) => b.id === id);
  if (!book) {
    res.status(400).json({
      msg: `No se encontró libro con id: ${id}`,
    });
  }
  res
    .status(200)
    .json({ ...book, pageAverage: (book.pages / book.chapters).toFixed(2) });
});

// Obtener los autores
app.get("/author", (req, res) => {
  const { authors, books } = db;
  const authorsMapped = authors.map((author) => {
    const booksOwned = books.filter((book) => {
      if (book.authors.includes(author.id)) {
        return true;
      }
      return false;
    });
    return { ...author, books: booksOwned };
  });
  res.status(200).json(authorsMapped);
});

// Crear autor
app.post("/author", (req, res) => {
  const body = req.body;
  if (!Object.keys(body).includes("name")) {
    res.status(400).json({
      msg: "Introduzca el nombre del autor",
    });
  }

  const data = { ...db };
  let id = 1;
  data.authors.forEach((author) => {
    if (author.id >= id) {
      id = author.id + 1;
    }
  });
  data.authors.push({ id, name: body.name });
  const dataSave = JSON.stringify({ books: data.books, authors: data.authors });
  fs.writeFileSync("db.json", dataSave, { encoding: "utf8", flag: "w" });
  res.status(201).json({
    msg: `Autor ${body.name} creado exitosamente`,
  });
});
app.get("*", (req, res) => {
  res.send("404 Page Not Found");
});
/**
 * Se inicia el servidor
 */

app.listen(PORT, () => {
  console.log(`API RUNNING. Listening on port ${PORT}`);
});
