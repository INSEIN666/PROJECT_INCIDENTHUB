import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";

import { loggerMiddleware } from "./middlewares/logger.middleware";
import { requestInfoMiddleware } from "./middlewares/request-info.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";

import incidentRoutes from "./routes/incident.routes";

const app: Application = express();

// ─── Middlewares globales ─────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve el cliente HTML estático desde /public
app.use(express.static(path.join(__dirname, "..", "public")));

// Middlewares personalizados (se aplican a todas las rutas)
app.use(loggerMiddleware);
app.use(requestInfoMiddleware);

// ─── Rutas de la API ──────────────────────────────────────────────────────────

app.use("/api/incidents", incidentRoutes);

/** Endpoint raíz informativo */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "IncidentHub API",
    version: "1.0.0",
    description: "API REST para gestión de incidentes tecnológicos",
    documentation: "Ver README.md para detalles de autenticación y endpoints",
    endpoints: {
      incidents: "/api/incidents",
    },
    authentication: {
      header: "x-api-key",
      roles: {
        USER: "Lectura, creación y actualización de incidentes",
        ADMIN: "Acceso total, incluyendo eliminación",
      },
    },
  });
});

// ─── Middlewares de error (deben ir AL FINAL) ─────────────────────────────────

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
