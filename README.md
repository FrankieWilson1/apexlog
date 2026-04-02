# ApexLog — Fitness Tracking, Engineered

> The workout logger built for serious gym goers.

[![Live](https://img.shields.io/badge/Live-apexlog.vercel.app-blue)](https://apexlog-ochre.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)

---

## What is ApexLog?

Most fitness apps are either too simple or too cluttered. ApexLog is the one
serious gym goers actually want — minimal, fast, and built around the one thing
that matters: tracking your progress and watching the numbers go up.

**Built for:**

- Serious gym goers who train 3+ days a week
- Athletes focused on progressive overload and strength
- Anyone who wants data-driven progress, not motivation fluff

**What makes it different:**

- Logs every set, rep, and weight in real time — no friction on the gym floor
- Visualises weekly training volume automatically
- Cloud-synced across all your devices
- Mobile-first — built for the gym, not the office

---

## Features

### Workout Logging

- **Live Workout Logger** — real-time session timer, per-set weight and reps tracking
- **Exercise Search** — 1,000+ exercises from the WGER API, searchable by name
- **Workout History** — every session stored, tap any card for full set-by-set breakdown
- **Workout Detail View** — full breakdown of exercises, sets, reps, weight, and duration

### Analytics & Progress

- **Volume Chart** — auto-generated weekly bar chart from real workout history
- **Streak Counter** — consecutive workout days, calculated from actual data
- **Total Volume** — cumulative kg lifted across all sessions

### User Experience

- **Smart Navbar** — floating pill on desktop, 4-tab bottom nav on mobile
- **Onboarding Slideshow** — 5-slide first-login guide
- **Exercise Library** — browse 1,000+ exercises by muscle group without logging
- **User Profiles** — avatar upload, biometrics (height/weight), fitness goal
- **Settings** — weight unit (kg/lbs), notifications preference, clear history

### Platform

- **Cloud Sync** — all data stored in MongoDB Atlas, accessible from any device
- **Secure Auth** — JWT-based authentication, bcrypt password hashing
- **Protected Routes** — unauthenticated users redirected to login
- **Multi-user** — each account has fully isolated workout data

---

## Tech Stack

### Frontend

| Technology      | Purpose                                  |
| --------------- | ---------------------------------------- |
| React 18        | UI framework with hooks                  |
| TypeScript      | Full type safety across all files        |
| Tailwind CSS v4 | Utility-first styling with design tokens |
| React Router v6 | Client-side routing + protected routes   |
| Recharts        | Weekly volume bar chart                  |
| Vite            | Fast dev server and production bundler   |

### Backend

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Node.js 20      | Server runtime           |
| Express.js      | REST API framework       |
| MongoDB Atlas   | Cloud database           |
| Mongoose        | MongoDB object modelling |
| JSON Web Tokens | Stateless authentication |
| bcryptjs        | Password hashing         |

### Deployment

| Service       | Purpose                                 |
| ------------- | --------------------------------------- |
| Vercel        | Frontend — auto-deploys on push to main |
| Render        | Backend — auto-deploys on push to main  |
| MongoDB Atlas | Database — cloud hosted, M0 free tier   |

### Exercise Data

| Source        | Purpose                                        |
| ------------- | ---------------------------------------------- |
| WGER REST API | 1,000+ exercise definitions with muscle groups |

---

## Project Structure

```
apexlog/                          # Frontend repository
├── src/
│   ├── components/
│   │   ├── ExerciseCard.tsx      # Live workout exercise card with set rows
│   │   ├── ExerciseDetailsModal.tsx  # Full-screen exercise detail overlay
│   │   ├── ExerciseSearch.tsx    # WGER API search modal
│   │   ├── HistoryCard.tsx       # Tappable past workout summary row
│   │   ├── NavBar.tsx            # Pill desktop nav + 4-tab mobile bottom bar
│   │   ├── ProtectedRoute.tsx    # Auth guard — redirects to /login
│   │   ├── SetRow.tsx            # Individual set input row
│   │   └── VolumeChart.tsx       # Weekly volume bar chart (Recharts)
│   ├── config/
│   │   ├── api.ts                # Base API URL (reads from .env)
│   │   └── apiHelper.ts          # Centralised fetch wrapper with JWT
│   ├── context/
│   │   ├── AuthContext.tsx       # AuthProvider — session state + all auth actions
│   │   └── useAuth.ts            # useAuth hook (separate for Fast Refresh)
│   ├── data/
│   │   └── mockData.ts           # Seed exercises for new workout sessions
│   ├── hooks/
│   │   └── useLocalStorage.ts    # Generic typed hook: useState + localStorage sync
│   ├── pages/
│   │   ├── AboutPage.tsx         # Product story, tech stack, version history
│   │   ├── FeaturesPage.tsx      # Feature showcase + roadmap
│   │   ├── HomeDashboard.tsx     # Main dashboard — chart, streak, history
│   │   ├── LandingPage.tsx       # Public marketing page with hero + CTAs
│   │   ├── LibraryPage.tsx       # WGER exercise library with muscle group filters
│   │   ├── LiveLogger.tsx        # Active workout session — timer, exercises, finish
│   │   ├── Login.tsx             # Email/password login form
│   │   ├── Onboarding.tsx        # 5-slide first-login guide
│   │   ├── Profile.tsx           # Profile editor — avatar, biometrics, goal
│   │   ├── SettingsPage.tsx      # App preferences + account actions
│   │   ├── SignUp.tsx            # Registration form
│   │   └── WorkoutDetails.tsx    # Full session breakdown — exercises + sets
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces (single source of truth)
│   ├── utils/
│   │   └── WorkoutStats.ts       # Pure functions: streak, total volume
│   ├── App.tsx                   # Route definitions — public + protected
│   └── main.tsx                  # Entry point — BrowserRouter + AuthProvider
├── .env                          # VITE_API_URL (not committed)
├── vercel.json                   # Catch-all rewrite for React Router
└── package.json

apexlog-backend/                  # Backend repository
├── config/
│   └── db.js                     # MongoDB connection
├── controllers/
│   ├── authController.js         # register, login
│   ├── userController.js         # getProfile, updateProfile, updatePassword
│   └── workoutController.js      # CRUD + deleteAllWorkouts
├── middleware/
│   └── protect.js                # JWT verification — attaches req.user
├── models/
│   ├── User.js                   # User schema with pre-save password hashing
│   └── Workout.js                # Workout + exercise + set schemas
├── routes/
│   ├── auth.js                   # POST /api/auth/*
│   ├── users.js                  # GET/PUT /api/users/*
│   └── workouts.js               # GET/POST/DELETE /api/workouts/*
├── .env                          # PORT, MONGO_URI, JWT_SECRET (not committed)
├── server.js                     # Entry point — Express app setup
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB Atlas account (free M0 tier)

### Frontend Setup

```bash
# 1. Clone the frontend repo
git clone https://github.com/frankiewilson1/apexlog.git
cd apexlog

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# 4. Start the development server
npm run dev
```

App available at `http://localhost:5173`.

### Backend Setup

```bash
# 1. Clone the backend repo
git clone https://github.com/frankiewilson1/apexlog-backend.git
cd apexlog-backend

# 2. Install dependencies
npm install

# 3. Create environment file — add these values
touch .env
```

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
```

```bash
# 4. Start the development server
npm run dev
```

API available at `http://localhost:5000`.

### Running Both Together

Open two terminals — one for the frontend, one for the backend.
The frontend reads `VITE_API_URL` to know where to send requests.

---

## Deployment

### Frontend — Vercel

Auto-deploys on every push to `main`. Set this environment variable in
Vercel project settings:

```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

The `vercel.json` handles React Router navigation:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Backend — Render

Auto-deploys on every push to `main`. Set these environment variables in
Render service settings:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_secret_key
```

---

## API Reference

### Base URL

```
Production: https://your-render-url.onrender.com/api
Local:      http://localhost:5000/api
```

### Authentication

All protected routes require:

```
Authorization: Bearer <jwt_token>
```

### Endpoints

| Method | Endpoint          | Access  | Description                      |
| ------ | ----------------- | ------- | -------------------------------- |
| POST   | `/auth/register`  | Public  | Create a new account             |
| POST   | `/auth/login`     | Public  | Login and receive JWT            |
| GET    | `/users/profile`  | Private | Get authenticated user's profile |
| PUT    | `/users/profile`  | Private | Update profile fields            |
| PUT    | `/users/password` | Private | Change password                  |
| GET    | `/workouts`       | Private | Get all workouts for the user    |
| POST   | `/workouts`       | Private | Save a completed workout         |
| GET    | `/workouts/:id`   | Private | Get a single workout by ID       |
| DELETE | `/workouts/:id`   | Private | Delete a single workout          |
| DELETE | `/workouts/all`   | Private | Delete all workouts for the user |

---

## Architecture Decisions

### JWT Authentication

On login, the server issues a signed 30-day JWT. The frontend stores it in
`localStorage` and attaches it to every API request via the `Authorization`
header. The `protect` middleware verifies the token on every protected route.

### Session Restore Pattern

On app load, `AuthProvider` restores the session from `localStorage`
synchronously for an instant render, then fires a background
`GET /api/users/profile` to replace stale cached data with fresh backend state.

### Persistent Workout Timer

The Live Logger stores `startTime` as a Unix timestamp in `localStorage`
rather than a seconds counter in state. This means the timer survives hot
reloads, tab switches, and full page refreshes — all common during a real
gym session.

### Per-User Data Isolation

Every workout document in MongoDB has a `user` field referencing the owner's
`_id`. The backend enforces ownership on every query — users can never read
or modify each other's data.

---

## Roadmap

### v3.0 — Planned

- [ ] Rest timer — configurable between-set countdown with audio alert
- [ ] Personal Records (PRs) — auto-detected, celebrated, tracked per exercise
- [ ] Progressive Overload Hints — "last time: 80kg×8, try 82.5kg today"
- [ ] Workout Templates — save and reuse Push/Pull/Leg day sessions
- [ ] Cardio & Bodyweight Logging — bike, run, plank, yoga, and more
- [ ] Body Measurements Tracker — weight, body fat %, circumference trends
- [ ] Progress Export — shareable image card for social media
- [ ] Offline Mode — log workouts without WiFi, sync on reconnect

### v4.0 — Coming

- [ ] Achievements & Badges — reward consistency, not perfection
- [ ] Friends & Social Feed — see workout summaries from friends
- [ ] Challenges — 30-day consistency, volume competitions
- [ ] Progress Photos — monthly body photo log, private by default
- [ ] Coach / Trainer Mode — assign programs to clients

### v5.0 — Future

- [ ] AI Workout Suggestions — smart programming from training history
- [ ] Wearable Integration — Apple Watch, Google Fit, Garmin
- [ ] Nutrition Tracking — macro awareness, not calorie shaming
- [ ] Recovery Insights — muscle readiness between sessions
- [ ] React Native Mobile App — iOS + Android, same backend

---

## Open Source

ApexLog is open source and built in public.

- **Frontend:** https://github.com/frankiewilson1/apexlog
- **Backend:** https://github.com/frankiewilson1/apexlog-backend

Contributions, feedback, and stars are always welcome.

---

## Author

**Frank Williams Ugwu** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-frankiewilson1-black)](https://github.com/frankiewilson1)

> _"ApexLog was built to solve a real problem: most fitness apps are either
> too simple or too cluttered. ApexLog is minimal, fast, and engineered around
> the one thing that actually matters — logging your lifts and watching the
> numbers go up."_

---

_ApexLog v2.0 · Built with React + TypeScript + Node.js + MongoDB_
