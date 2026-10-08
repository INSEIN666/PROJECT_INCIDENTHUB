import { Priority, Status } from "../models/incident.model";

/**
 * DTO para crear un nuevo incidente.
 * El cliente NO envía: id, status, createdAt (el servidor los genera).
 */
export interface CreateIncidentDto {
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: Priority;
  estimatedMinutes: number;
}

/**
 * DTO para actualizar un incidente existente (PUT).
 * Todos los campos son opcionales para permitir actualizaciones parciales,
 * pero el validador obligará a los campos principales en PUT completo.
 */
export interface UpdateIncidentDto {
  title?: string;
  description?: string;
  reporter?: string;
  location?: string;
  priority?: Priority;
  estimatedMinutes?: number;
  assignedTo?: string;
}

/**
 * DTO para cambiar el estado de un incidente (PATCH /status).
 */
export interface UpdateStatusDto {
  status: Status;
}
