// backend/routes/appointments.js
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

// GET /api/appointments?practitionerId={id}&patientId={id}
router.get("/", (req, res) => {
  const { practitionerId, patientId } = req.query || {};
  let data = asArray(seed.appointments || []);
  if (practitionerId != null) {
    data = data.filter((a) => String(a?.practitionerId ?? "") === String(practitionerId));
  }
  if (patientId != null) {
    data = data.filter((a) => String(a?.patientId ?? "") === String(patientId));
  }
  return res.json(data);
});

module.exports = router;