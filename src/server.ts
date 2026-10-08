import app from "./app";

const PORT: number = Number(process.env["PORT"]) || 3000;

const server = app.listen(PORT, () => {
  const divider = "─".repeat(46);
  console.log(`
  ┌${divider}┐
  │        🚀  IncidentHub API  v1.0.0          │
  ├${divider}┤
  │  Estado   : Servidor iniciado correctamente  │
  │  Puerto   : ${PORT}                               │
  │  URL base : http://localhost:${PORT}              │
  │  API      : http://localhost:${PORT}/api/incidents│
  ├${divider}┤
  │  Autenticación — header: x-api-key           │
  │  → Usuario : hub-user-2026                   │
  │  → Admin   : hub-admin-2026                  │
  └${divider}┘
  `);
});

// Manejo limpio de señales de cierre
process.on("SIGTERM", () => {
  console.log("\n⚠️  SIGTERM recibido. Cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT recibido. Cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente.");
    process.exit(0);
  });
});
