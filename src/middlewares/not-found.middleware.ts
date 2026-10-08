import { Request, Response } from "express";

/**
 * Middleware para rutas no encontradas (404).
 * Se registra después de todas las rutas definidas.
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: "NotFound",
    message: `Ruta no encontrada: [${req.method}] ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};
