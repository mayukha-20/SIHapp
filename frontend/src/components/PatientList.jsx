// frontend/src/components/PatientList.jsx
// Left sidebar patient list for the practitioner
// Tailwind CSS used for styling

import React from "react";

export default function PatientList({ patients = [], selectedPatientId, onSelect, onDetails }) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="text-sm text-gray-500">No patients found.</div>;
  }
  return (
    <ul className="space-y-2 animate-fade-in">
      {patients.map((p, idx) => (
        <li key={p.id} className="animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
          <button
            type="button"
            className={
              "group flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left text-sm transition-all duration-200 " +
              (String(selectedPatientId) === String(p.id)
                ? "bg-emerald-600 text-white shadow-md ring-1 ring-emerald-300"
                : "bg-white hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-emerald-100")
            }
            onClick={() => {
              if (onSelect) onSelect(p.id);
              if (onDetails) onDetails(p.id); // open history drawer when clicking the row
            }}
          >
            <span className="font-medium">{p.name}</span>
            <span className="ml-2 hidden text-xs text-emerald-700 group-hover:inline">Details</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
