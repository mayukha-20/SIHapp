// frontend/src/api/therapyNoteApi.js
// Mock API wrapper for therapy notes matching the future real API contract
// TODO: replace mock functions with axios calls to API_URL when backend ready

import * as notesMock from "../mock/therapyNotes";

const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
const LS_KEY = "therapy_notes_v1";

function listFromModule(mod, preferredKeys = ["notes", "therapyNotes", "data", "list", "default"]) {
  if (!mod || typeof mod !== "object") return [];
  for (const k of preferredKeys) {
    const v = mod[k];
    if (Array.isArray(v)) return v;
  }
  const def = mod.default;
  if (Array.isArray(def)) return def;
  return [];
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveLocal(allNotes) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(allNotes ?? []));
  } catch (e) {
    // ignore in mock mode
  }
}

function mergeNotes(mockNotes, localNotes) {
  // Prefer local notes for same id
  const byId = new Map();
  for (const n of mockNotes) {
    if (n && (n.id != null || n._id != null)) {
      byId.set(String(n.id ?? n._id), n);
    }
  }
  for (const n of localNotes) {
    if (n && (n.id != null || n._id != null)) {
      byId.set(String(n.id ?? n._id), n);
    }
  }
  return Array.from(byId.values());
}

export async function getTherapyNotes(params = {}) {
  const { practitionerId, appointmentId } = params;
  const mock = listFromModule(notesMock, ["therapyNotes", "notes", "data", "list", "default"]);
  const local = loadLocal();
  let combined = mergeNotes(mock, local);
  if (practitionerId != null) {
    combined = combined.filter((n) => String(n?.practitionerId ?? "") === String(practitionerId));
  }
  if (appointmentId != null) {
    combined = combined.filter((n) => String(n?.appointmentId ?? "") === String(appointmentId));
  }
  await sleep();
  return combined.map((n) => ({
    id: n?.id ?? n?._id ?? Math.random().toString(36).slice(2),
    appointmentId: n?.appointmentId ?? null,
    practitionerId: n?.practitionerId ?? null,
    vitals: n?.vitals ?? "",
    observations: n?.observations ?? "",
    steps: n?.steps ?? "",
    recommendations: n?.recommendations ?? "",
    createdAt: n?.createdAt ?? new Date().toISOString(),
  }));
}

export async function createTherapyNote(payload) {
  // TODO: validate form inputs and sanitize before POST to backend
  const now = new Date().toISOString();
  const note = {
    id: Date.now(),
    createdAt: now,
    ...payload,
  };
  const local = loadLocal();
  local.push(note);
  saveLocal(local);

  // TODO: emit websocket event here to notify patient dashboards
  // e.g., socket.emit('therapy_note_created', { patientId, appointmentId, note })

  await sleep();
  return { success: true, note };
}