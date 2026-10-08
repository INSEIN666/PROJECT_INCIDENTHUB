/**
 * Clase de error personalizada para errores operacionales de la aplicación.
 * Permite distinguir errores controlados (AppError) de errores inesperados del sistema.
 */
export class AppError extends Error {
  /** Código HTTP que se enviará en la respuesta */
  public readonly statusCode: number;

  /** Indica si es un error operacional esperado (true) o un fallo del sistema (false) */
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = "AppError";

    // Mantiene el stack trace correcto en V8
    Error.captureStackTrace(this, this.constructor);
  }
}
