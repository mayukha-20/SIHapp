// backend/routes/resources.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/resourceController");

// GET /api/resources?practitionerId={id}
router.get("/", ctrl.getResources);

// POST /api/resources (multipart/form-data later)
router.post("/", ctrl.createResource);

module.exports = router;