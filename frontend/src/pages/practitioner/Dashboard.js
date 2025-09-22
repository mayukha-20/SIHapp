// frontend/src/pages/practitioner/Dashboard.js
// Practitioner Dashboard main page
// - Uses mock data from frontend/src/mock/*.js
// - Integrates PatientList, AppointmentList, TherapyForm, ResourceUpload
// - Tailwind CSS classes are used for styling

import React, { useEffect, useMemo, useState } from "react";
import PatientList from "../../components/PatientList";
import AppointmentList from "../../components/AppointmentList";
import TherapyForm from "../../components/TherapyForm";
import ResourceUpload from "../../components/ResourceUpload";
import { getAppointmentsByPractitioner } from "../../api/appointmentApi";
import { getTherapyNotes } from "../../api/therapyNoteApi";
import * as usersMock from "../../mock/users";

// TODO: replace PRACTITIONER_ID with AuthContext user id
const PRACTITIONER_ID = 4;

function listFromModule(mod, preferredKeys = ["users", "data", "list", "default"]) {
  if (!mod || typeof mod !== "object") return [];
  for (const k of preferredKeys) {
    const v = mod[k];
    if (Array.isArray(v)) return v;
  }
  const def = mod.default;
  if (Array.isArray(def)) return def;
  return [];
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [therapyNotes, setTherapyNotes] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const users = useMemo(() => listFromModule(usersMock), []);
  const userIndex = useMemo(() => new Map(users.map((u) => [String(u.id ?? u._id), u])), [users]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [appts, notes] = await Promise.all([
          getAppointmentsByPractitioner(PRACTITIONER_ID),
          getTherapyNotes({ practitionerId: PRACTITIONER_ID }),
        ]);
        if (!mounted) return;
        setAppointments(appts);
        setTherapyNotes(notes);
        if (appts.length > 0) {
          setSelectedPatientId(appts[0].patientId ?? null);
          setSelectedAppointmentId(appts[0].id ?? null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const patients = useMemo(() => {
    const unique = new Map();
    for (const a of appointments) {
      const pid = a?.patientId;
      if (pid == null) continue;
      if (!unique.has(String(pid))) {
        const u = userIndex.get(String(pid));
        unique.set(String(pid), {
          id: pid,
          name: a?.patientName ?? u?.name ?? u?.fullName ?? `Patient ${pid}`,
        });
      }
    }
    return Array.from(unique.values());
  }, [appointments, userIndex]);

  const filteredAppointments = useMemo(() => {
    const list = appointments.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!selectedPatientId) return list;
    return list.filter((a) => String(a.patientId) === String(selectedPatientId));
  }, [appointments, selectedPatientId]);

  const selectedAppointment = useMemo(() => {
    return appointments.find((a) => String(a.id) === String(selectedAppointmentId));
  }, [appointments, selectedAppointmentId]);

  const handleNoteCreated = (note) => {
    setTherapyNotes((prev) => [note, ...prev]);
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Patients</h2>
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelect={(id) => {
            setSelectedPatientId(id);
            const next = appointments.find((a) => String(a.patientId) === String(id));
            if (next) setSelectedAppointmentId(next.id);
          }}
        />
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-medium text-gray-600">Resources</h3>
          <ResourceUpload practitionerId={PRACTITIONER_ID} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Practitioner Dashboard</h1>
          <p className="text-sm text-gray-500">Schedule and therapy notes</p>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : (
          <>
            <section className="mb-6 rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold">Today's Appointments</h2>
              <AppointmentList
                appointments={filteredAppointments}
                selectedAppointmentId={selectedAppointmentId}
                onSelect={setSelectedAppointmentId}
              />
            </section>

            <section className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold">Therapy Note</h2>
              {selectedAppointment ? (
                <TherapyForm
                  appointment={selectedAppointment}
                  practitionerId={PRACTITIONER_ID}
                  onNoteCreated={handleNoteCreated}
                />
              ) : (
                <div className="text-gray-500">Select an appointment to create a note.</div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}