# ApexLog 🏋️

> **Track. Analyze. Dominate.**

ApexLog is a full-stack fitness application designed to move athletes beyond basic activity logging into data-driven athletic development. Built as an ALX Software Engineering Capstone project.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)

---
![Live Demo →](https://apexlogs.vercel.app/)

## 📸 Preview

| Dashboard | Workout Logger | Exercise Search |
|-----------|---------------|-----------------|
| Weekly volume chart, streaks, recent activity | Live set/rep logging with timer | 1,000+ exercises from WGER API |

---

## ✨ Features

- **Animated Landing Page** — Framer Motion powered hero with smooth entrance animations
- **Guest / Demo Mode** — Explore the full app instantly with no sign-up required
- **Live Workout Logger** — Log sets, reps, and weight in real time with a session timer
- **Set Validation** — Prevents empty or zero-value data from polluting your analytics
- **Analytics Dashboard** — Weekly volume bar chart, streak counter, and recent activity feed
- **Exercise Library** — Search 1,000+ exercises with muscle-group filtering via the WGER API
- **Responsive Design** — Mobile-first layout that scales beautifully to desktop

---

## 🛠️ Tech Stack

### Frontend (Current MVP)
| Technology | Role |
|------------|------|
| React 18 + TypeScript | UI framework with full type safety |
| Tailwind CSS v4 | Utility-first styling with custom design tokens |
| Framer Motion | Landing page animations and transitions |
| React Router v6 | Client-side routing |
| Custom SVG Charts | Volume visualization on the dashboard |

### Backend (Phase 2 — Planned)
| Technology | Role |
|------------|------|
| Node.js + Express | RESTful API server |
| MongoDB + Mongoose | Flexible document storage for workout logs |
| JSON Web Tokens | Stateless authentication |

### External APIs
- **[WGER REST API](https://wger.de/api/v2/)** — Exercise metadata, muscle groups, and descriptions
- **[Unsplash API](https://unsplash.com/developers)** — Fitness imagery for the landing page

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/frankiewilson1/apexlog.git
cd apexlog

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key_here
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ExerciseCard.tsx       # Per-exercise card with set rows and 3-dot menu
│   ├── ExerciseSearch.tsx     # Full-screen modal with WGER API + filter chips
│   ├── HistoryCard.tsx        # Workout summary row for the dashboard feed
│   ├── SetRow.tsx             # Individual set entry with validation guard
│   └── VolumeChart.tsx        # Custom SVG bar chart
├── pages/
│   ├── HomeDashboard.tsx      # Analytics hub — chart, stats, recent activity
│   ├── LiveLogger.tsx         # Active workout session orchestrator
│   ├── Login.tsx              # Auth — login screen
│   └── Signup.tsx             # Auth — registration screen
├── hooks/
│   └── useLocalStorage.ts     # Generic typed persistent state hook
├── data/
│   └── mockData.ts            # Centralized mock data for MVP
└── types/
    └── index.ts               # All shared TypeScript interfaces
```

---

## 🔒 Data Validation

ApexLog enforces validation at two levels to keep analytics clean:

1. **Set-level** — The completion checkmark is disabled until both weight and reps contain valid non-zero values
2. **Workout-level** — The Finish button blocks saving if zero sets have been completed with valid data

---

## 📊 Roadmap

### Phase 1 — MVP ✅
- [x] Animated landing page
- [x] Dashboard with volume chart
- [x] Live workout logger with validation
- [x] Exercise search via WGER API
- [x] Login / Signup screens
- [x] Mobile-first responsive design

### Phase 2 — Backend Integration
- [ ] JWT authentication with real user accounts
- [ ] Persistent workout storage via MongoDB
- [ ] Biometrics and body weight tracking
- [ ] Per-exercise strength progression charts
- [ ] Offline support with service worker caching
- [ ] Rest timer with push notifications

---

## 🌐 Deployment

The frontend is deployed on **Vercel**. To deploy your own instance:

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** and import your repository
4. Set the framework preset to **Vite**
5. Add your environment variables in the Vercel dashboard
6. Click **Deploy**

---

## 👤 Author

**Frank Williams Ugwu**
ALX Software Engineering — Frontend Specialization
Capstone Project 2026

---

## 📄 License

This project is licensed under the MIT License — free to use, modify, and distribute.

---

Built with precision by Frank Williams Ugwu