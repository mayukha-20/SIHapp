// backend/routes/centers.js
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

// GET /api/centers
router.get("/", (req, res) => {
  return res.json(asArray(seed.centers || []));
});

module.exports = router;