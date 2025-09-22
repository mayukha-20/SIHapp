// frontend/src/components/ResourceUpload.jsx
// Mock resource upload (local only) + list display
// Tailwind CSS used for styling

import React, { useEffect, useState } from "react";
import * as resMock from "../mock/resources";

function listFromModule(mod, preferredKeys = ["resources", "data", "list", "default"]) {
  if (!mod || typeof mod !== "object") return [];
  for (const k of preferredKeys) {
    const v = mod[k];
    if (Array.isArray(v)) return v;
  }
  const def = mod.default;
  if (Array.isArray(def)) return def;
  return [];
}

const LS_PREFIX = "resources_v1_";

export default function ResourceUpload({ practitionerId }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const lsKey = `${LS_PREFIX}${practitionerId ?? "unknown"}`;

  useEffect(() => {
    const mock = listFromModule(resMock);
    try {
      const raw = localStorage.getItem(lsKey);
      const local = raw ? JSON.parse(raw) : [];
      setItems([...(Array.isArray(mock) ? mock : []), ...(Array.isArray(local) ? local : [])]);
    } catch (e) {
      setItems(Array.isArray(mock) ? mock : []);
    }
  }, [lsKey]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    // Simulate upload and save to localStorage
    const resource = {
      id: Date.now(),
      practitionerId,
      title: title || (file ? file.name : "Untitled"),
      fileName: file ? file.name : undefined,
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(lsKey);
      const local = raw ? JSON.parse(raw) : [];
      local.push(resource);
      localStorage.setItem(lsKey, JSON.stringify(local));
      setItems((prev) => [resource, ...prev]);
      setTitle("");
      setFile(null);
    } finally {
      setSaving(false);
    }
    // TODO: replace mock functions with axios calls to API_URL when backend ready
  }

  return (
    <div className="animate-fade-in">
      <form onSubmit={onSubmit} className="space-y-2">
        <input
          type="text"
          className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300"
          placeholder="Resource title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700 hover:file:bg-emerald-100"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Uploading…" : "Upload (Mock)"}
        </button>
      </form>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-semibold">My Resources</h4>
        {items.length === 0 ? (
          <div className="text-xs text-slate-500">No resources yet.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((r, idx) => (
              <li key={r.id} className="rounded-md border border-slate-200 bg-white p-2 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="font-medium">{r.title}</div>
                <div className="text-slate-500">{r.fileName || "(mock)"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
