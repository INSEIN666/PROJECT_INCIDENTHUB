import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/**
 * Middleware centralizado de manejo de errores.
 * Debe registrarse como ÚLTIMO middleware en app.ts.
 *
 * Distingue entre:
 *  - AppError: errores operacionales controlados → respuesta con el código HTTP definido.
 *  - Error genérico: fallo inesperado → responde 500 sin exponer detalles internos.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      error: err.name,
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
    return;
  }

  // Error inesperado: logueamos el detalle solo en consola del servidor
  console.error("❌ Error inesperado:", err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    error: "InternalServerError",
    message: "Error interno del servidor. Por favor contacte al administrador.",
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
