// backend/controllers/therapyNoteController.js
// Placeholder controller for therapy notes
// Returns mock data or empty arrays; later will integrate with DB

// Attempt to read any seed data if present (optional)
const path = require("path");
let seed = {};
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  seed = require(path.join(__dirname, "..", "utils", "seedData"));
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("[therapy-notes] seedData not loaded:", e && (e.stack || e.message));
  seed = {};
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

// Fallback seed in case backend/utils/seedData.js is unavailable
const FALLBACK_THERAPY_NOTES = [
  { id: 1, appointmentId: 1, practitionerId: 4, vitals: 'BP:120/80', observations: 'Relaxed', steps: 'Abhyanga oil massage', recommendations: 'Rest 1 hour' },
  { id: 2, appointmentId: 2, practitionerId: 5, vitals: 'BP:118/78', observations: 'Calm', steps: 'Shirodhara', recommendations: 'Hydrate well' },
  { id: 3, appointmentId: 3, practitionerId: 6, vitals: 'BP:122/80', observations: 'Comfortable', steps: 'Pizhichil', recommendations: 'Avoid heavy food' },
  { id: 4, appointmentId: 4, practitionerId: 4, vitals: 'BP:120/80', observations: 'Energetic', steps: 'Kizhi', recommendations: 'Light walk' },
  { id: 5, appointmentId: 5, practitionerId: 5, vitals: 'BP:118/78', observations: 'Relaxed', steps: 'Udwarthanam', recommendations: 'Drink warm water' },
  { id: 6, appointmentId: 6, practitionerId: 6, vitals: 'BP:120/82', observations: 'Calm', steps: 'Abhyanga', recommendations: 'Rest 30 mins' },
  { id: 7, appointmentId: 7, practitionerId: 4, vitals: 'BP:119/77', observations: 'Relaxed', steps: 'Shirodhara', recommendations: 'Light meal' },
  { id: 8, appointmentId: 8, practitionerId: 5, vitals: 'BP:121/79', observations: 'Comfortable', steps: 'Pizhichil', recommendations: 'Hydrate well' },
  { id: 9, appointmentId: 9, practitionerId: 6, vitals: 'BP:117/76', observations: 'Energetic', steps: 'Kizhi', recommendations: 'Meditation' },
  { id: 10, appointmentId: 10, practitionerId: 4, vitals: 'BP:120/80', observations: 'Relaxed', steps: 'Udwarthanam', recommendations: 'Avoid caffeine' },
];

exports.getTherapyNotes = (req, res) => {
  const { practitionerId, appointmentId } = req.query || {};
  const notes = asArray(seed.therapyNotes || seed.notes || FALLBACK_THERAPY_NOTES);
  let result = notes;
  if (practitionerId != null) {
    result = result.filter((n) => String(n?.practitionerId ?? "") === String(practitionerId));
  }
  if (appointmentId != null) {
    result = result.filter((n) => String(n?.appointmentId ?? "") === String(appointmentId));
  }
  return res.json(result);
};

exports.createTherapyNote = (req, res) => {
  // TODO: validate form inputs and sanitize before POST to backend
  const { appointmentId, practitionerId, vitals, observations, steps, recommendations } = req.body || {};
  const note = {
    id: Date.now(),
    appointmentId,
    practitionerId,
    vitals: vitals || "",
    observations: observations || "",
    steps: steps || "",
    recommendations: recommendations || "",
    createdAt: new Date().toISOString(),
  };

  // TODO: emit websocket event here to notify patient dashboards
  // e.g., io.emit('therapy_note_created', { patientId, appointmentId, note })

  return res.json({ success: true, note });
};