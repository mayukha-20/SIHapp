// frontend/src/components/Achievements.jsx
// Simple achievements/badges row inspired by the screenshot

import React from "react";
import { TrophyIcon, StarIcon, CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

export default function Achievements({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">Achievements</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a, idx) => (
          <div
            key={idx}
            className={
              "flex items-center gap-3 rounded-xl border p-3 shadow-sm transition " +
              (a.achieved
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-slate-200 bg-white opacity-80")
            }
          >
            <span
              className={
                "rounded-lg p-2 " +
                (a.achieved ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600")
              }
            >
              {idx === 0 && <TrophyIcon className="h-6 w-6" />}
              {idx === 1 && <StarIcon className="h-6 w-6" />}
              {idx === 2 && <CheckBadgeIcon className="h-6 w-6" />}
              {idx === 3 && <ShieldCheckIcon className="h-6 w-6" />}
            </span>
            <div>
              <div className="text-sm font-medium text-slate-900">{a.title}</div>
              <div className="text-xs text-slate-600">{a.achieved ? a.unlockedText : a.lockedText}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}