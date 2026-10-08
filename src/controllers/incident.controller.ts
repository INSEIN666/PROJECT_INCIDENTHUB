import { Request, Response, NextFunction } from "express";
import { incidents } from "../data/incidents.data";
import { Incident, Priority, Status } from "../models/incident.model";
import { CreateIncidentDto, UpdateIncidentDto, UpdateStatusDto } from "../dtos/incident.dto";
import { AppError } from "../errors/app-error";

/** Contador autoincrementable para IDs de nuevos incidentes */
let nextId = incidents.length + 1;

/**
 * Transiciones de estado permitidas en el ciclo de vida del incidente.
 * Evita cambios de estado incoherentes (e.g., pasar de RESOLVED a IN_PROGRESS directamente).
 */
const ALLOWED_TRANSITIONS: Record<Status, Status[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED", "OPEN"],
  RESOLVED: ["OPEN"],
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/incidents
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna todos los incidentes.
 * Soporta filtros opcionales por query string: ?priority=HIGH &status=OPEN
 */
export const getAllIncidents = (req: Request, res: Response): void => {
  const { priority, status } = req.query;

  let result = [...incidents];

  if (priority) {
    result = result.filter(
      (i) => i.priority === String(priority).toUpperCase()
    );
  }

  if (status) {
    result = result.filter(
      (i) => i.status === String(status).toUpperCase()
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    filters: { priority: priority ?? null, status: status ?? null },
    data: result,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/incidents/:id
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna un incidente por su ID.
 * Responde 404 si no existe.
 */
export const getIncidentById = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = Number(req.params["id"]);
  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    next(new AppError(`No se encontró ningún incidente con ID ${id}`, 404));
    return;
  }

  res.status(200).json({
    success: true,
    data: incident,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/incidents
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registra un nuevo incidente.
 * El servidor genera automáticamente: id, status (OPEN) y createdAt.
 */
export const createIncident = (req: Request, res: Response): void => {
  const dto = req.body as CreateIncidentDto;

  const newIncident: Incident = {
    id: nextId++,
    title: dto.title.trim(),
    description: dto.description.trim(),
    reporter: dto.reporter.trim(),
    location: dto.location.trim(),
    priority: dto.priority as Priority,
    status: "OPEN",
    estimatedMinutes: dto.estimatedMinutes,
    createdAt: new Date().toISOString(),
  };

  incidents.push(newIncident);

  res.status(201).json({
    success: true,
    message: "Incidente registrado exitosamente",
    data: newIncident,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/incidents/:id
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Actualiza completamente un incidente existente.
 * Preserva: id, status, createdAt.
 * Actualiza: updatedAt automáticamente.
 * Responde 404 si el incidente no existe.
 */
export const updateIncident = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = Number(req.params["id"]);
  const index = incidents.findIndex((i) => i.id === id);

  if (index === -1) {
    next(new AppError(`No se encontró ningún incidente con ID ${id}`, 404));
    return;
  }

  const dto = req.body as UpdateIncidentDto;
  const existing = incidents[index]!;

  const updated: Incident = {
    ...existing,
    title: dto.title ? dto.title.trim() : existing.title,
    description: dto.description ? dto.description.trim() : existing.description,
    reporter: dto.reporter ? dto.reporter.trim() : existing.reporter,
    location: dto.location ? dto.location.trim() : existing.location,
    priority: (dto.priority as Priority) ?? existing.priority,
    estimatedMinutes: dto.estimatedMinutes ?? existing.estimatedMinutes,
    ...(dto.assignedTo !== undefined && { assignedTo: dto.assignedTo }),
    updatedAt: new Date().toISOString(),
  };

  incidents[index] = updated;

  res.status(200).json({
    success: true,
    message: "Incidente actualizado exitosamente",
    data: updated,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/incidents/:id/status
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cambia el estado de un incidente.
 * Valida transiciones permitidas para mantener coherencia del ciclo de vida.
 * Responde 400 si la transición no es válida, 404 si no existe el incidente.
 */
export const updateIncidentStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = Number(req.params["id"]);
  const index = incidents.findIndex((i) => i.id === id);

  if (index === -1) {
    next(new AppError(`No se encontró ningún incidente con ID ${id}`, 404));
    return;
  }

  const { status } = req.body as UpdateStatusDto;
  const current = incidents[index]!.status;

  const allowed = ALLOWED_TRANSITIONS[current];
  if (!allowed.includes(status as Status)) {
    next(
      new AppError(
        `Transición de estado inválida: no se puede pasar de '${current}' a '${status}'. ` +
          `Transiciones permitidas desde '${current}': ${allowed.join(", ")}`,
        400
      )
    );
    return;
  }

  incidents[index] = {
    ...incidents[index]!,
    status: status as Status,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: `Estado del incidente #${id} actualizado de '${current}' a '${status}'`,
    data: incidents[index],
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/incidents/:id
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Elimina un incidente del sistema.
 * Requiere rol ADMIN (verificado por adminMiddleware).
 * Responde 204 sin cuerpo si fue exitoso, 404 si no existe.
 */
export const deleteIncident = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = Number(req.params["id"]);
  const index = incidents.findIndex((i) => i.id === id);

  if (index === -1) {
    next(new AppError(`No se encontró ningún incidente con ID ${id}`, 404));
    return;
  }

  incidents.splice(index, 1);

  res.status(204).send();
};
