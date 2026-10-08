/**
 * Modelo principal de un incidente tecnológico.
 *
 * Campos adicionales respecto al mínimo requerido:
 * - updatedAt: registra la última fecha de modificación del incidente.
 * - assignedTo: permite indicar el técnico o equipo responsable de atender el incidente.
 */

/** Niveles de prioridad posibles para un incidente */
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Estados posibles del ciclo de vida de un incidente */
export type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface Incident {
  id: number;
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: Priority;
  status: Status;
  estimatedMinutes: number;
  createdAt: string;

  /** Fecha de última actualización (se asigna al modificar el incidente) */
  updatedAt?: string;

  /** Técnico o equipo asignado para resolver el incidente */
  assignedTo?: string;
}
