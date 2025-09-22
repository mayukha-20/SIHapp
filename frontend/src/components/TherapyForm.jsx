// frontend/src/components/TherapyForm.jsx
// Note form with local save using therapyNoteApi mock
// Tailwind CSS used for styling

import React, { useEffect, useState } from "react";
import { createTherapyNote, getTherapyNotes } from "../api/therapyNoteApi";

export default function TherapyForm({ appointment, practitionerId, onNoteCreated }) {
  const [vitals, setVitals] = useState("");
  const [observations, setObservations] = useState("");
  const [steps, setSteps] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadExisting() {
      if (!appointment?.id) return;
      const notes = await getTherapyNotes({ appointmentId: appointment.id });
      if (!mounted) return;
      if (notes && notes.length > 0) {
        const latest = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setVitals(latest.vitals || "");
        setObservations(latest.observations || "");
        setSteps(latest.steps || "");
        setRecommendations(latest.recommendations || "");
      } else {
        setVitals("");
        setObservations("");
        setSteps("");
        setRecommendations("");
      }
    }
    loadExisting();
    return () => {
      mounted = false;
    };
  }, [appointment?.id]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // TODO: validate form inputs and sanitize before POST to backend

    const payload = {
      appointmentId: appointment?.id,
      practitionerId,
      vitals,
      observations,
      steps,
      recommendations,
    };

    const res = await createTherapyNote(payload);
    setSaving(false);
    if (res?.success) {
      setMessage("Note saved locally (mock).");
      if (onNoteCreated) onNoteCreated(res.note);
      // TODO: emit websocket event here to notify patient dashboards
    } else {
      setMessage("Failed to save note.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="animate-slide-up">
          <label className="mb-1 block text-sm font-medium text-slate-700">Vitals</label>
          <textarea
            className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            rows={3}
            value={vitals}
            onChange={(e) => setVitals(e.target.value)}
            placeholder="BP, HR, Temp, etc."
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "40ms" }}>
          <label className="mb-1 block text-sm font-medium text-slate-700">Observations</label>
          <textarea
            className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Clinical observations"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
          <label className="mb-1 block text-sm font-medium text-slate-700">Steps</label>
          <textarea
            className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            rows={3}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="Therapy steps performed"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
          <label className="mb-1 block text-sm font-medium text-slate-700">Recommendations</label>
          <textarea
            className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            rows={3}
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Post-therapy recommendations"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Appointment: <span className="font-medium text-slate-700">{appointment?.therapy || ""}</span>
        </div>
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Note"}
        </button>
      </div>

      {message && <div className="text-sm text-emerald-700 animate-fade-in">{message}</div>}
    </form>
  );
}
