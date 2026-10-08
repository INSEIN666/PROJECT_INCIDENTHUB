import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

const MIN_MINUTES = 1;
const MAX_MINUTES = 480; // 8 horas máximo por incidente

/**
 * Middleware de validación de negocio para el campo `estimatedMinutes`.
 * Se ejecuta después de validate-incident y agrega reglas de rango:
 *  - Mínimo: 1 minuto
 *  - Máximo: 480 minutos (8 horas)
 *  - Debe ser un número entero
 */
export const validateTimeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { estimatedMinutes } = req.body as Record<string, unknown>;

  // Si no está presente lo dejamos pasar (validate-incident ya lo validó antes)
  if (estimatedMinutes === undefined || estimatedMinutes === null) {
    next();
    return;
  }

  const minutes = Number(estimatedMinutes);

  if (!Number.isInteger(minutes)) {
    next(new AppError("'estimatedMinutes' debe ser un número entero", 400));
    return;
  }

  if (minutes < MIN_MINUTES) {
    next(
      new AppError(
        `'estimatedMinutes' debe ser al menos ${MIN_MINUTES} minuto`,
        400
      )
    );
    return;
  }

  if (minutes > MAX_MINUTES) {
    next(
      new AppError(
        `'estimatedMinutes' no puede superar ${MAX_MINUTES} minutos (8 horas). Valor recibido: ${minutes}`,
        400
      )
    );
    return;
  }

  next();
};
