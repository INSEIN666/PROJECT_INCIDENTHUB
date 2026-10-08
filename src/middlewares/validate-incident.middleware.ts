import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

/**
 * Middleware de validación del cuerpo para crear/actualizar incidentes (POST y PUT).
 * Verifica que todos los campos obligatorios estén presentes y sean válidos.
 */
export const validateIncidentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, reporter, location, priority, estimatedMinutes } =
    req.body as Record<string, unknown>;

  const errors: string[] = [];

  // title: string, mínimo 3 caracteres
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    errors.push("'title' es obligatorio y debe tener al menos 3 caracteres");
  }

  // description: string, mínimo 10 caracteres
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    errors.push("'description' es obligatorio y debe tener al menos 10 caracteres");
  }

  // reporter: string, mínimo 2 caracteres
  if (!reporter || typeof reporter !== "string" || reporter.trim().length < 2) {
    errors.push("'reporter' es obligatorio y debe tener al menos 2 caracteres");
  }

  // location: string, mínimo 2 caracteres
  if (!location || typeof location !== "string" || location.trim().length < 2) {
    errors.push("'location' es obligatorio y debe tener al menos 2 caracteres");
  }

  // priority: debe ser uno de los valores del enum
  if (!priority || !VALID_PRIORITIES.includes(priority as (typeof VALID_PRIORITIES)[number])) {
    errors.push(
      `'priority' es obligatorio y debe ser uno de: ${VALID_PRIORITIES.join(", ")}`
    );
  }

  // estimatedMinutes: debe ser un número (validación de rango en validate-time)
  if (estimatedMinutes === undefined || estimatedMinutes === null) {
    errors.push("'estimatedMinutes' es obligatorio");
  } else if (typeof estimatedMinutes !== "number") {
    errors.push("'estimatedMinutes' debe ser un número");
  }

  if (errors.length > 0) {
    next(
      new AppError(
        `Validación del cuerpo fallida:\n  • ${errors.join("\n  • ")}`,
        400
      )
    );
    return;
  }

  next();
};
