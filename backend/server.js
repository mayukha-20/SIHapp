// backend/server.js
// Minimal Express server to mount placeholder routes
// This server is intentionally simple; expand as backend integrates with DB/auth.

const express = require("express");
const app = express();

app.use(express.json());

// Helper: safely mount a router only if the module exports a valid middleware/router
function safeMount(path, modulePath) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const mod = require(modulePath);
    const isMiddleware = typeof mod === "function";
    if (isMiddleware) {
      app.use(path, mod);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Skipping mount for ${path}: ${modulePath} did not export a router`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Skipping mount for ${path}: failed to require ${modulePath} (${e.message})`);
  }
}

// Mount placeholder routers & existing routes when available
app.use("/api/therapy-notes", require("./routes/therapyNotes"));
app.use("/api/resources", require("./routes/resources"));

// Attempt to mount existing routes (if they export routers)
safeMount("/api/auth", "./routes/auth");
safeMount("/api/appointments", "./routes/appointments");
safeMount("/api/centers", "./routes/centers");
safeMount("/api/chat", "./routes/chat");
safeMount("/api/feedback", "./routes/feedback");

// Optional: basic health check
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${PORT}`);
});