# ApexLog — Fitness Tracking, Engineered

![ApexLog](https://img.shields.io/badge/ApexLog-v2.0-3B82F6?style=for-the-badge&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

[🚀**Live Demo:**](https://www.loom.com/share/8dd370988b2149e4acd04d6e309bf0e3)

ApexLog is a data-driven workout tracking web application built as an **ALX Software Engineering Capstone Project**. It allows users to log every set, visualize weekly volume, maintain a workout streak, and review detailed session history — all from a fast, mobile-first interface with no backend required.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture Decisions](#architecture-decisions)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Features

### v1.0 — MVP

- ⚡ **Live Workout Logger** — real-time session timer, exercise cards, per-set weight/reps tracking
- 📊 **Volume Chart** — auto-generated weekly bar chart from workout history (Recharts)
- 🔐 **Multi-user Auth** — signup, login, logout with localStorage session management
- 🗂️ **Workout History** — every session persisted and listed on the dashboard
- 👤 **User Profile** — avatar upload, biometrics (height/weight), fitness goal

### v2.0 — Current

- 🧭 **Smart Navbar** — floating pill nav on desktop; 4-tab + "More ···" slide-up sheet on mobile
- 🎬 **Onboarding Slideshow** — 5-slide getting-started guide, shown once on first login
- 📚 **Exercise Library** — browse 1,000+ exercises from the WGER API, filterable by muscle group
- 🔥 **Streak Counter** — calculates consecutive workout days from real history data
- 🗂️ **Workout Detail View** — tap any past session for a full set-by-set breakdown
- 🛡️ **Protected Routes** — unauthenticated users redirected to `/login`
- ⚙️ **Settings Page** — weight unit toggle, clear history, replay onboarding, logout
- ✨ **Features + About Pages** — feature showcase, tech stack, version history, roadmap

---

## Tech Stack

| Layer         | Technology      | Purpose                                   |
| ------------- | --------------- | ----------------------------------------- |
| UI Framework  | React 18        | Component-based UI with hooks             |
| Language      | TypeScript      | Full type safety across all files         |
| Styling       | Tailwind CSS v4 | Utility-first, design-token driven        |
| Routing       | React Router v6 | Client-side navigation + protected routes |
| Charts        | Recharts        | Weekly volume bar chart                   |
| Build Tool    | Vite            | Fast dev server and production bundler    |
| Exercise Data | WGER REST API   | 1,000+ exercise definitions               |
| Persistence   | localStorage    | Zero-backend, per-user data isolation     |
| Deployment    | Vercel          | Automatic CI/CD from GitHub main branch   |

---

## Project Structure

```
src/
├── components/                  # Reusable UI components
│   ├── ExerciseCard.tsx         # Live workout exercise card with set rows + context menu
│   ├── ExerciseDetailsModal.tsx # Full-screen exercise detail overlay
│   ├── ExerciseSearch.tsx       # WGER API search modal with debounce
│   ├── HistoryCard.tsx          # Tappable past workout summary row
│   ├── NavBar.tsx               # Pill desktop nav + 4-tab mobile bottom bar
│   ├── ProtectedRoute.tsx       # Auth guard — redirects to /login if unauthenticated
│   ├── SetRow.tsx               # Individual set input row (weight, reps, complete toggle)
│   ├── VolumeChart.tsx          # Weekly volume bar chart (Recharts)
│   └── WorkoutLogger.tsx        # Workout session orchestrator
│
├── context/
│   ├── AuthContext.tsx          # AuthProvider — session state, signup/login/logout
│   └── useAuth.ts               # useAuth hook (separate file for React Fast Refresh)
│
├── data/
│   └── mockData.ts              # Seed exercises for new workout sessions
│
├── hooks/
│   └── useLocalStorage.ts       # Generic typed hook: useState + localStorage sync
│
├── pages/
│   ├── AboutPage.tsx            # Developer info, tech stack, version history
│   ├── FeaturesPage.tsx         # Feature showcase + upcoming roadmap
│   ├── HomeDashboard.tsx        # Main dashboard: greeting, chart, streak, history
│   ├── LandingPage.tsx          # Public marketing page with hero + CTAs
│   ├── LibraryPage.tsx          # WGER exercise library with muscle-group filters
│   ├── LiveLogger.tsx           # Active workout session: timer, exercises, finish
│   ├── Login.tsx                # Email/password login form
│   ├── Onboarding.tsx           # 5-slide first-login guide
│   ├── Profile.tsx              # Profile editor: avatar, biometrics, goal
│   ├── SettingsPage.tsx         # App preferences + danger zone actions
│   ├── SignUp.tsx               # Registration form
│   └── WorkoutDetails.tsx       # Full session breakdown — exercises + sets
│
├── types/
│   └── index.ts                 # All TypeScript interfaces (single source of truth)
│
├── utils/
│   └── WorkoutStats.ts          # Pure functions: streak, total volume, top exercise
│
├── App.tsx                      # Route definitions — public + protected
└── main.tsx                     # Entry point — wraps app in BrowserRouter + AuthProvider
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/frankiewilson1/apexlog.git
cd apexlog

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build     # TypeScript compile + Vite bundle → dist/
npm run preview   # Serve the production build locally for testing
```

### Deployment

The project deploys automatically to Vercel on every push to `main`. The `vercel.json` at the project root configures a catch-all rewrite so React Router handles all navigation without returning 404 on page refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No environment variables are required. All user data is stored in the browser's `localStorage`. Exercise data is fetched at runtime from the public [WGER REST API](https://wger.de/api/v2/).

---

## Architecture Decisions

### localStorage as the persistence layer

ApexLog intentionally uses `localStorage` rather than a backend database. This was a deliberate capstone decision — it eliminates infrastructure cost, gives instant read/write with no network latency, and keeps the focus on frontend engineering. Each user's workout data is isolated via a user-scoped key (`apexlog_history_${user.id}`). The architecture is designed for a clean migration to a Node.js + MongoDB backend in v3.

### Splitting AuthContext and useAuth

React Fast Refresh requires that files exporting components must not also export non-component values. `AuthProvider` (a component) lives in `AuthContext.tsx` and `useAuth` (a hook) lives in `useAuth.ts`. This keeps hot module reload working correctly during development.

### Persistent workout timer

The Live Logger stores its `startTime` as a Unix timestamp in `localStorage` rather than as a seconds counter in React state. This means the timer survives hot reloads, tab switches, accidental navigation away, and full browser refreshes — all common during a real gym session.

### Per-user data isolation

Every piece of user data is namespaced with the user's ID:

- `apexlog_history_${user.id}` — workout history
- `apexlog_session` — active session (single logged-in user at a time)
- `apexlog_users` — all registered accounts map

---

## API Reference

ApexLog uses the **WGER Workout Manager REST API** for exercise data.

**Base URL:** `https://wger.de/api/v2/`

| Endpoint         | Method | Description                                                       |
| ---------------- | ------ | ----------------------------------------------------------------- |
| `/exerciseinfo/` | GET    | Fetch exercises with full detail (muscles, category, description) |

**Query parameters used:**

| Parameter  | Value  | Purpose                   |
| ---------- | ------ | ------------------------- |
| `language` | `2`    | English results only      |
| `limit`    | `100`  | Max exercises per request |
| `format`   | `json` | Response format           |

No API key required. Results are cached in `sessionStorage` as `apexlog_library_cache` to prevent redundant requests within the same browser session.

---

## Roadmap

### v3.0 — Planned

- [ ] Rest timer between sets (configurable seconds)
- [ ] Personal Records (PRs) — track best weight/reps per exercise
- [ ] Custom workout templates — save and reuse favourite sessions
- [ ] Export history to CSV
- [ ] Dark / Light theme toggle (Settings toggle UI already exists)

### Future

- [ ] Cloud sync — Node.js + Express + MongoDB backend
- [ ] Push notifications for rest timer and streak reminders
- [ ] Social features — friend comparisons and leaderboards
- [ ] AI-powered workout suggestions based on history

---

## Author

**Frank Williams Ugwu**
ALX Software Engineering Graduate

[![GitHub](https://img.shields.io/badge/GitHub-frankiewilson1-181717?style=flat&logo=github)](https://github.com/frankiewilson1)

> _"ApexLog was built to solve a real problem: most fitness apps are either too simple or too cluttered. ApexLog is minimal, fast, and engineered around the one thing that actually matters — logging your lifts and watching the numbers go up."_

---

_ApexLog v2.0 · ALX Capstone Project · Built with React + TypeScript + Tailwind CSS_
