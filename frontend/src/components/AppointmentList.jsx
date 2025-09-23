// frontend/src/components/AppointmentList.jsx
// Schedule/Calendar list of appointments
// Tailwind CSS used for styling

import React from "react";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return String(iso ?? "");
  }
}

export default function AppointmentList({ appointments = [], selectedAppointmentId, onSelect }) {
  if (!Array.isArray(appointments) || appointments.length === 0) {
    return <div className="text-sm text-gray-500">No appointments scheduled.</div>;
  }
  return (
    <div className="divide-y divide-gray-100 animate-fade-in">
      {appointments.map((a, idx) => (
        <button
          key={a.id}
          type="button"
          className={
            "flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition-all duration-200 " +
            (String(selectedAppointmentId) === String(a.id)
              ? "bg-amber-50 ring-1 ring-amber-200"
              : "hover:-translate-y-0.5 hover:bg-white hover:shadow-sm")
          }
          style={{ animationDelay: `${idx * 40}ms` }}
          onClick={() => onSelect && onSelect(a.id)}
        >
          <div>
            <div className="text-sm font-semibold text-slate-900">{a.patientName}</div>
            <div className="text-xs text-slate-500">{a.therapy}</div>
          </div>
          <div className="text-xs text-slate-500">{formatDate(a.date)}</div>
        </button>
      ))}
    </div>
  );
}
