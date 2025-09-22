// backend/routes/feedback.js
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

// GET /api/feedback?patientId={id}&appointmentId={id}
router.get("/", (req, res) => {
  const { patientId, appointmentId } = req.query || {};
  let data = asArray(seed.feedback || []);
  if (patientId != null) {
    data = data.filter((f) => String(f?.patientId ?? "") === String(patientId));
  }
  if (appointmentId != null) {
    data = data.filter((f) => String(f?.appointmentId ?? "") === String(appointmentId));
  }
  return res.json(data);
});

module.exports = router;