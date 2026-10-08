import { Router } from "express";

import {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  updateIncidentStatus,
  deleteIncident,
} from "../controllers/incident.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validateIdMiddleware } from "../middlewares/validate-id.middleware";
import { validateIncidentMiddleware } from "../middlewares/validate-incident.middleware";
import { validatePriorityMiddleware } from "../middlewares/validate-priority.middleware";
import { validateTimeMiddleware } from "../middlewares/validate-time.middleware";

const router = Router();

/**
 * GET /api/incidents
 * Consulta todos los incidentes (con filtros opcionales por priority y status).
 * Requiere autenticación.
 */
router.get("/", authMiddleware, getAllIncidents);

/**
 * GET /api/incidents/:id
 * Consulta un incidente por ID.
 * Requiere autenticación y un ID numérico válido.
 */
router.get("/:id", authMiddleware, validateIdMiddleware, getIncidentById);

/**
 * POST /api/incidents
 * Registra un nuevo incidente.
 * Requiere autenticación, validación completa del cuerpo y validación de tiempo.
 */
router.post(
  "/",
  authMiddleware,
  validateIncidentMiddleware,
  validateTimeMiddleware,
  createIncident
);

/**
 * PUT /api/incidents/:id
 * Actualiza un incidente existente (reemplazo completo).
 * Requiere autenticación, ID válido y validación del cuerpo.
 */
router.put(
  "/:id",
  authMiddleware,
  validateIdMiddleware,
  validateIncidentMiddleware,
  validateTimeMiddleware,
  updateIncident
);

/**
 * PATCH /api/incidents/:id/status
 * Cambia el estado de un incidente.
 * Requiere autenticación, ID válido y estado válido en el cuerpo.
 */
router.patch(
  "/:id/status",
  authMiddleware,
  validateIdMiddleware,
  validatePriorityMiddleware,
  updateIncidentStatus
);

/**
 * DELETE /api/incidents/:id
 * Elimina un incidente. Operación exclusiva para administradores.
 * Responde 401 sin auth, 403 si no es admin, 404 si no existe.
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateIdMiddleware,
  deleteIncident
);

export default router;
