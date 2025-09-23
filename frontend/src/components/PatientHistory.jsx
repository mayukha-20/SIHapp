// frontend/src/components/PatientHistory.jsx
// Slide-over drawer showing patient's history: appointments, therapy notes, feedback

import React, { useMemo } from "react";
import { XMarkIcon, CalendarIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

function Section({ title, children }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-sm font-semibold text-slate-700">{title}</h3>
      {children}
    </section>
  );
}

export default function PatientHistory({ open, onClose, patient, appointments = [], therapyNotes = [], feedback = [] }) {
  const [therapyFilter, setTherapyFilter] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const filteredAppts = useMemo(() => {
    let list = appointments.slice();
    if (therapyFilter) list = list.filter((a) => a.therapy === therapyFilter);
    if (from) list = list.filter((a) => new Date(a.date) >= new Date(from));
    if (to) list = list.filter((a) => new Date(a.date) <= new Date(to));
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, therapyFilter, from, to]);

  const apptsSorted = filteredAppts;

  const notesByAppt = useMemo(() => {
    const m = new Map();
    for (const n of therapyNotes) {
      const k = String(n.appointmentId ?? "");
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(n);
    }
    for (const [, arr] of m) arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return m;
  }, [therapyNotes]);

  return (
    <div className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl ring-1 ring-amber-100 transition-transform flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between border-b border-amber-100 p-4 flex-shrink-0">
          <div>
            <div className="text-xs text-slate-500">Patient</div>
            <div className="text-lg font-bold text-slate-900">{patient?.name ?? "—"}</div>
          </div>
          <button className="rounded p-1 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-8">
          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
className="rounded-md border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-300"
              value={therapyFilter}
              onChange={(e) => setTherapyFilter(e.target.value)}
            >
              <option value="">All therapies</option>
              {[...new Set(appointments.map((a) => a.therapy))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="date"
className="rounded-md border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-300"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
className="rounded-md border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-300"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <Section title="Appointments">
            {apptsSorted.length === 0 ? (
              <div className="text-xs text-slate-500">No appointments.</div>
            ) : (
              <ul className="space-y-2">
                {apptsSorted.map((a) => (
<li key={a.id} className="rounded-lg border border-amber-100 bg-white p-3 text-xs shadow-sm">
                    <div className="mb-1 flex items-center gap-2 text-slate-700">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium">{new Date(a.date).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-600">Therapy: {a.therapy}</div>
<div className="mt-2 rounded bg-amber-50 p-2">
                      {(notesByAppt.get(String(a.id)) || []).length === 0 ? (
                        <div className="text-slate-500">No notes.</div>
                      ) : (
                        <ul className="space-y-2">
                          {(notesByAppt.get(String(a.id)) || []).map((n) => (
<li key={n.id} className="rounded border border-amber-100 bg-white p-2">
                              <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-500">
                                <ClipboardDocumentListIcon className="h-4 w-4" />
                                {new Date(n.createdAt).toLocaleString()}
                              </div>
                              <div className="text-slate-700"><span className="font-medium">Vitals:</span> {n.vitals || "—"}</div>
                              {n.observations && <div className="text-slate-600">{n.observations}</div>}
                              {n.recommendations && <div className="text-slate-600">{n.recommendations}</div>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Feedback">
            {feedback.length === 0 ? (
              <div className="text-xs text-slate-500">No feedback yet.</div>
            ) : (
              <ul className="space-y-2">
                {feedback.map((f) => (
<li key={f.id} className="rounded-lg border border-amber-100 bg-white p-3 text-xs shadow-sm">
                    <div className="mb-1 text-[11px] text-slate-500">Appointment #{f.appointmentId}</div>
                    {f.symptom && (
                      <div className="text-slate-700"><span className="font-medium">Symptom:</span> {f.symptom}</div>
                    )}
                    {f.notes && <div className="text-slate-600">{f.notes}</div>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
