// frontend/src/api/appointmentApi.js
// Mock API wrapper for appointments matching the future real API contract
// TODO: replace mock functions with axios calls to API_URL when backend ready

// We intentionally read from mock files for now.
import * as apptMock from "../mock/appointments";
import * as usersMock from "../mock/users";

const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));

function listFromModule(mod, preferredKeys = ["appointments", "users", "data", "list", "default"]) {
  if (!mod || typeof mod !== "object") return [];
  for (const k of preferredKeys) {
    const v = mod[k];
    if (Array.isArray(v)) return v;
  }
  const def = mod.default;
  if (Array.isArray(def)) return def;
  return [];
}

function indexById(items) {
  const map = new Map();
  for (const it of items) {
    const id = it?.id ?? it?._id;
    if (id != null) map.set(String(id), it);
  }
  return map;
}

export async function getAppointmentsByPractitioner(practitionerId) {
  // Note: practitionerId is required by contract. We still handle undefined gracefully.
  const appointments = listFromModule(apptMock, ["appointments", "data", "list", "default"]);
  const users = listFromModule(usersMock, ["users", "data", "list", "default"]);
  const userIndex = indexById(users);

  let filtered = appointments;
  if (practitionerId != null) {
    filtered = appointments.filter((a) => String(a?.practitionerId ?? "") === String(practitionerId));
  }

  const normalized = filtered.map((a) => {
    const patientId = a?.patientId ?? a?.patient?.id ?? a?.patient?._id;
    const patient = patientId != null ? userIndex.get(String(patientId)) : undefined;
    const patientName = a?.patientName ?? patient?.name ?? patient?.fullName ?? "Unknown";
    return {
      id: a?.id ?? a?._id ?? Math.random().toString(36).slice(2),
      patientId: patientId ?? null,
      patientName,
      centerId: a?.centerId ?? a?.center?._id ?? a?.center?.id ?? null,
      therapy: a?.therapy ?? a?.type ?? "",
      date: a?.date ?? a?.scheduledAt ?? a?.createdAt ?? new Date().toISOString(),
      practitionerId: a?.practitionerId ?? practitionerId ?? null,
    };
  });

  await sleep();
  return normalized;
}