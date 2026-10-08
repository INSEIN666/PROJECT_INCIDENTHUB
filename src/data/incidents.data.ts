import { Incident } from "../models/incident.model";

/**
 * Almacén temporal en memoria de incidentes.
 * Simula una base de datos en esta versión inicial de la API.
 * Incluye 5 incidentes de ejemplo con distintas prioridades y estados.
 */
export const incidents: Incident[] = [
  {
    id: 1,
    title: "Proyector sin señal",
    description: "El proyector del aula 201 no reconoce ningún computador conectado mediante HDMI ni VGA.",
    reporter: "Carlos Díaz",
    location: "Aula 201",
    priority: "MEDIUM",
    status: "OPEN",
    estimatedMinutes: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Computador del laboratorio no enciende",
    description:
      "El equipo del puesto 5 no responde al botón de encendido, no emite sonido ni muestra señal de vida. Se verificó el cable de poder y el tomacorriente sin resultado.",
    reporter: "María Torres",
    location: "Laboratorio de Sistemas 102",
    priority: "HIGH",
    status: "OPEN",
    estimatedMinutes: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Impresora de gerencia muestra error de atasco",
    description:
      "La impresora HP LaserJet de la oficina de gerencia indica atasco de papel en pantalla pero no hay papel atascado visible. Se intentó reiniciar sin éxito.",
    reporter: "Andrés Morales",
    location: "Oficina de Gerencia - Piso 3",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    estimatedMinutes: 45,
    assignedTo: "Soporte Técnico Nivel 2",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Sistema de nómina arroja error 500",
    description:
      "El módulo de liquidación de nómina presenta un error interno 500 al intentar generar el informe mensual de agosto. Afecta a todo el departamento de RRHH.",
    reporter: "Lucía Ramírez",
    location: "Departamento de Recursos Humanos",
    priority: "CRITICAL",
    status: "OPEN",
    estimatedMinutes: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Conexión WiFi intermitente en sala de reuniones",
    description:
      "La señal WiFi de la Sala B se cae cada 10 minutos aproximadamente, interrumpiendo las videollamadas. El problema fue identificado y se reinició el access point.",
    reporter: "Felipe Guzmán",
    location: "Sala de Reuniones B - Piso 2",
    priority: "LOW",
    status: "RESOLVED",
    estimatedMinutes: 20,
    assignedTo: "Soporte de Redes",
    createdAt: new Date().toISOString(),
  },
];
