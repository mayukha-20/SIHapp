// backend/controllers/resourceController.js
// Placeholder controller for resources

const path = require("path");
let seed = {};
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  seed = require(path.join(__dirname, "..", "utils", "seedData"));
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("[resources] seedData not loaded:", e && (e.stack || e.message));
  seed = {};
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

// Fallback seed in case backend/utils/seedData.js is unavailable
const FALLBACK_RESOURCES = [
  { id: 1, practitionerId: 4, title: 'Abhyanga Guide', url: 'https://example.com/abhyanga.pdf' },
  { id: 2, practitionerId: 5, title: 'Shirodhara Guide', url: 'https://example.com/shirodhara.pdf' },
  { id: 3, practitionerId: 6, title: 'Pizhichil Instructions', url: 'https://example.com/pizhichil.pdf' },
  { id: 4, practitionerId: 4, title: 'Kizhi Steps', url: 'https://example.com/kizhi.pdf' },
  { id: 5, practitionerId: 5, title: 'Udwarthanam Guide', url: 'https://example.com/udwarthanam.pdf' },
  { id: 6, practitionerId: 6, title: 'Diet Guidelines', url: 'https://example.com/diet.pdf' },
  { id: 7, practitionerId: 4, title: 'Meditation Practices', url: 'https://example.com/meditation.pdf' },
  { id: 8, practitionerId: 5, title: 'Yoga Asanas', url: 'https://example.com/yoga.pdf' },
  { id: 9, practitionerId: 6, title: 'Post-Therapy Care', url: 'https://example.com/postcare.pdf' },
  { id: 10, practitionerId: 4, title: 'Herbal Therapy', url: 'https://example.com/herbal.pdf' },
];

exports.getResources = (req, res) => {
  const { practitionerId } = req.query || {};
  let resources = asArray(seed.resources || FALLBACK_RESOURCES);
  if (practitionerId != null) {
    resources = resources.filter((r) => String(r?.practitionerId ?? "") === String(practitionerId));
  }
  return res.json(resources);
};

exports.createResource = (req, res) => {
  const { practitionerId, title } = req.body || {};
  // Note: file handling will be added later (multipart/form-data)
  const resource = {
    id: Date.now(),
    practitionerId,
    title: title || "Untitled",
    url: "", // to be filled when file storage is added
    createdAt: new Date().toISOString(),
  };
  return res.json({ success: true, resource });
};