import express, { Request, Response } from "express";
import { bookService } from "../services/init_instances";
import create_book from "../schemas/create_book.schema";
import { HTTP_STATUS } from "../constants/http_status";

export const bookRouter = express.Router();

// Crear libro
bookRouter.post("", async (req: Request, res: Response) => {
  try {
    const validation = create_book.validate(req.body);
    if (validation.error) {
      throw `Error en validación: ${validation.error}`;
    }
    const result = await bookService.create(req.body);
    res.status(HTTP_STATUS.SUCCESS).send(result);
  } catch (e: any) {
    res
      .status(HTTP_STATUS.BACKEND_ERROR)
      .send({ status: HTTP_STATUS.BACKEND_ERROR, description: e });
  }
});

// Listar libros
bookRouter.get("", async (req: Request, res: Response) => {
  try {
    const result = await bookService.getAll();
    res.status(HTTP_STATUS.SUCCESS).send(result);
  } catch (e: any) {
    res
      .status(HTTP_STATUS.BACKEND_ERROR)
      .send({ status: HTTP_STATUS.BACKEND_ERROR, description: e });
  }
});

// Detalle libros
bookRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await bookService.getDetail(+req.params.id);
    res.status(HTTP_STATUS.SUCCESS).send(result);
  } catch (e: any) {
    res
      .status(HTTP_STATUS.BACKEND_ERROR)
      .send({ status: HTTP_STATUS.BACKEND_ERROR, description: e });
  }
});
