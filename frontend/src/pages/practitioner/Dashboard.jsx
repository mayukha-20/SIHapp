// frontend/src/pages/practitioner/Dashboard.jsx
// Practitioner Dashboard main page (JSX version)
// - Uses mock data from frontend/src/mock/*.js
// - Integrates PatientList, AppointmentList, TherapyForm, ResourceUpload
// - Tailwind CSS classes are used for styling

import React, { useEffect, useMemo, useState } from "react";
import PatientList from "../../components/PatientList.jsx";
import AppointmentList from "../../components/AppointmentList.jsx";
import TherapyForm from "../../components/TherapyForm.jsx";
import ResourceUpload from "../../components/ResourceUpload.jsx";
import { getAppointmentsByPractitioner } from "../../api/appointmentApi";
import { getTherapyNotes } from "../../api/therapyNoteApi";
import * as usersMock from "../../mock/users";
import * as feedbackMock from "../../mock/feedback";
import { CalendarIcon, ClipboardDocumentCheckIcon, UserGroupIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PatientHistory from "../../components/PatientHistory.jsx";

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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentFilter, setRecentFilter] = useState("today");

  // Helpers
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

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
          const today = new Date();
          const todays = appts.filter((a) => isSameDay(new Date(a.date), today));
          const first = (todays.length > 0 ? todays[0] : appts[0]) || null;
          setSelectedPatientId(first?.patientId ?? null);
          setSelectedAppointmentId(first?.id ?? null);
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

  // Today's appointments only
  const todaysAppointments = useMemo(() => {
    const today = new Date();
    let list = appointments.filter((a) => isSameDay(new Date(a.date), today));
    list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (selectedPatientId) list = list.filter((a) => String(a.patientId) === String(selectedPatientId));
    return list;
  }, [appointments, selectedPatientId]);

  const selectedAppointment = useMemo(() => {
    return appointments.find((a) => String(a.id) === String(selectedAppointmentId));
  }, [appointments, selectedAppointmentId]);

  // Derived dashboard KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    const todaysAppointmentsCount = appointments.filter((a) => isSameDay(new Date(a.date), today)).length;
    const nextAppointment = appointments
      .filter((a) => new Date(a.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const notesForMe = therapyNotes.filter((n) => String(n.practitionerId ?? "") === String(PRACTITIONER_ID));
    return {
      patients: patients.length,
      todaysAppointments: todaysAppointmentsCount,
      completedNotes: notesForMe.length,
      nextAppointment: nextAppointment ? new Date(nextAppointment.date) : null,
    };
  }, [appointments, therapyNotes, patients]);

  const handleNoteCreated = (note) => {
    setTherapyNotes((prev) => [note, ...prev]);
  };

  const fmtDateTime = (d) => (d ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");

  const achievements = useMemo(() => {
    const completed = therapyNotes.filter((n) => String(n.practitionerId ?? "") === String(PRACTITIONER_ID)).length;
    return [
      {
        title: "First Week Complete",
        achieved: completed >= 1,
        unlockedText: "First note created",
        lockedText: "Create your first therapy note",
      },
      {
        title: "Consistency Champion",
        achieved: completed >= 5,
        unlockedText: "5+ notes created",
        lockedText: "Create 5 therapy notes",
      },
      {
        title: "Halfway Hero",
        achieved: completed >= 7,
        unlockedText: "7+ notes completed",
        lockedText: "Create 7 therapy notes",
      },
      {
        title: "Wellness Warrior",
        achieved: completed >= 10,
        unlockedText: "10+ notes completed",
        lockedText: "Create 10 therapy notes",
      },
    ];
  }, [therapyNotes]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 flex flex-col">
      {/* Top Brand Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/70 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-sky-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" role="img" aria-label="AyurSutra leaf mark" className="h-5 w-5">
                <title>AyurSutra leaf mark</title>
                <path d="M12 3C7 6 6 11 12 20C18 11 17 6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 6v10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 9c-2 .2-3 .8-4 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 13c2 .2 3 .8 4 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </span>
            <span className="bg-gradient-to-r from-emerald-700 to-sky-700 bg-clip-text text-transparent">AyurSutra</span>
          </div>
        </div>
      </header>

      {/* Content Row */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white/80 p-5 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Patients</h2>
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelect={(id) => {
              setSelectedPatientId(id);
              const next = appointments.find((a) => String(a.patientId) === String(id));
              if (next) setSelectedAppointmentId(next.id);
            }}
            onDetails={(id) => {
              setSelectedPatientId(id);
              setHistoryOpen(true);
            }}
          />
          <div className="mt-8">
            <h3 className="mb-2 text-sm font-medium text-slate-600">Resources</h3>
            <ResourceUpload practitionerId={PRACTITIONER_ID} />
          </div>
        </aside>

        {/* Main */}
        <main className="relative flex-1 p-8">
          <div className="mb-6">
            <h1 className="bg-gradient-to-r from-emerald-700 to-sky-700 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-sm">Practitioner Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Overview and session management</p>
          </div>

          {/* KPI Cards */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-scale-in">
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><UserGroupIcon className="h-6 w-6"/></span>
              <div>
                <div className="text-xs text-slate-500">Patients</div>
                <div className="text-xl font-bold text-slate-900">{kpis.patients}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-scale-in">
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><CalendarIcon className="h-6 w-6"/></span>
              <div>
                <div className="text-xs text-slate-500">Today's Appointments</div>
                <div className="text-xl font-bold text-slate-900">{kpis.todaysAppointments}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-scale-in">
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><ClipboardDocumentCheckIcon className="h-6 w-6"/></span>
              <div>
                <div className="text-xs text-slate-500">Notes Created</div>
                <div className="text-xl font-bold text-slate-900">{kpis.completedNotes}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 animate-scale-in">
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><CheckCircleIcon className="h-6 w-6"/></span>
              <div>
                <div className="text-xs text-slate-500">Next Appointment</div>
                <div className="text-sm font-semibold text-slate-900">{fmtDateTime(kpis.nextAppointment)}</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-6 w-1/3 animate-shimmer rounded bg-slate-200/80"></div>
              <div className="h-28 w-full animate-shimmer rounded bg-slate-200/60"></div>
              <div className="h-64 w-full animate-shimmer rounded bg-slate-200/60"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <section className="xl:col-span-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 animate-scale-in">
                <h2 className="mb-4 text-lg font-semibold text-slate-800">Today's Appointments</h2>
                <AppointmentList
                  appointments={todaysAppointments}
                  selectedAppointmentId={selectedAppointmentId}
                  onSelect={setSelectedAppointmentId}
                />
              </section>

              <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 animate-scale-in">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">Recent Therapy Notes</h2>
                  <select
                    className="rounded-md border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300"
                    value={recentFilter}
                    onChange={(e) => setRecentFilter(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="all">All</option>
                  </select>
                </div>
                {(() => {
                  const msDay = 24 * 60 * 60 * 1000;
                  const now = new Date();
                  const filtered = therapyNotes
                    .filter((n) => {
                      const dt = new Date(n.createdAt || now);
                      if (recentFilter === "today") {
                        return isSameDay(dt, now);
                      }
                      if (recentFilter === "7") {
                        return now - dt <= 7 * msDay;
                      }
                      if (recentFilter === "30") {
                        return now - dt <= 30 * msDay;
                      }
                      return true; // all
                    })
                    .sort((a, b) => new Date(b.createdAt || now) - new Date(a.createdAt || now))
                    .slice(0, 8);

                  return filtered.length === 0 ? (
                    <div className="text-sm text-slate-500">No notes in this period.</div>
                  ) : (
                    <ul className="space-y-3">
                      {filtered.map((n) => (
                        <li key={n.id} className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm">
                          <div className="mb-1 text-[11px] text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
                          <div className="font-medium text-slate-800">Vitals: {n.vitals || "—"}</div>
                          {n.observations && <div className="text-slate-600">{n.observations}</div>}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </section>

              <section className="xl:col-span-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 animate-scale-in">
                <h2 className="mb-4 text-lg font-semibold text-slate-800">Therapy Note</h2>
                {selectedAppointment ? (
                  <TherapyForm
                    appointment={selectedAppointment}
                    practitionerId={PRACTITIONER_ID}
                    onNoteCreated={handleNoteCreated}
                  />
                ) : (
                  <div className="text-slate-500">Select an appointment to create a note.</div>
                )}
              </section>
            </div>
          )}

          {/* Patient History Drawer */}
          <PatientHistory
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
            patient={selectedPatientId ? userIndex.get(String(selectedPatientId)) : null}
            appointments={appointments.filter((a) => String(a.patientId) === String(selectedPatientId))}
            therapyNotes={therapyNotes.filter((n) =>
              appointments.some((a) => String(a.patientId) === String(selectedPatientId) && String(a.id) === String(n.appointmentId))
            )}
            feedback={(function () {
              const list = (function listFromModule(mod, keys = ["feedback", "data", "list", "default"]) {
                if (!mod || typeof mod !== "object") return [];
                for (const k of keys) {
                  const v = mod[k];
                  if (Array.isArray(v)) return v;
                }
                const def = mod.default;
                return Array.isArray(def) ? def : [];
              })(feedbackMock);
              return list.filter((f) => String(f.patientId ?? "") === String(selectedPatientId));
            })()}
          />
        </main>
      </div>
    </div>
  );
}
