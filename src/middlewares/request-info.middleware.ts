import { Request, Response, NextFunction } from "express";

/**
 * Middleware que adjunta información de contexto a cada respuesta.
 * Agrega cabeceras personalizadas con metadatos del servidor.
 */
export const requestInfoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader("X-Powered-By", "IncidentHub API v1.0");
  res.setHeader("X-Request-Time", new Date().toISOString());
  res.setHeader("X-Request-Id", `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  next();
};
