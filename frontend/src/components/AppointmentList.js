// frontend/src/components/AppointmentList.js
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
    <div className="divide-y divide-gray-100">
      {appointments.map((a) => (
        <button
          key={a.id}
          type="button"
          className={
            "flex w-full items-center justify-between px-3 py-3 text-left transition " +
            (String(selectedAppointmentId) === String(a.id)
              ? "bg-blue-50"
              : "hover:bg-gray-50")
          }
          onClick={() => onSelect && onSelect(a.id)}
        >
          <div>
            <div className="text-sm font-medium text-gray-900">{a.patientName}</div>
            <div className="text-xs text-gray-500">{a.therapy}</div>
          </div>
          <div className="text-xs text-gray-500">{formatDate(a.date)}</div>
        </button>
      ))}
    </div>
  );
}
