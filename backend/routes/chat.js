// backend/routes/chat.js
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

// GET /api/chat?patientId={id}
router.get("/", (req, res) => {
  const { patientId } = req.query || {};
  let data = asArray(seed.chat || []);
  if (patientId != null) {
    data = data.filter((c) => String(c?.patientId ?? "") === String(patientId));
  }
  return res.json(data);
});

module.exports = router;