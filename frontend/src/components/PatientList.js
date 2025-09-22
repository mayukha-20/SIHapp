// frontend/src/components/PatientList.js
// Left sidebar patient list for the practitioner
// Tailwind CSS used for styling

import React from "react";

export default function PatientList({ patients = [], selectedPatientId, onSelect }) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="text-sm text-gray-500">No patients found.</div>;
  }
  return (
    <ul className="space-y-2">
      {patients.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className={
              "w-full rounded px-3 py-2 text-left text-sm transition " +
              (String(selectedPatientId) === String(p.id)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200")
            }
            onClick={() => onSelect && onSelect(p.id)}
          >
            <span className="font-medium">{p.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
