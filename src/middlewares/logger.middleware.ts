import { Request, Response, NextFunction } from "express";

/**
 * Middleware de registro de peticiones HTTP (logger).
 * Registra en consola: timestamp, método, ruta, IP y duración de la respuesta.
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;

  const start = Date.now();

  // Registramos cuándo finaliza la respuesta para calcular duración
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 500 ? "🔴" : statusCode >= 400 ? "🟡" : "🟢";
    console.log(
      `${statusEmoji} [${timestamp}] ${method} ${originalUrl} → ${statusCode} (${duration}ms) — IP: ${ip}`
    );
  });

  next();
};
