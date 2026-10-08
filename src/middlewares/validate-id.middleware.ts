import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/**
 * Middleware de validación del parámetro de ruta `:id`.
 * Verifica que el ID sea un número entero positivo antes de continuar.
 */
export const validateIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const raw = req.params["id"];
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    next(
      new AppError(
        `El parámetro ':id' debe ser un número entero positivo. Valor recibido: '${raw}'`,
        400
      )
    );
    return;
  }

  next();
};
