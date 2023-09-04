import express, { Request, Response } from "express";
import { authorService } from "../services/init_instances";
import create_author from "../schemas/create_author.schema";
import { HTTP_STATUS } from "../constants/http_status";

export const authorRouter = express.Router();

// Crear autor
authorRouter.post("", async (req: Request, res: Response) => {
  try {
    const validation = create_author.validate(req.body);
    if (validation.error) {
      throw `Error en validación: ${validation.error}`;
    }
    const result = await authorService.create(req.body);
    res.status(HTTP_STATUS.SUCCESS).send(result);
  } catch (e: any) {
    res
      .status(HTTP_STATUS.BACKEND_ERROR)
      .send({ status: HTTP_STATUS.BACKEND_ERROR, description: e });
  }
});

// Listar autores
authorRouter.get("", async (req: Request, res: Response) => {
  try {
    const result = await authorService.getAll();
    res.status(HTTP_STATUS.SUCCESS).send(result);
  } catch (e: any) {
    res
      .status(HTTP_STATUS.BACKEND_ERROR)
      .send({ status: HTTP_STATUS.BACKEND_ERROR, description: e });
  }
});