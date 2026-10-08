import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

/**
 * Middleware de validación del campo `status` en el cuerpo de la petición.
 * Usado en el endpoint PATCH /:id/status para verificar que el nuevo estado
 * sea uno de los valores permitidos en el ciclo de vida del incidente.
 *
 * Nota: el archivo se llama validate-priority siguiendo la estructura del proyecto,
 * pero su responsabilidad en esta ruta es validar el campo `status`.
 */
export const validatePriorityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { status } = req.body as Record<string, unknown>;

  if (!status) {
    next(new AppError("El campo 'status' es obligatorio en el cuerpo de la petición", 400));
    return;
  }

  if (typeof status !== "string") {
    next(new AppError("El campo 'status' debe ser un string", 400));
    return;
  }

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    next(
      new AppError(
        `El campo 'status' debe ser uno de: ${VALID_STATUSES.join(", ")}. Valor recibido: '${status}'`,
        400
      )
    );
    return;
  }

  next();
};
