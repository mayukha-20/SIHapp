# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Panchakarma (Ayurvedic therapy) management application built with a full-stack architecture:
- **Backend**: Node.js/Express.js API
- **Frontend**: React application
- **Purpose**: Manage Panchakarma therapy appointments, patient progress, practitioner workflows, and center operations

## Architecture

### Backend Structure (`/backend`)
```
backend/
├── server.js                    # Main server entry point
├── config/
│   └── db.js                   # Database configuration
├── controllers/                # Business logic layer
│   ├── appointmentController.js
│   ├── authController.js
│   ├── centerController.js
│   ├── chatController.js
│   ├── feedbackController.js
│   ├── resourceController.js
│   └── therapyNoteController.js
├── middleware/                 # Express middleware
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/                     # Data models
│   ├── Appointment.js
│   ├── Center.js
│   ├── Chat.js
│   ├── Feedback.js
│   ├── Resource.js
│   ├── TherapyNote.js
│   └── User.js
├── routes/                     # API endpoints
│   ├── appointments.js
│   ├── auth.js
│   ├── centers.js
│   ├── chat.js
│   ├── feedback.js
│   ├── resources.js
│   └── therapyNotes.js
└── utils/
    └── seedData.js            # Database seeding utilities
```

### Frontend Structure (`/frontend`)
```
frontend/src/
├── App.js                      # Main React component
├── index.js                    # Application entry point
├── api/                        # API integration layer
│   ├── appointmentApi.js
│   ├── authApi.js
│   ├── chatApi.js
│   ├── feedbackApi.js
│   ├── resourceApi.js
│   └── therapyNoteApi.js
├── components/                 # Reusable UI components
│   ├── CalendarPicker.js
│   ├── ChatBot.js
│   ├── Footer.js
│   ├── Header.js
│   ├── PackageCard.js
│   └── ProgressGraph.js
├── contexts/                   # React contexts
│   └── AuthContext.js
├── mock/                       # Mock data for development
│   ├── appointments.js
│   ├── centers.js
│   ├── chat.js
│   ├── feedback.js
│   ├── resources.js
│   ├── therapyNotes.js
│   └── users.js
└── pages/                      # Application pages/views
    ├── admin/
    │   └── Dashboard.js
    ├── auth/
    │   ├── SignIn.js
    │   └── SignUp.js
    ├── landing/
    │   └── Home.js
    ├── patient/
    │   ├── Booking.js
    │   ├── MySchedule.js
    │   ├── ProgressDashboard.js
    │   └── Reminders.js
    └── practitioner/
        └── Dashboard.js
```

## Core Domain Features

Based on the file structure, this application manages:

1. **Authentication & Authorization**: User registration, login, role-based access
2. **Appointment Management**: Booking, scheduling, and tracking therapy sessions
3. **User Roles**: Patients, Practitioners, and Administrators
4. **Therapy Tracking**: Progress notes, therapy outcomes, and patient history
5. **Center Management**: Multiple therapy center locations
6. **Resource Management**: Educational materials and therapy resources
7. **Communication**: Chat system for patient-practitioner interaction
8. **Feedback System**: Collecting and managing user feedback

## Common Development Commands

### Setup (when package.json files are populated)
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

# Return to root
cd ..
```

### Development
```powershell
# Start backend development server (typically)
cd backend
npm run dev
# or
npm start
# or
node server.js

# Start frontend development server (typically)
cd frontend
npm start
# or
npm run dev

# Start both concurrently (if configured)
npm run dev
```

### Testing (when configured)
```powershell
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

### Linting & Formatting (when configured)
```powershell
# Lint backend code
cd backend
npm run lint

# Lint frontend code
cd frontend
npm run lint

# Format code (if prettier is configured)
npm run format
```

### Database Operations (when configured)
```powershell
# Run database migrations
npm run migrate

# Seed database with sample data
cd backend
node utils/seedData.js

# Reset database
npm run db:reset
```

### Build & Deployment
```powershell
# Build frontend for production
cd frontend
npm run build

# Build full application
npm run build

# Start production server
npm run start:prod
```

## Key Development Guidelines

### File Naming Conventions
- Controllers: `[entity]Controller.js` (camelCase)
- Models: `[Entity].js` (PascalCase)
- Routes: `[entities].js` (lowercase plural)
- Components: `[Component].js` (PascalCase)
- Pages: `[Page].js` (PascalCase)

### API Structure
The application follows RESTful conventions with routes organized by resource:
- `/api/auth` - Authentication endpoints
- `/api/appointments` - Appointment management
- `/api/centers` - Therapy center operations
- `/api/chat` - Communication features
- `/api/feedback` - User feedback
- `/api/resources` - Educational resources
- `/api/therapy-notes` - Therapy progress tracking

### Authentication Flow
The app implements role-based authentication with middleware protection for secured routes. The `AuthContext` provides authentication state management across the React application.

### State Management
- Uses React Context (`AuthContext`) for global state management
- API layer provides centralized data fetching
- Mock data available for development and testing

## Environment Setup

### Environment Variables
The frontend includes a `.env` file for configuration. Common variables include:
- API base URLs
- Authentication configurations
- Feature flags
- Third-party service keys

### Development Dependencies
Based on the .gitignore, this is a Node.js project that excludes:
- `node_modules/` - NPM packages
- `.env` - Environment variables
- `dist/` & `build/` - Build outputs
- `*.log` - Log files

## Working with This Codebase

### Adding New Features
1. **Backend**: Create model → controller → routes → middleware (if needed)
2. **Frontend**: Create API integration → components → pages → routing

### Database Models
Models are organized around core entities:
- `User` (patients, practitioners, admins)
- `Appointment` (therapy sessions)
- `Center` (therapy locations)
- `TherapyNote` (progress tracking)
- `Resource` (educational materials)
- `Feedback` (user reviews)
- `Chat` (communications)

### Testing Strategy
- Mock data is available in `/frontend/src/mock/` for frontend development
- Backend utilities include seeding functionality for consistent test data
- Separate test commands for frontend and backend components

Note: This appears to be a project template or skeleton. Most source files are currently empty and will need to be implemented with actual functionality.