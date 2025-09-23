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
import { CalendarIcon, ClipboardDocumentCheckIcon, UserGroupIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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
    console.log('Today is:', today.toDateString());
    
    // Filter appointments for practitioner 4 and today only
    let list = appointments.filter((a) => {
      const appointmentDate = new Date(a.date);
      const isPractitioner4 = String(a.practitionerId) === String(PRACTITIONER_ID);
      const isToday = isSameDay(appointmentDate, today);
      
      console.log(`Appointment ${a.id}: Date=${appointmentDate.toDateString()}, Practitioner=${a.practitionerId}, IsToday=${isToday}, IsPractitioner4=${isPractitioner4}`);
      
      return isPractitioner4 && isToday;
    });
    
    list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('Today\'s appointments for practitioner 4:', list);
    
    return list;
  }, [appointments]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" role="img" aria-label="AyurSutra leaf mark" className="h-5 w-5">
                <title>AyurSutra leaf mark</title>
                <path d="M12 3C7 6 6 11 12 20C18 11 17 6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 6v10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 9c-2 .2-3 .8-4 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 13c2 .2 3 .8 4 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </span>
            <span className="text-xl font-bold text-amber-800">AyurSutra</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <span>🧘 Ritucharya Guidance</span>
            </div>
            <div className="text-sm text-slate-600">Welcome, practitioner</div>
            <button className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Practitioner Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Welcome back, Dr. practitioner! Here's your schedule for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpis.todaysAppointments}</div>
                <div className="text-sm text-slate-600">Today's Appointments</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-blue-50 opacity-50"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <span className="text-xl font-bold text-green-600">28</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">This Week</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-green-50 opacity-50"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpis.patients}</div>
                <div className="text-sm text-slate-600">Total Patients</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-purple-50 opacity-50"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <span className="text-xl font-bold text-orange-600">4.8</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Rating</div>
                <div className="text-sm text-slate-600">Patient Feedback</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-orange-50 opacity-50"></div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-6 text-lg font-semibold text-slate-800">Today's Appointments</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 animate-shimmer rounded-lg bg-slate-100"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysAppointments.map((appointment, idx) => {
                    const patient = userIndex.get(String(appointment.patientId));
                    const time = new Date(appointment.date).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    });
                    
                    const statusColors = {
                      confirmed: 'bg-green-100 text-green-800',
                      pending: 'bg-yellow-100 text-yellow-800',
                      completed: 'bg-blue-100 text-blue-800'
                    };
                    
                    const status = idx === 0 ? 'confirmed' : idx === 1 ? 'confirmed' : idx === 2 ? 'pending' : 'confirmed';
                    
                    return (
                      <div
                        key={appointment.id}
                        className={`flex items-center justify-between rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md ${
                          String(selectedAppointmentId) === String(appointment.id)
                            ? 'border-amber-300 bg-amber-50 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          setSelectedAppointmentId(appointment.id);
                          setSelectedPatientId(appointment.patientId);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-slate-600">{time}</div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {patient?.name || appointment.patientName}
                            </div>
                            <div className="text-sm text-slate-500">{appointment.therapy}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
                            {status}
                          </span>
                          <button 
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatientId(appointment.patientId);
                              setHistoryOpen(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {todaysAppointments.length === 0 && (
                    <div className="py-12 text-center">
                      <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
                      <h3 className="mt-2 text-sm font-medium text-slate-900">No appointments today</h3>
                      <p className="mt-1 text-sm text-slate-500">Enjoy your day off!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent Notes */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Quick Actions</h2>
              
              <div className="space-y-3">
                <button 
                  className="w-full rounded-lg bg-amber-600 p-3 text-left text-white hover:bg-amber-700 transition-colors"
                  onClick={() => {
                    if (selectedAppointment) {
                      // Scroll to therapy form if appointment selected
                      document.querySelector('#therapy-form')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      alert('Please select an appointment first to add notes.');
                    }
                  }}
                >
                  <div className="font-medium">Add Patient Notes</div>
                </button>
                
                <button 
                  className="w-full rounded-lg bg-blue-600 p-3 text-left text-white hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // For now, show a simple alert. Later can integrate with calendar
                    alert('Schedule Appointment feature coming soon!');
                  }}
                >
                  <div className="font-medium">Schedule Appointment</div>
                </button>
                
                <button 
                  className="w-full rounded-lg bg-green-600 p-3 text-left text-white hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (selectedPatientId) {
                      setHistoryOpen(true);
                    } else {
                      alert('Please select a patient first to view their history.');
                    }
                  }}
                >
                  <div className="font-medium">View Patient History</div>
                </button>
                
                <button 
                  className="w-full rounded-lg bg-purple-600 p-3 text-left text-white hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    if (selectedPatientId) {
                      alert('Generate Prescription feature coming soon!');
                    } else {
                      alert('Please select a patient first to generate prescription.');
                    }
                  }}
                >
                  <div className="font-medium">Generate Prescription</div>
                </button>
              </div>
            </div>

            {/* Recent Notes */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Recent Notes</h2>
                <select
                  className="rounded-md border border-slate-200 px-3 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  value={recentFilter}
                  onChange={(e) => setRecentFilter(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="all">All</option>
                </select>
              </div>
              
              <div className="space-y-3">
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
                      return true;
                    })
                    .sort((a, b) => new Date(b.createdAt || now) - new Date(a.createdAt || now))
                    .slice(0, 4);

                  return filtered.length === 0 ? (
                    <div className="py-8 text-center">
                      <ClipboardDocumentCheckIcon className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm text-slate-500">No notes in this period.</p>
                    </div>
                  ) : (
                    filtered.map((note) => {
                      const patient = appointments.find(a => String(a.id) === String(note.appointmentId));
                      const patientName = patient ? userIndex.get(String(patient.patientId))?.name || patient.patientName : 'Unknown';
                      
                      return (
                        <div key={note.id} className="rounded-lg border border-slate-200 p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="font-medium text-slate-900">{patientName}</div>
                            <div className="text-xs text-slate-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">
                            {note.observations ? note.observations.substring(0, 60) + '...' : 'Responded well to Panchakarma treatment. Continue with current regimen.'}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {Math.floor(Math.random() * 10) + 1} days ago
                          </div>
                        </div>
                      );
                    })
                  );
                })()}
              </div>
            </div>

            {/* This Month Stats */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">This Month</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Consultations</div>
                  <div className="font-medium text-slate-900">45</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Panchakarmas</div>
                  <div className="font-medium text-slate-900">12</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Messages</div>
                  <div className="font-medium text-slate-900">28</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Follow-ups</div>
                  <div className="font-medium text-slate-900">18</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Therapy Form Section */}
        {selectedAppointment && (
          <div id="therapy-form" className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Therapy Note for {userIndex.get(String(selectedAppointment.patientId))?.name || selectedAppointment.patientName}</h2>
            <TherapyForm
              appointment={selectedAppointment}
              practitionerId={PRACTITIONER_ID}
              onNoteCreated={handleNoteCreated}
            />
          </div>
        )}
      </div>

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
    </div>
  );
}
