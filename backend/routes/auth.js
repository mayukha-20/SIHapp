// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const path = require("path");

let seed = {};
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  seed = require(path.join(__dirname, "..", "utils", "seedData"));
} catch (_) {
  seed = {};
}

function asArray(v) { return Array.isArray(v) ? v : []; }

// Minimal users listing for testing: GET /api/auth/users?role=patient|practitioner|admin
router.get("/users", (req, res) => {
  const { role } = req.query || {};
  let users = asArray(seed.users || []);
  if (role) users = users.filter((u) => String(u.role) === String(role));
  return res.json(users);
});

module.exports = router;