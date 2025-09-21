// backend/utils/seedData.js

// ------------------ Users ------------------
export const users = [
  { id: 1, role: 'patient', name: 'Alice Sharma', email: 'alice@example.com', phone: '9876543210' },
  { id: 2, role: 'patient', name: 'Bob Verma', email: 'bob@example.com', phone: '9876543211' },
  { id: 3, role: 'patient', name: 'Charlie Rao', email: 'charlie@example.com', phone: '9876543212' },
  { id: 4, role: 'practitioner', name: 'Dr. Deepak', email: 'deepak@example.com', phone: '9876543220' },
  { id: 5, role: 'practitioner', name: 'Dr. Meera', email: 'meera@example.com', phone: '9876543221' },
  { id: 6, role: 'practitioner', name: 'Dr. Ramesh', email: 'ramesh@example.com', phone: '9876543222' },
  { id: 7, role: 'admin', name: 'Admin1', email: 'admin1@example.com', phone: '9876543230' },
  { id: 8, role: 'admin', name: 'Admin2', email: 'admin2@example.com', phone: '9876543231' },
  { id: 9, role: 'patient', name: 'Esha Gupta', email: 'esha@example.com', phone: '9876543213' },
  { id: 10, role: 'patient', name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543214' },
];

// ------------------ Centers ------------------
export const centers = [
  { id: 1, name: 'Ayurveda Wellness Center', location: 'Delhi' },
  { id: 2, name: 'Kerala Panchakarma Hub', location: 'Kerala' },
  { id: 3, name: 'Healing Touch Ayurveda', location: 'Mumbai' },
  { id: 4, name: 'Ayurveda Life Care', location: 'Bangalore' },
  { id: 5, name: 'Niramaya Panchakarma', location: 'Pune' },
  { id: 6, name: 'Ayush Wellness', location: 'Hyderabad' },
  { id: 7, name: 'Tridosha Healing', location: 'Chennai' },
  { id: 8, name: 'Swasthya Panchakarma', location: 'Kolkata' },
  { id: 9, name: 'Divya Ayurveda Center', location: 'Jaipur' },
  { id: 10, name: 'Prana Healing Hub', location: 'Ahmedabad' },
];

// ------------------ Appointments ------------------
export const appointments = [
  { id: 1, patientId: 1, practitionerId: 4, centerId: 1, therapy: 'Abhyanga', date: '2025-09-22T10:00:00Z' },
  { id: 2, patientId: 2, practitionerId: 5, centerId: 2, therapy: 'Shirodhara', date: '2025-09-22T11:00:00Z' },
  { id: 3, patientId: 3, practitionerId: 6, centerId: 3, therapy: 'Pizhichil', date: '2025-09-22T12:00:00Z' },
  { id: 4, patientId: 9, practitionerId: 4, centerId: 4, therapy: 'Kizhi', date: '2025-09-23T10:00:00Z' },
  { id: 5, patientId: 10, practitionerId: 5, centerId: 5, therapy: 'Udwarthanam', date: '2025-09-23T11:00:00Z' },
  { id: 6, patientId: 1, practitionerId: 6, centerId: 6, therapy: 'Abhyanga', date: '2025-09-24T09:00:00Z' },
  { id: 7, patientId: 2, practitionerId: 4, centerId: 7, therapy: 'Shirodhara', date: '2025-09-24T10:00:00Z' },
  { id: 8, patientId: 3, practitionerId: 5, centerId: 8, therapy: 'Pizhichil', date: '2025-09-24T11:00:00Z' },
  { id: 9, patientId: 9, practitionerId: 6, centerId: 9, therapy: 'Kizhi', date: '2025-09-25T09:00:00Z' },
  { id: 10, patientId: 10, practitionerId: 4, centerId: 10, therapy: 'Udwarthanam', date: '2025-09-25T10:00:00Z' },
];

// ------------------ Therapy Notes ------------------
export const therapyNotes = [
  { id: 1, appointmentId: 1, vitals: 'BP:120/80', observations: 'Relaxed', steps: 'Abhyanga oil massage', recommendations: 'Rest 1 hour' },
  { id: 2, appointmentId: 2, vitals: 'BP:118/78', observations: 'Calm', steps: 'Shirodhara', recommendations: 'Hydrate well' },
  { id: 3, appointmentId: 3, vitals: 'BP:122/80', observations: 'Comfortable', steps: 'Pizhichil', recommendations: 'Avoid heavy food' },
  { id: 4, appointmentId: 4, vitals: 'BP:120/80', observations: 'Energetic', steps: 'Kizhi', recommendations: 'Light walk' },
  { id: 5, appointmentId: 5, vitals: 'BP:118/78', observations: 'Relaxed', steps: 'Udwarthanam', recommendations: 'Drink warm water' },
  { id: 6, appointmentId: 6, vitals: 'BP:120/82', observations: 'Calm', steps: 'Abhyanga', recommendations: 'Rest 30 mins' },
  { id: 7, appointmentId: 7, vitals: 'BP:119/77', observations: 'Relaxed', steps: 'Shirodhara', recommendations: 'Light meal' },
  { id: 8, appointmentId: 8, vitals: 'BP:121/79', observations: 'Comfortable', steps: 'Pizhichil', recommendations: 'Hydrate well' },
  { id: 9, appointmentId: 9, vitals: 'BP:117/76', observations: 'Energetic', steps: 'Kizhi', recommendations: 'Meditation' },
  { id: 10, appointmentId: 10, vitals: 'BP:120/80', observations: 'Relaxed', steps: 'Udwarthanam', recommendations: 'Avoid caffeine' },
];

// ------------------ Feedback ------------------
export const feedback = [
  { id: 1, patientId: 1, appointmentId: 1, symptom: 'Mild headache', sideEffect: 'None', notes: 'Feeling better' },
  { id: 2, patientId: 2, appointmentId: 2, symptom: 'Tension', sideEffect: 'None', notes: 'Relaxed' },
  { id: 3, patientId: 3, appointmentId: 3, symptom: 'Fatigue', sideEffect: 'None', notes: 'Energized' },
  { id: 4, patientId: 9, appointmentId: 4, symptom: 'Stress', sideEffect: 'None', notes: 'Calm' },
  { id: 5, patientId: 10, appointmentId: 5, symptom: 'Muscle pain', sideEffect: 'Slight soreness', notes: 'Improved' },
  { id: 6, patientId: 1, appointmentId: 6, symptom: 'Anxiety', sideEffect: 'None', notes: 'Relaxed' },
  { id: 7, patientId: 2, appointmentId: 7, symptom: 'Sleep issues', sideEffect: 'None', notes: 'Better sleep' },
  { id: 8, patientId: 3, appointmentId: 8, symptom: 'Headache', sideEffect: 'Mild dizziness', notes: 'Feeling good' },
  { id: 9, patientId: 9, appointmentId: 9, symptom: 'Fatigue', sideEffect: 'None', notes: 'More energy' },
  { id: 10, patientId: 10, appointmentId: 10, symptom: 'Stiffness', sideEffect: 'None', notes: 'Improved flexibility' },
];

// ------------------ Resources ------------------
export const resources = [
  { id: 1, practitionerId: 4, title: 'Abhyanga Guide', url: 'https://example.com/abhyanga.pdf' },
  { id: 2, practitionerId: 5, title: 'Shirodhara Guide', url: 'https://example.com/shirodhara.pdf' },
  { id: 3, practitionerId: 6, title: 'Pizhichil Instructions', url: 'https://example.com/pizhichil.pdf' },
  { id: 4, practitionerId: 4, title: 'Kizhi Steps', url: 'https://example.com/kizhi.pdf' },
  { id: 5, practitionerId: 5, title: 'Udwarthanam Guide', url: 'https://example.com/udwarthanam.pdf' },
  { id: 6, practitionerId: 6, title: 'Diet Guidelines', url: 'https://example.com/diet.pdf' },
  { id: 7, practitionerId: 4, title: 'Meditation Practices', url: 'https://example.com/meditation.pdf' },
  { id: 8, practitionerId: 5, title: 'Yoga Asanas', url: 'https://example.com/yoga.pdf' },
  { id: 9, practitionerId: 6, title: 'Post-Therapy Care', url: 'https://example.com/postcare.pdf' },
  { id: 10, practitionerId: 4, title: 'Herbal Therapy', url: 'https://example.com/herbal.pdf' },
];

// ------------------ Chat ------------------
export const chat = [
  { id: 1, patientId: 1, messages: [{ from: 'patient', text: 'How to prepare before therapy?' }, { from: 'bot', text: 'Drink warm water and avoid heavy food 2 hours prior.' }] },
  { id: 2, patientId: 2, messages: [{ from: 'patient', text: 'Number of sessions needed?' }, { from: 'bot', text: 'Typically 5–7 sessions per therapy are recommended.' }] },
  { id: 3, patientId: 3, messages: [{ from: 'patient', text: 'Any side-effects?' }, { from: 'bot', text: 'Some may feel mild fatigue, which is normal.' }] },
  { id: 4, patientId: 9, messages: [{ from: 'patient', text: 'Do I need a diet plan?' }, { from: 'bot', text: 'Yes, follow light meals and herbal teas.' }] },
  { id: 5, patientId: 10, messages: [{ from: 'patient', text: 'Can I exercise after therapy?' }, { from: 'bot', text: 'Avoid strenuous exercise immediately after session.' }] },
  { id: 6, patientId: 1, messages: [{ from: 'patient', text: 'When is my next session?' }, { from: 'bot', text: 'Check your My Schedule page for upcoming appointments.' }] },
  { id: 7, patientId: 2, messages: [{ from: 'patient', text: 'Can I reschedule?' }, { from: 'bot', text: 'Yes, contact your center or use the Booking page.' }] },
  { id: 8, patientId: 3, messages: [{ from: 'patient', text: 'Recommended oils for Abhyanga?' }, { from: 'bot', text: 'Sesame or herbal oils are commonly used.' }] },
  { id: 9, patientId: 9, messages: [{ from: 'patient', text: 'What is Kizhi?' }, { from: 'bot', text: 'Kizhi is a medicated herbal poultice therapy.' }] },
  { id: 10, patientId: 10, messages: [{ from: 'patient', text: 'How long is Shirodhara?' }, { from: 'bot', text: 'Typically 30–45 minutes per session.' }] },
];
