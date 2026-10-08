import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/**
 * Claves de API válidas y sus roles asociados.
 * En una versión con base de datos, estas claves se verificarían
 * contra un almacén persistente de usuarios.
 *
 * Roles disponibles:
 *  - USER  → acceso de lectura y escritura
 *  - ADMIN → acceso total, incluyendo eliminación
 *
 * Uso: enviar la cabecera `x-api-key` con el valor correspondiente.
 * Ejemplo: x-api-key: hub-user-2026
 */
const API_KEYS: Record<string, string> = {
  "hub-user-2026": "USER",
  "hub-admin-2026": "ADMIN",
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if (!apiKey) {
    next(new AppError("Acceso no autorizado: se requiere el header 'x-api-key'", 401));
    return;
  }

  const role = API_KEYS[apiKey];

  if (!role) {
    next(new AppError("API key inválida o expirada", 401));
    return;
  }

  // Adjuntamos el rol al request para que middlewares posteriores lo usen
  res.locals["userRole"] = role;
  next();
};
