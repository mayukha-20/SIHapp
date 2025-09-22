// backend/routes/therapyNotes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/therapyNoteController");

// GET /api/therapy-notes?practitionerId={id} or ?appointmentId={id}
router.get("/", ctrl.getTherapyNotes);

// POST /api/therapy-notes
router.post("/", ctrl.createTherapyNote);

module.exports = router;