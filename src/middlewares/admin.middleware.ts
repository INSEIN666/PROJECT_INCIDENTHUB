import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/**
 * Middleware de autorización para operaciones exclusivas de administrador.
 * Debe ejecutarse DESPUÉS de authMiddleware.
 *
 * Retorna 401 si no hay autenticación previa, 403 si el rol no es ADMIN.
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const role = res.locals["userRole"] as string | undefined;

  if (!role) {
    next(new AppError("Acceso no autorizado: autenticación requerida", 401));
    return;
  }

  if (role !== "ADMIN") {
    next(
      new AppError(
        "Acceso denegado: se requieren permisos de administrador para esta operación",
        403
      )
    );
    return;
  }

  next();
};
