# 🚀 IncidentHub API v1.0

API REST desarrollada con **Express** y **TypeScript** para la gestión de incidentes tecnológicos en una organización.

---

## 📋 Tabla de contenidos

- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Autenticación](#-autenticación)
- [Endpoints](#-endpoints)
- [Ejemplos de uso](#-ejemplos-de-uso)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Middlewares](#-middlewares)
- [Códigos HTTP](#-códigos-http)

---

## 📦 Instalación

```bash
# 1. Clonar o descomprimir el proyecto
cd incidenthub-api

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env (opcional)
copy .env.example .env
```

---

## ▶️ Ejecución

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Compilar a JavaScript
npm run build

# Ejecutar versión compilada
npm start
```

El servidor inicia en `http://localhost:3000` por defecto.

---

## 🔐 Autenticación

Todas las rutas requieren el header `x-api-key` con una de las siguientes claves:

| Clave            | Rol   | Permisos                              |
|------------------|-------|---------------------------------------|
| `hub-user-2026`  | USER  | GET, POST, PUT, PATCH                 |
| `hub-admin-2026` | ADMIN | GET, POST, PUT, PATCH, **DELETE**     |

**Ejemplo de header:**
```
x-api-key: hub-user-2026
```

---

## 📡 Endpoints

| Método   | Ruta                           | Descripción                    | Auth requerida |
|----------|--------------------------------|--------------------------------|----------------|
| `GET`    | `/api/incidents`               | Listar todos los incidentes    | USER / ADMIN   |
| `GET`    | `/api/incidents/:id`           | Obtener incidente por ID       | USER / ADMIN   |
| `POST`   | `/api/incidents`               | Registrar un nuevo incidente   | USER / ADMIN   |
| `PUT`    | `/api/incidents/:id`           | Actualizar un incidente        | USER / ADMIN   |
| `PATCH`  | `/api/incidents/:id/status`    | Cambiar estado del incidente   | USER / ADMIN   |
| `DELETE` | `/api/incidents/:id`           | Eliminar un incidente          | **Solo ADMIN** |

### Filtros disponibles en GET /api/incidents

```
GET /api/incidents?priority=HIGH
GET /api/incidents?status=OPEN
GET /api/incidents?priority=CRITICAL&status=IN_PROGRESS
```

---

## 🧪 Ejemplos de uso

### Listar todos los incidentes

```http
GET /api/incidents HTTP/1.1
x-api-key: hub-user-2026
```

### Crear un incidente

```http
POST /api/incidents HTTP/1.1
Content-Type: application/json
x-api-key: hub-user-2026

{
  "title": "Monitor sin imagen",
  "description": "El monitor del puesto 3 no muestra imagen al encender el computador.",
  "reporter": "Juan Pérez",
  "location": "Sala de Desarrollo",
  "priority": "HIGH",
  "estimatedMinutes": 30
}
```

### Actualizar un incidente

```http
PUT /api/incidents/1 HTTP/1.1
Content-Type: application/json
x-api-key: hub-user-2026

{
  "title": "Proyector sin señal HDMI",
  "description": "El proyector del aula 201 no detecta señal HDMI ni VGA.",
  "reporter": "Carlos Díaz",
  "location": "Aula 201",
  "priority": "HIGH",
  "estimatedMinutes": 45,
  "assignedTo": "Soporte AV"
}
```

### Cambiar estado

```http
PATCH /api/incidents/1/status HTTP/1.1
Content-Type: application/json
x-api-key: hub-user-2026

{
  "status": "IN_PROGRESS"
}
```

**Transiciones de estado permitidas:**
```
OPEN → IN_PROGRESS
IN_PROGRESS → RESOLVED | OPEN
RESOLVED → OPEN
```

### Eliminar un incidente (solo ADMIN)

```http
DELETE /api/incidents/1 HTTP/1.1
x-api-key: hub-admin-2026
```

---

## 🏗️ Estructura del proyecto

```
incidenthub-api/
├── src/
│   ├── controllers/
│   │   └── incident.controller.ts    # Lógica de cada endpoint
│   ├── data/
│   │   └── incidents.data.ts         # Almacén en memoria (arreglo)
│   ├── dtos/
│   │   └── incident.dto.ts           # Tipos para entrada de datos
│   ├── errors/
│   │   └── app-error.ts              # Clase de error personalizada
│   ├── middlewares/
│   │   ├── auth.middleware.ts        # Autenticación por API key
│   │   ├── admin.middleware.ts       # Autorización rol ADMIN
│   │   ├── error.middleware.ts       # Manejo centralizado de errores
│   │   ├── logger.middleware.ts      # Log de peticiones HTTP
│   │   ├── not-found.middleware.ts   # Rutas no encontradas (404)
│   │   ├── request-info.middleware.ts# Headers informativos
│   │   ├── validate-id.middleware.ts # Valida parámetro :id
│   │   ├── validate-incident.middleware.ts # Valida cuerpo POST/PUT
│   │   ├── validate-priority.middleware.ts # Valida campo status
│   │   └── validate-time.middleware.ts     # Valida estimatedMinutes
│   ├── models/
│   │   └── incident.model.ts         # Interfaz Incident y tipos
│   ├── routes/
│   │   └── incident.routes.ts        # Definición de rutas y middleware chain
│   ├── app.ts                        # Configuración de Express
│   └── server.ts                     # Punto de entrada del servidor
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🔧 Middlewares

| Middleware              | Propósito                                                   |
|-------------------------|-------------------------------------------------------------|
| `authMiddleware`        | Valida el header `x-api-key` y asigna el rol               |
| `adminMiddleware`       | Verifica que el rol sea ADMIN (después de auth)            |
| `loggerMiddleware`      | Registra método, ruta, estado HTTP y duración en consola   |
| `requestInfoMiddleware` | Agrega headers X-Powered-By, X-Request-Time, X-Request-Id  |
| `errorMiddleware`       | Captura todos los errores y responde con formato estándar  |
| `notFoundMiddleware`    | Responde 404 para rutas no definidas                       |
| `validateIdMiddleware`  | Verifica que `:id` sea un entero positivo                  |
| `validateIncidentMiddleware` | Valida campos obligatorios en el body (POST/PUT)      |
| `validatePriorityMiddleware` | Valida el campo `status` en PATCH /status             |
| `validateTimeMiddleware`| Valida que `estimatedMinutes` esté entre 1 y 480           |

---

## 📊 Códigos HTTP

| Código | Significado                                |
|--------|--------------------------------------------|
| 200    | OK — operación exitosa                     |
| 201    | Created — recurso creado                   |
| 204    | No Content — eliminación exitosa           |
| 400    | Bad Request — validación fallida           |
| 401    | Unauthorized — sin autenticación o inválida|
| 403    | Forbidden — sin permisos de administrador  |
| 404    | Not Found — recurso no encontrado          |
| 500    | Internal Server Error — error inesperado   |

---

## 📝 Modelo de datos

```typescript
interface Incident {
  id: number;            // Generado automáticamente por el servidor
  title: string;         // Título del incidente (mín. 3 chars)
  description: string;   // Descripción detallada (mín. 10 chars)
  reporter: string;      // Nombre del reportante (mín. 2 chars)
  location: string;      // Ubicación del incidente
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";  // Inicia siempre en OPEN
  estimatedMinutes: number;  // Entre 1 y 480 minutos
  createdAt: string;     // ISO 8601 — generado por el servidor
  updatedAt?: string;    // ISO 8601 — se actualiza al modificar
  assignedTo?: string;   // Técnico o equipo responsable
}
```

---

*IncidentHub API v1.0 — Capítulo V*
