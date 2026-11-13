# IEvalX — Developer Onboarding Guide

> **IEvalX** (Intelligent Evaluation Experience) is an AI-powered enterprise hiring platform built by **Lanciere Technologies**. It connects job seekers, employers, and interviewers through AI-driven assessments, real-time interviews, resume building, and a unique **Interviewer Audit & Evaluation Module (IAEM)** that monitors interviewer quality and fairness.

> **Production URL:** `https://ievalx.com`

---

## Table of Contents

1. [What Is IEvalX?](#1-what-is-ievalx)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Tech Stack](#3-tech-stack)
4. [User Roles](#4-user-roles)
5. [Project Folder Structure](#5-project-folder-structure)
6. [Local Development Setup](#6-local-development-setup)
7. [Environment Variables](#7-environment-variables)
8. [Frontend Architecture Deep Dive](#8-frontend-architecture-deep-dive)
9. [Authentication System](#9-authentication-system)
10. [API Layer & Axios Instance](#10-api-layer--axios-instance)
11. [Backend Microservices](#11-backend-microservices)
12. [Routing System](#12-routing-system)
13. [Core Features by Role](#13-core-features-by-role)
14. [Interview System](#14-interview-system)
15. [Assessment System](#15-assessment-system)
16. [IAEM Module (Interviewer Audit & Evaluation)](#16-iaem-module)
17. [AI/ML Components](#17-aiml-components)
18. [State Management](#18-state-management)
19. [UI & Theming](#19-ui--theming)
20. [CI/CD Pipeline](#20-cicd-pipeline)
21. [Docker & Nginx](#21-docker--nginx)
22. [Feature Flags](#22-feature-flags)
23. [Coding Conventions](#23-coding-conventions)
24. [Troubleshooting](#24-troubleshooting)

---

## 1. What Is IEvalX?

IEvalX is **not just a job portal** — it is a full hiring lifecycle platform with AI at its core:

- **Job Seekers** can find jobs, build AI-powered resumes, take AI-proctored assessments, and attend AI-driven real-time interviews (with avatar + speech).
- **Employers** (HR / recruiters) post jobs, create assessments (manual or AI-generated), schedule interviews, manage candidate pipelines, rank candidates, and make final hire decisions.
- **Company Admins** oversee their organization — manage employers, approve job postings, handle billing/subscriptions, and manage compliance officers.
- **Interviewers** (IAEM) conduct interviews, submit structured post-interview feedback with competency scores, go through calibration sessions, and respond to audit cases.
- **Compliance Officers** (IAEM) oversee interviewer quality — monitor audit signals, review cases, co-sign high-severity resolutions, and browse AI model cards.

**What makes it different:** The IAEM module uses AI signals to detect interviewer bias, score divergence, question misalignment, and misconduct — then routes flagged interviews through a structured case-review workflow with SLA enforcement, appeals, and compliance co-signing.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (React SPA)                      │
│  Vite + React 19 + MUI 9 + React Query 5 + React Router 7       │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS (all /api/* requests)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              NGINX Reverse Proxy (in Docker container)            │
│  Routes /api/* to the correct backend microservice by path       │
│  Serves static SPA files from /usr/share/nginx/html              │
│  SPA fallback: all non-API routes → index.html                   │
└──┬────────┬────────┬────────┬────────┬────────┬────────┬───────┘
   │        │        │        │        │        │        │
   ▼        ▼        ▼        ▼        ▼        ▼        ▼
┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
│ ms-  ││ ms-  ││ ms-  ││ ms-  ││ ms-  ││ ms-  ││ ms-  ││weekly│
│auth  ││emplo-││jobse-││ jobs ││inter-││asse- ││ iaem ││inter-│
│:8001 ││yer   ││eker  ││:8004 ││view  ││ssment││:8007 ││view  │
│      ││:8002 ││:8003 ││      ││:8005 ││:8006 ││      ││:8032 │
└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘
   │        │        │        │        │        │        │
   └────────┴────────┴────────┴────────┴────────┴────────┘
                           │
                    ┌──────┴──────┐
                    │  PostgreSQL  │
                    │  (Database)  │
                    └─────────────┘
```

**Request flow:**
1. Browser sends request to `/api/jobseeker/...`
2. Nginx matches the location block → proxies to `ms-jobseeker:8003`
3. Microservice processes, returns JSON
4. Axios instance in frontend handles the response (caching, token refresh)

---

## 3. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | UI library |
| **Vite** | 8.x | Build tool + dev server + HMR |
| **MUI (Material UI)** | 9.x | Component library |
| **React Router** | 7.x | Client-side routing |
| **React Query (TanStack)** | 5.x | Server state management, caching, refetching |
| **Axios** | 1.15 | HTTP client with interceptors |
| **React Hook Form** | 7.x | Form state management |
| **Recharts** | 3.x | Charts and analytics dashboards |
| **LiveKit** | 2.x | WebRTC-based live video interviews |
| **TensorFlow.js** | 4.x | Client-side face detection (proctoring) |
| **MediaPipe** | 1.x | Face mesh / hand tracking (proctoring) |
| **GSAP** | 3.x | Landing page animations |
| **react-pdf** | 10.x | PDF resume viewing |
| **jsPDF + html2canvas** | — | PDF generation (reports) |
| **xlsx-js-style** | — | Excel export |
| **notistack** | 3.x | Toast notifications |
| **date-fns / dayjs** | — | Date utilities |

### Backend (Separate Repos — Each a Microservice)
| Service | Port | Purpose |
|---|---|---|
| ms-auth | 8001 | Authentication, registration, token refresh, file storage |
| ms-employer | 8002 | Company/employer profiles, job posts, company feeds |
| ms-jobseeker | 8003 | Jobseeker profiles, resumes, feeds, quick interviews, analytics |
| ms-jobs | 8004 | Job listings, applications, recommendations |
| ms-interview | 8005 | Live interview rooms, WebSocket support |
| ms-assessment | 8006 | Manual + AI assessments, proctoring, code execution |
| ms-iaem | 8007 | IAEM: cases, signals, calibration, compliance, appeals |
| ms-admin | 8008 | Platform admin, support tickets, blogs, notifications |
| weekly-interview | 8032 | Real-time AI interview sessions (WebSocket) |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Azure Container Registry (ACR)** | Docker image registry |
| **Kubernetes (AKS)** | Container orchestration |
| **Helm Charts** | K8s deployment configuration |
| **GitHub Actions** | CI/CD pipeline |
| **Cloudflare** | CDN + DNS + DDoS protection |

---

## 4. User Roles

The platform has **5 distinct user roles**, each with their own dashboard, sidebar navigation, and feature set:

### 4.1 Jobseeker (`jobseeker`)
- **Landing:** `/jobseeker/overview`
- **What they do:** Search and apply for jobs, take AI assessments, attend AI/live interviews, build resumes, track applications, view career performance analytics
- **Key features:** AI Resume Builder, AI Practice Interviews, Smart Interviews (AI real-time, document-based, live), AI Assessments with proctoring, Campus Drive

### 4.2 Employer (`employer`)
- **Landing:** `/employer/overview`
- **What they do:** Post jobs, review applicants, create assessments, schedule interviews, manage candidate pipeline (shortlist → interview → rank → hire), manage interviewers (IAEM)
- **Key features:** Manual & AI Assessment Builder, Question Bank, Ranked Results (multi-pipeline), Interview Rounds, IAEM (interviewer management, case queue, scheduling, calibration, appeals)

### 4.3 Company Admin (`company`)
- **Landing:** `/company/overview`
- **What they do:** Manage the organization — add/remove employers, approve job postings, handle billing & subscriptions, manage compliance officers, view company-wide analytics
- **Key features:** Employer Management, Job Approvals, Edit/Republish Requests, Billing & Subscription, Ownership Transfer, Document Re-upload, Company Engagement

### 4.4 Interviewer (`interviewer`)
- **Landing:** `/interviewer/overview`
- **What they do:** Conduct interviews as external/internal interviewers, submit structured post-interview feedback, manage their availability slots, go through calibration, respond to audit cases, file appeals
- **Key features:** Consent Acknowledgment flow, Slot Management, Post-Interview Submission (competency scoring), Calibration Sessions, My Cases (audit responses), Appeal Filing
- **Lifecycle:** Invited → Activate Account → Consent → Pending Approval → Approved → Active

### 4.5 Compliance Officer (`compliance`)
- **Landing:** `/compliance/alerts`
- **What they do:** Oversight role for IAEM — monitor AI-generated audit signals, review flagged cases, co-sign high-severity resolutions, inspect AI model cards, review audit trails
- **Key features:** Compliance Alerts, Case Oversight, Co-Sign Panel, Audit Trail Viewer, Model Card Browser, Signal Guidelines

---

## 5. Project Folder Structure

```
ievalx/
├── .env.development          # Local dev environment vars
├── .env.production           # Production environment vars
├── .github/workflows/ci.yaml # GitHub Actions CI/CD
├── Dockerfile                # Multi-stage Docker build
├── nginx.conf                # Nginx reverse proxy config
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite config (aliases, proxy, chunking)
├── index.html                # SPA entry point
├── public/
│   ├── mediapipe-vision/     # MediaPipe WASM binaries (face detection)
│   ├── worklets/             # Audio worklets (noise suppression)
│   └── pdf.worker.min.mjs    # PDF.js web worker
│
└── src/
    ├── main.jsx              # React entry — mounts <App />
    ├── App.jsx               # Provider hierarchy (QueryClient → Theme → Auth → Snackbar → Router)
    ├── App.css               # Global styles
    │
    ├── routes/
    │   ├── AppRouter.jsx     # All route declarations (lazy-loaded)
    │   ├── PrivateRoute.jsx  # Auth + role guard wrapper
    │   └── routePaths.js     # PATHS constant — typo-safe route registry
    │
    ├── config/
    │   ├── env.js            # Runtime env config (reads VITE_* vars)
    │   ├── api.config.js     # Axios base config (baseURL, timeout)
    │   ├── queryClient.js    # React Query client config
    │   └── index.js          # Barrel export
    │
    ├── contexts/
    │   ├── AuthContext.jsx    # Auth state (user, login, logout, refresh)
    │   └── ThemeContext.jsx   # Light/dark theme toggle
    │
    ├── constants/
    │   ├── index.js           # Barrel: re-exports ROLES, STATUS, etc.
    │   ├── roles.js           # Role identifiers + default landing routes
    │   ├── routes.js          # (alias for routePaths)
    │   ├── iaem.js            # IAEM enums: signals, severity, SLAs, competencies, case states
    │   ├── iaemConsent.js     # IAEM interviewer consent clause text
    │   ├── jobTypes.js        # Job type/category enums
    │   ├── locations.js       # City/state dropdowns
    │   ├── skills.js          # Skill list for profiles
    │   ├── status.js          # Application/pipeline status enums
    │   ├── profileConstants.js # Profile field configs
    │   └── resumeAiConstants.js # AI resume builder section configs
    │
    ├── hooks/
    │   ├── useAuth.js         # Shorthand for useContext(AuthContext)
    │   ├── useApi.js          # Generic API call hook
    │   ├── useForm.js         # Form state helper
    │   ├── useDebounce.js     # Debounced value
    │   ├── useSidebarCounts.js # Badge counts for sidebar items
    │   ├── useAppliedStatus.js # Check if already applied to a job
    │   ├── useApplyNavigation.js # Navigate to apply flow
    │   ├── useRefetchOnFocus.js  # Refetch query on window focus
    │   ├── useSupportTickets.js  # Support ticket CRUD
    │   ├── jobseeker/         # Jobseeker-specific hooks (20+ hooks)
    │   ├── employer/          # Employer-specific hooks (15+ hooks)
    │   ├── company/           # Company admin hooks (12+ hooks)
    │   ├── interviewer/       # Interviewer hooks (consent gate)
    │   └── queries/           # Shared React Query definitions
    │
    ├── services/api/
    │   ├── axiosInstance.js   # Axios instance (interceptors, token refresh, GET cache)
    │   ├── authService.js     # Login, register, forgot password, OTP
    │   ├── jobseeker/         # 20+ service files (jobs, interviews, assessments, resume...)
    │   ├── employer/          # 14+ service files (jobs, candidates, assessments, analytics...)
    │   ├── company/           # 8 service files (profile, billing, approvals, employers...)
    │   ├── iaem/              # 12+ service files (cases, appeals, calibration, compliance...)
    │   ├── publicBlogsService.js
    │   ├── publicJobsService.js
    │   └── supportTicketService.js
    │
    ├── components/
    │   ├── common/            # Shared components (AppLoader, AppToast, NetworkError, SignalGuidelines)
    │   │   └── iaem/          # Shared IAEM components (badges, timelines, score tables, evidence players)
    │   ├── layout/
    │   │   ├── DashboardLayout.jsx  # Main shell: Sidebar + Topbar + content area
    │   │   ├── Sidebar.jsx          # Role-aware sidebar navigation
    │   │   └── Topbar.jsx           # Top navigation bar
    │   ├── jobseeker/         # All jobseeker page components
    │   ├── employer/          # All employer page components (including IAEM management)
    │   ├── company/           # All company admin components
    │   ├── interviewer/       # All interviewer components (IAEM)
    │   └── compliance/        # All compliance officer components (IAEM)
    │
    ├── pages/
    │   ├── LandingPage.jsx    # Marketing landing page
    │   ├── NotFoundPage.jsx   # 404 page
    │   ├── auth/              # Auth page + login/register forms
    │   ├── landing/           # Landing page section components
    │   └── public/            # Public pages (pricing, blogs, legal, support...)
    │
    ├── theme/                 # MUI theme customization
    │   ├── index.js           # createTheme() export
    │   ├── palette.js         # Color palette
    │   ├── typography.js      # Font settings
    │   ├── components.js      # Component overrides
    │   └── shadows.js         # Shadow definitions
    │
    ├── utils/                 # Utility functions
    │   ├── formatters.js      # Date/name/currency formatters
    │   ├── apiError.js        # Error extraction helper
    │   ├── profileValidation.js # Profile completeness checks
    │   ├── webcamUtils.js     # Camera access helpers
    │   └── index.js           # Barrel
    │
    ├── mocks/                 # Mock data for development
    │   └── jobseeker/         # Mock interview/assessment/overview data
    │
    └── workers/
        └── proctor.worker.js  # Web Worker for proctoring (face detection)
```

### Path Aliases (vite.config.js)

Instead of `../../services/api/axiosInstance`, use:

| Alias | Maps To |
|---|---|
| `@/` | `src/` |
| `@assets/` | `src/assets/` |
| `@components/` | `src/components/` |
| `@config/` | `src/config/` |
| `@constants/` | `src/constants/` |
| `@contexts/` | `src/contexts/` |
| `@hooks/` | `src/hooks/` |
| `@pages/` | `src/pages/` |
| `@routes/` | `src/routes/` |
| `@services/` | `src/services/` |
| `@utils/` | `src/utils/` |
| `@theme/` | `src/theme/` |

---

## 6. Local Development Setup

### Prerequisites
- **Node.js 22+** (the Dockerfile uses `node:22-alpine`)
- **npm** (comes with Node)
- **Git**
- Backend services running (or access to the dev backend at the proxy target)

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd ievalx

# 2. Install dependencies
npm install

# 3. (Optional) Set up HTTPS for webcam/microphone APIs
#    MediaPipe and WebRTC require HTTPS even on localhost.
#    Install mkcert and generate certs:
mkcert -install
mkcert localhost 127.0.0.1 ::1
#    This creates localhost+2-key.pem and localhost+2.pem
#    Vite auto-detects these files and enables HTTPS

# 4. Start the dev server
npm run dev

# 5. Open browser
#    http://localhost:5173  (or https://localhost:5173 with certs)
```

### Available Scripts

| Command | What It Does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR on port 5173 |
| `npm run build` | Production build → `dist/` folder |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Dev Server Proxy

In development, Vite proxies all `/api/*` requests to the backend. The proxy target is configured in `vite.config.js` under `server.proxy`. All routes forward to a single backend gateway (the dev server IP).

> **Note:** The proxy target IP in `vite.config.js` points to the internal dev server. If you're running backend locally, change it to `http://localhost:8000` or your local backend address.

---

## 7. Environment Variables

All frontend env vars use the `VITE_` prefix (required by Vite to expose them to the browser bundle).

> ⚠️ **NEVER put secrets (API keys, passwords, database credentials) in `.env` files** — these files are baked into the browser bundle and are PUBLIC.

### `.env.development`

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | API base URL | `/api` (proxied by Vite) |
| `VITE_WEEKLY_INTERVIEW_URL` | WebSocket interview service origin | (empty — derived from current host) |
| `VITE_APP_NAME` | Application name shown in UI | `IEvalx (dev)` |
| `VITE_FEATURE_AI_INTERVIEW` | Enable AI interview feature | `true` |
| `VITE_FEATURE_ASSESSMENTS` | Enable assessment feature | `true` |
| `VITE_FEATURE_CANDIDATE_POOL` | Enable candidate pool feature | `true` |

### `.env.production`

Same variables as above but with production values. The `VITE_API_BASE_URL` points to the production API gateway (same-origin via Cloudflare).

### How They're Used

```
src/config/env.js  →  reads import.meta.env.VITE_*
                       exports a typed `env` object
                       ↓
src/config/api.config.js  →  uses env.API_BASE_URL for axios baseURL
src/services/api/axiosInstance.js  →  creates the axios instance
src/config/env.js → env.FEATURES.AI_INTERVIEW  →  conditional rendering
```

---

## 8. Frontend Architecture Deep Dive

### Provider Hierarchy (App.jsx)

The app wraps everything in a specific provider order — **order matters**:

```
QueryClientProvider          ← React Query cache
  └── ThemeProvider          ← MUI light/dark theme
        └── AuthProvider     ← User state + token management
              └── SnackbarProvider  ← Toast notifications
                    └── BootGate    ← Shows loader while auth hydrates
                          └── OfflineGate  ← Shows offline banner
                                └── Router
                                      └── AppRouter  ← All routes
```

### Code Splitting Strategy

Every role-specific page is **lazy-loaded** via `React.lazy()`:

```jsx
const JobseekerDashboard = lazy(() => import('@/components/jobseeker/Overview/JobseekerDashboard'));
```

This means:
- The initial bundle is small (only the landing page + auth)
- Role-specific code loads only when that role logs in
- Heavy dependencies (LiveKit ~830KB, TensorFlow.js, MediaPipe) are isolated to their routes

**Vendor chunking** (in `vite.config.js`) splits large libraries into separate cacheable chunks:
- `react-vendor` — React, ReactDOM, React Router (priority 40)
- `mui-vendor` — MUI, Emotion, Popper (priority 30)
- `datepicker-vendor` — MUI date pickers + date-fns
- `charts-vendor` — Recharts + D3
- `livekit-vendor` — LiveKit WebRTC (priority 10, only for `/live-room` routes)

### Route Wrappers

Two wrapper components control layout and auth:

```jsx
// Dashboard shell (sidebar + topbar + content)
<Protected roles={[ROLES.JOBSEEKER]}>
  <JobseekerDashboard />
</Protected>

// Full-screen (no sidebar — for live rooms, resume builder, proctored tests)
<Fullscreen roles={[ROLES.JOBSEEKER]}>
  <AIAssessmentTest />
</Fullscreen>
```

### Idle Prefetching

After login, the app uses `requestIdleCallback` to prefetch the logged-in user's dashboard component — so the first navigation is instant.

---

## 9. Authentication System

### Flow

```
1. User enters email + password
2. POST /api/auth/login  →  returns { Token, Refresh_Token, user data }
3. Token stored in localStorage as 'ievalx_token'
4. Refresh token stored as 'ievalx_refresh_token'
5. User object stored as 'ievalx_user'
6. AuthContext hydrates from localStorage on mount
7. AuthContext calls refreshUser() to reconcile with server
```

### Token Management

The `axiosInstance.js` handles all token lifecycle automatically:

| Feature | How It Works |
|---|---|
| **Auto-attach** | Request interceptor adds `Authorization: Bearer <token>` to every request |
| **Proactive refresh** | A timer refreshes the token **5 minutes before expiry** (no user interruption) |
| **401 recovery** | If a request gets 401, the interceptor refreshes the token and retries the original request |
| **Single-flight refresh** | If multiple requests 401 simultaneously, only ONE refresh call is made — others wait for its result |
| **Session cleanup** | If refresh fails, all tokens are cleared and user is redirected to `/auth` |
| **Cross-tab sync** | `storage` event listener keeps user state consistent across browser tabs |

### Auth Passthrough

These endpoints are excluded from 401 auto-refresh (their 401s are meaningful errors):
- `/auth/login`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-reset-otp`

### Registration Flow

Registration differs by role:
- **Jobseeker:** Email/phone + password + face capture (webcam) + voice check
- **Company:** Company name + GST/PAN + admin details
- **Interviewer:** Activated via invitation link → `/interviewer/activate/:token` → consent → approval

### Role-Based Route Protection

```jsx
// PrivateRoute.jsx checks:
// 1. Is user authenticated? (has token + user in context)
// 2. Does user's role match allowedRoles?
// If not → redirect to /auth
```

---

## 10. API Layer & Axios Instance

### Architecture

```
Component (UI)
    ↓  calls hook
Custom Hook (useXxx)
    ↓  calls service + uses React Query
Service (services/api/role/xxxService.js)
    ↓  calls api.get/post/put/delete
Axios Instance (axiosInstance.js)
    ↓  interceptors: attach token, cache GETs, handle 401
Backend Microservice
```

### GET Response Cache

The axios instance caches **all GET responses for 30 seconds** (except `/auth/*`):
- Cache key: `baseURL + url + JSON(params)`
- Prevents duplicate requests when multiple components mount simultaneously
- Auto-pruned every 60 seconds
- Cleared on logout via `clearGetCache()`
- Bypass with `withFreshGet(() => api.get(...))` when you need fresh data

### Service File Pattern

Every service file follows this structure:

```javascript
// src/services/api/jobseeker/jobService.js
import api from '../axiosInstance';

const jobService = {
  getJobs: (params) => api.get('/jobs/', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  applyToJob: (jobId, data) => api.post(`/job-application/`, { job_id: jobId, ...data }),
  saveJob: (jobId) => api.post(`/jobseeker/saved-jobs/`, { job_id: jobId }),
};

export default jobService;
```

### Hook Pattern

```javascript
// src/hooks/jobseeker/useJobs.js
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/api';

export const useJobs = (filters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getJobs(filters).then(r => r.data),
  });
};
```

---

## 11. Backend Microservices

The nginx reverse proxy routes requests to the correct microservice based on the URL path prefix:

### ms-auth (Port 8001)
- **Paths:** `/api/auth/*`, `/api/storage/*`
- **Purpose:** User authentication, registration, JWT token issuing/refresh, password reset, file storage (presigned URLs)
- **Key endpoints:** `POST /auth/login`, `POST /auth/register/*`, `POST /auth/refresh`, `POST /auth/forgot-password`

### ms-employer (Port 8002)
- **Paths:** `/api/companies/*`, `/api/company/*`, `/api/employer/*`, `/api/employers/*`, `/api/employee/*`, `/api/company-post/*`, `/api/recruiter/*`, `/api/talent-pool/*`, `/api/activity-log/*`, `/api/outreach/*`
- **Purpose:** Company profiles, employer profiles, company posts/feed, talent pool management

### ms-jobseeker (Port 8003)
- **Paths:** `/api/jobseeker/*`, `/api/job-seeker/*`, `/api/jobseekers/*`, `/api/resume-builder/*`, `/api/resume/*`, `/api/feed/*`, `/api/quick-interview/*`, `/api/real-time-interview/*`, `/api/analytics/*`
- **Purpose:** Jobseeker profiles, resume AI, job applications, feeds, quick interviews, real-time AI interviews, analytics

### ms-jobs (Port 8004)
- **Paths:** `/api/jobs/*`, `/api/job-post/*`, `/api/job-application/*`, `/api/job-benefit/*`, `/api/job-recommendation/*`
- **Purpose:** Job CRUD, job search, job applications, job recommendations

### ms-interview (Port 8005)
- **Paths:** `/api/employer/interviews/*`, `/api/interviews/*`
- **Purpose:** Live interview rooms (WebSocket upgraded), interview scheduling
- **Note:** Supports WebSocket upgrade (`Upgrade: websocket`) for real-time communication

### ms-assessment (Port 8006)
- **Paths:** `/api/manual-assessment/*`, `/api/manual-section/*`, `/api/manual-question/*`, `/api/manual-paper/*`, `/api/manual-assignment/*`, `/api/manual-test/*`, `/api/manual-response/*`, `/api/manual-result/*`, `/api/manual-ai/*`, `/api/manual-code/*`, `/api/manual-coding/*`, `/api/ai-assessment/*`, `/api/ai-paper/*`, `/api/proctor/*`
- **Purpose:** Manual assessment builder, AI assessment generation, proctoring signals, code compilation/execution

### ms-iaem (Port 8007)
- **Paths:** `/api/iaem/*`, `/api/compliance-officers/*`
- **Purpose:** IAEM module — cases, signals, calibration, appeals, interviewer management, compliance, scheduling, model cards

### ms-admin (Port 8008)
- **Paths:** `/api/admin/*`, `/api/super-admin/*`, `/api/platform-admin/*`, `/api/verification/*`, `/api/support-ticket/*`, `/api/support/*`, `/api/blog/*`, `/api/public/*`, `/api/announcements/*`, `/api/notifications/*`, `/api/newsletter/*`, `/api/email/*`
- **Purpose:** Platform administration, support tickets, blog CMS, notifications, newsletter, email, verification

### weekly-interview (Port 8032)
- **Paths:** `/ws/*`, `/weekly_interview/*`, `/api/weekly/*`
- **Purpose:** Real-time AI interview WebSocket sessions
- **Note:** Long-lived WebSocket connections (3600s timeout)

---

## 12. Routing System

### Public Routes (no auth required)

| Path | Component | Description |
|---|---|---|
| `/` | LandingPage | Marketing homepage |
| `/auth` | AuthPage | Login / Register |
| `/jobs` | BrowseJobsPage | Public job listings |
| `/jobs/:id` | JobDetailPage | Public job detail |
| `/categories` | CategoriesPage | Job categories |
| `/blogs` | BlogsPage | Blog listing |
| `/blogs/:slug` | BlogPostPage | Blog article |
| `/pricing` | PricingPage | Pricing plans |
| `/support` | SupportPage | Public support page |
| `/privacy-policy` | PrivacyPolicyPage | Privacy policy |
| `/terms-and-conditions` | TermsPage | Terms of service |

### Jobseeker Routes (`/jobseeker/*`)

| Path | Layout | Description |
|---|---|---|
| `/jobseeker/overview` | Dashboard | Main dashboard |
| `/jobseeker/find-jobs` | Dashboard | Job search |
| `/jobseeker/job/:id` | Dashboard | Job detail (auth'd) |
| `/jobseeker/applications` | Dashboard | Application tracker |
| `/jobseeker/saved-jobs` | Dashboard | Saved jobs |
| `/jobseeker/feed` | Dashboard | Company feed |
| `/jobseeker/ai-assessments` | Dashboard | Assessment list |
| `/jobseeker/ai-assessments/:assignmentId/test` | **Fullscreen** | Proctored test |
| `/jobseeker/smart-interviews/ai` | Dashboard | AI interview config |
| `/jobseeker/smart-interviews/ai/session/:configId` | Dashboard | AI real-time interview session |
| `/jobseeker/smart-interviews/ai/results/:sessionId` | Dashboard | AI interview results |
| `/jobseeker/smart-interviews/document-based` | Dashboard | Document-based interview |
| `/jobseeker/smart-interviews/live` | Dashboard | Live interview lobby |
| `/jobseeker/smart-interviews/campus-drive` | Dashboard | Campus drive portal |
| `/jobseeker/smart-interviews/book/:releaseId` | Dashboard | IAEM slot booking |
| `/jobseeker/career/ai-practice-interview` | Dashboard | AI practice interview |
| `/jobseeker/career/candidate-performance` | Dashboard | Performance analytics |
| `/jobseeker/workspace/resume-builder` | Dashboard | Resume builder home |
| `/jobseeker/workspace/builder` | **Fullscreen** | AI resume studio |
| `/jobseeker/profile` | Dashboard | Profile editor |
| `/live-room/:roomName` | **Fullscreen** | LiveKit video room |
| `/waiting-room/:roomName` | **Fullscreen** | Waiting room |

### Employer Routes (`/employer/*`)

| Path | Description |
|---|---|
| `/employer/overview` | Dashboard |
| `/employer/my-jobs` | Job management |
| `/employer/my-jobs/:jobId/applicants` | Job applicants |
| `/employer/candidates` | Candidate pipeline |
| `/employer/interview-rounds` | Interview rounds |
| `/employer/ranked-results` | Ranked results |
| `/employer/ranked-results/job/:jobId` | Job's pipelines |
| `/employer/ranked-results/:processId` | Pipeline's candidates |
| `/employer/final-hire` | Final hire decisions |
| `/employer/analytics` | Analytics dashboard |
| `/employer/manual-test-builder` | Manual assessment builder |
| `/employer/ai-assessment-builder` | AI assessment builder |
| `/employer/question-bank` | Question bank |
| `/employer/interviewers` | IAEM: Interviewer list |
| `/employer/interviewers/approvals` | IAEM: Approval queue |
| `/employer/interviewers/:interviewerId` | IAEM: Interviewer detail |
| `/employer/iaem-scheduling` | IAEM: Scheduling |
| `/employer/cases` | IAEM: Case queue |
| `/employer/cases/:caseId` | IAEM: Case detail |
| `/employer/appeals` | IAEM: Appeals queue |
| `/employer/appeals/:appealId` | IAEM: Appeal review |
| `/employer/iaem-calibration` | IAEM: Calibration management |

### Company Admin Routes (`/company/*`)

| Path | Description |
|---|---|
| `/company/overview` | Dashboard |
| `/company/employers` | Employer management |
| `/company/compliance-officers` | Compliance officer management |
| `/company/job-postings` | Job postings |
| `/company/jobs-approvals` | Job approval queue |
| `/company/ownership` | Ownership management |
| `/company/subscription` | Billing & subscription |
| `/company/analytics` | Analytics |
| `/company/documents/re-upload` | **Fullscreen** document re-upload |

### Interviewer Routes (`/interviewer/*`)

| Path | Layout | Description |
|---|---|---|
| `/interviewer/activate/:token` | **Public** | Account activation |
| `/interviewer/consent` | **Fullscreen** | Consent acknowledgment |
| `/interviewer/overview` | Dashboard | Dashboard |
| `/interviewer/slots` | Dashboard | Slot management |
| `/interviewer/submission/:bookingId` | **Fullscreen** | Post-interview submission |
| `/interviewer/calibration` | Dashboard | Calibration sessions |
| `/interviewer/calibration/baseline` | Dashboard | Baseline assessment |
| `/interviewer/calibration/:sessionId` | Dashboard | Calibration runner |
| `/interviewer/cases` | Dashboard | My cases |
| `/interviewer/cases/:caseId` | Dashboard | Case detail |
| `/interviewer/cases/:caseId/appeal` | Dashboard | File appeal |
| `/interviewer/appeals` | Dashboard | Appeal status list |

### Compliance Routes (`/compliance/*`)

| Path | Description |
|---|---|
| `/compliance/alerts` | Signal alerts dashboard |
| `/compliance/cases` | Case list |
| `/compliance/cases/:caseId` | Case detail |
| `/compliance/co-sign` | Co-sign panel |
| `/compliance/audit-trail` | Audit trail viewer |
| `/compliance/audit-trail/:caseId` | Case-specific audit trail |
| `/compliance/model-cards` | AI model card browser |
| `/compliance/signal-guidelines` | Signal guidelines reference |

---

## 13. Core Features by Role

### Jobseeker Features

| Feature | Description |
|---|---|
| **Find Jobs** | Search, filter, save, and apply to job listings |
| **Applications** | Track application status across all applied jobs |
| **AI Assessments** | Take AI-generated assessments with proctoring (webcam, tab-switch detection) |
| **Smart Interviews** | Three types: AI Real-time (with avatar), Document-based, Live (WebRTC) |
| **AI Practice Interview** | Practice interviews with AI feedback (no job application needed) |
| **Resume Builder** | Full-page AI resume studio — upload, edit, AI rewrite, JD matching, photo editing |
| **Career Performance** | Analytics dashboard showing interview scores, assessment results, trends |
| **Company Feed** | See announcements and posts from companies |
| **Campus Drive** | Campus recruitment portal |

### Employer Features

| Feature | Description |
|---|---|
| **My Jobs** | Create, edit, publish, pause, close job postings |
| **Job Applicants** | View and manage applicants per job |
| **Candidates** | Pipeline management: shortlist, schedule, interview, evaluate |
| **Interview Rounds** | Configure multi-round interview processes |
| **Assessments** | Build assessments manually or with AI generation |
| **Question Bank** | Reusable question library |
| **Ranked Results** | Multi-pipeline view — rank and compare candidates |
| **Final Hire** | Make and record final hiring decisions |
| **Analytics** | Hiring funnel, time-to-hire, source effectiveness |
| **IAEM** | Full interviewer management (see IAEM section below) |

### Company Admin Features

| Feature | Description |
|---|---|
| **Employer Management** | Add/remove employers (HR users) under the company |
| **Compliance Officers** | Add/remove compliance officers |
| **Job Approvals** | Approve/reject job postings before they go live |
| **Edit/Republish Requests** | Review employer requests to modify published jobs |
| **Billing & Subscription** | Plan management, payment history |
| **Ownership** | Transfer company ownership |
| **Analytics** | Company-wide hiring metrics |

---

## 14. Interview System

IEvalX supports **three types of interviews**:

### 14.1 AI Real-Time Interview
- **What:** AI-powered interview with a virtual avatar (speech-to-text + text-to-speech)
- **Flow:** Select config → Start session → AI asks questions → Candidate answers via voice → AI processes in real-time → Results generated
- **Tech:** WebSocket connection to `weekly-interview:8032`, MediaPipe for face tracking, RNNoise for audio noise suppression
- **Routes:** `/jobseeker/smart-interviews/ai/session/:configId` → `/jobseeker/smart-interviews/ai/results/:sessionId`

### 14.2 Document-Based Interview
- **What:** Interview based on uploaded documents (resume, portfolio, etc.)
- **Flow:** Upload documents → AI analyzes → Generates questions based on document content → Real-time Q&A session → Results
- **Routes:** `/jobseeker/smart-interviews/document/session/:id` → `/jobseeker/smart-interviews/document/results/:id`

### 14.3 Live Interview (WebRTC)
- **What:** Human-to-human video interview using LiveKit
- **Flow:** Employer schedules → Candidate enters waiting room → Both join live room → Video/audio/screen share
- **Tech:** LiveKit (`livekit-client` ~830KB) for WebRTC
- **Routes:** `/waiting-room/:roomName` → `/live-room/:roomName`

### IAEM Slot Booking
Candidates can book interview slots from a pool release:
- **Route:** `/jobseeker/smart-interviews/book/:releaseId`
- Employers configure slot availability via `/employer/iaem-scheduling`

---

## 15. Assessment System

### Assessment Types

| Type | Builder | Who Takes It |
|---|---|---|
| **Manual Assessment** | Employer builds sections + questions manually | Jobseeker |
| **AI Assessment** | AI generates questions from job description | Jobseeker |

### Assessment Builder Flow (Employer)
1. **Create:** Employer navigates to assessment builder
2. **Configure:** Set sections, question types (MCQ, coding, text), time limits
3. **AI Generation:** Optionally use AI to auto-generate questions from JD
4. **Review & Approve:** Review page before publishing
5. **Assign:** Assign to candidates (creates assignments)

### Assessment Taking Flow (Jobseeker)
1. **View Assignments:** See pending assessments in `/jobseeker/ai-assessments`
2. **Instructions:** Read assessment instructions + rules
3. **Start Test:** Enter fullscreen proctored mode
4. **Proctoring:** Webcam on, tab-switch detection, face detection (TensorFlow.js + MediaPipe)
5. **Answer Questions:** MCQ, coding (with code editor + compiler), text
6. **Submit:** Auto-submit on time-out or manual submit

### Proctoring System
- **Face Detection:** TensorFlow.js BlazeFace + MediaPipe for real-time face tracking
- **Tab Monitoring:** Detects tab switches and window blur events
- **Web Worker:** `proctor.worker.js` runs detection off the main thread
- **Signals:** Sends proctoring violation signals to `/api/proctor/`

---

## 16. IAEM Module

**IAEM (Interviewer Audit & Evaluation Module)** is IEvalX's system for monitoring and improving interviewer quality. It spans three roles: **Employer** (HR), **Interviewer**, and **Compliance Officer**.

### 16.1 Eight Audit Signals

After every interview, the AI analyzes the session and generates signals:

| Signal | Name | What It Detects | Severity Range |
|---|---|---|---|
| **A1** | Score Divergence | Interviewer's score differs significantly from AI score | Low – Medium |
| **A2** | Selection Outcome Quality | Recommendation doesn't align with competency scores | Medium – High |
| **A3** | JD Question Alignment | Questions asked were out-of-scope for the job description | Low – Medium |
| **A4** | Experience-Level Calibration | Question difficulty mismatched candidate's seniority | Low – Medium |
| **A5** | Differential Difficulty | Inconsistent difficulty across candidates for same role | Medium – High |
| **A6** | Professional Conduct | Unprofessional behavior during interview | High – Critical |
| **A7** | Misconduct | Serious misconduct (harassment, discrimination, etc.) | Critical |
| **A8** | Coverage & Duration | Interview too short or key topics not covered | Low – Medium |

### 16.2 Severity & SLAs

| Severity | SLA (hours) | Color |
|---|---|---|
| **LOW** | 336h (14 days) | Green |
| **MEDIUM** | 168h (7 days) | Orange |
| **HIGH** | 72h (3 days) | Red |
| **CRITICAL** | 24h (1 day) | Dark Red |

### 16.3 Case Lifecycle

```
Signal detected
    ↓
Case OPEN
    ↓  (HR reviews)
IN_REVIEW
    ↓  (HR requests interviewer response)
AWAITING_RESPONSE
    ↓  (Interviewer responds)
IN_REVIEW (again)
    ↓  (HR decides resolution)
    ├── No Action
    ├── Coaching Conversation
    ├── Formal Action (notifies Compliance)
    └── Ignored (A7 requires Compliance co-sign)
         ↓
PENDING_COSIGN (if required)
    ↓  (Compliance co-signs)
RESOLVED
    ↓  (21-day appeal window)
    ├── No appeal → Case archived (180-day retention)
    └── Appeal filed → APPEAL_REVIEW → UPHELD / MODIFIED / OVERTURNED
```

### 16.4 Competency Scoring (6 Competencies)

Interviewers rate candidates on 6 weighted competencies:

| Competency | Weight |
|---|---|
| Domain / Technical Competency | 25% |
| Problem Solving & Reasoning | 20% |
| Communication | 15% |
| Role / Job Relevance | 15% |
| Behavioural & Professional Skills | 15% |
| Confidence & Interview Conduct | 10% |

**Rating scale:** 1 (Poor) → 5 (Outstanding), or NA

**Score bands:**
- Band A (≥85): Exceptional → Strong Hire
- Band B (≥70): Strong → Hire
- Band C (≥55): Moderate → On Hold
- Band D (<55): Below Bar → Not Selected

### 16.5 Interviewer Lifecycle

```
Invitation sent (by HR)
    ↓
PENDING_APPROVAL (single approval)
    ↓
AWAITING_SECOND_APPROVAL (if required)
    ↓
APPROVED
    ↓  (Interviewer activates via link + completes consent)
ACTIVE
    ↓  (can be deactivated)
INACTIVE / OFFBOARDED / DELETED
```

### 16.6 Calibration System

Calibration ensures interviewers score consistently:
1. HR creates calibration sessions
2. Interviewers complete baseline assessments
3. System tracks score consistency over time
4. Drift triggers re-calibration

### 16.7 Appeals

- **Window:** 21 days from resolution
- **Interviewer can dispute:** Evidence, AI classification, severity, resolution outcome
- **Desired outcomes:** Overturn entirely, reduce severity, change resolution type
- **HR reviews and decides:** Upheld, Modified, or Overturned

### 16.8 Compliance Co-Sign

High-severity cases (especially A7 Misconduct resolved as "Ignored") require a Compliance Officer to co-sign the resolution — ensures HR decisions are independently verified.

---

## 17. AI/ML Components

| Component | Technology | Used For |
|---|---|---|
| **Face Detection (Proctoring)** | TensorFlow.js BlazeFace + COCO-SSD | Detect faces during assessments, flag multiple faces or no face |
| **Face Mesh (Registration)** | MediaPipe Vision WASM | Face capture during registration for identity verification |
| **Noise Suppression** | RNNoise WASM + AudioWorklet | Clean audio during AI interviews |
| **AI Interview Engine** | Backend via WebSocket | Generate questions, process answers, score in real-time |
| **AI Assessment Generator** | Backend API | Generate assessment questions from job descriptions |
| **AI Resume Writer** | Backend API | Rewrite resume sections, match resume to JD |
| **Audit Signals (IAEM)** | Backend AI | Analyze interview recordings and generate A1-A8 signals |
| **Proctor Worker** | Web Worker | Run face detection off-main-thread for smooth UI |

---

## 18. State Management

IEvalX uses a **multi-layer** state management approach:

| Layer | Technology | What It Manages |
|---|---|---|
| **Server State** | React Query (TanStack Query v5) | API data — auto-caching, refetching, pagination, invalidation |
| **Auth State** | React Context (`AuthContext`) | User object, login/logout, token management |
| **Theme State** | React Context (`ThemeContext`) | Light/dark mode toggle |
| **Form State** | React Hook Form | Complex multi-step forms (profile, assessments, post-interview) |
| **Local State** | `useState` / `useReducer` | Component-level UI state |
| **Persistent State** | `localStorage` | Auth tokens, user cache, feature flags, theme preference |

### React Query Configuration
- **Stale time:** Configured per query (most data goes stale quickly)
- **Refetch on focus:** Enabled via `useRefetchOnFocus` hook
- **Cache cleared on logout:** `queryClient.clear()` in logout handler

---

## 19. UI & Theming

### MUI Theme
- **Palette:** Custom brand colors defined in `src/theme/palette.js`
- **Typography:** Custom font settings in `src/theme/typography.js`
- **Components:** Global component overrides in `src/theme/components.js`
- **Shadows:** Custom shadow tokens in `src/theme/shadows.js`
- **Light/Dark:** Theme toggle managed by `ThemeContext`

### Layout Components
- **DashboardLayout:** Sidebar + Topbar + scrollable content area
- **Sidebar:** Role-aware navigation with collapsible sections, badge counts, and responsive drawer
- **Topbar:** User avatar, notifications, theme toggle

### Landing Page
- **Sections:** HeroSection, JobSearchBar, Categories, HowItWorks, FeatureJobs, EasyFind, UploadCv, Pricing, Testimonials, Blogs, FAQ, Footer
- **Animations:** GSAP for scroll-triggered animations
- **Carousel:** Embla Carousel for testimonials/features

---

## 20. CI/CD Pipeline

### Trigger
The pipeline runs on every push to `main` that changes:
- `src/**`, `public/**`, `package.json`, `package-lock.json`, `Dockerfile`, `nginx.conf`, `vite.config.js`, `index.html`, `.github/workflows/**`

### Steps

```
1. CHECKOUT
   └── actions/checkout@v4

2. AZURE LOGIN (OIDC)
   └── azure/login@v2 with service principal

3. ACR LOGIN
   └── Authenticate to Azure Container Registry

4. BUILD & PUSH
   └── docker build → tag with 7-char commit SHA → docker push to ACR

5. UPDATE INFRA REPO
   └── Clone ievalx-tech/ievalx-infra
   └── Update frontend image tag in k8s/ievalx-chart/values.yaml
   └── Commit + push (triggers Helm deploy)
```

### Deployment Flow

```
Push to main
    ↓
GitHub Actions builds Docker image
    ↓
Image pushed to Azure Container Registry (ACR)
    ↓
Image tag updated in ievalx-infra Helm chart (values.yaml)
    ↓
ArgoCD / Helm detects change
    ↓
Kubernetes (AKS) pulls new image and rolls out pods
    ↓
Live on ievalx.com via Cloudflare
```

---

## 21. Docker & Nginx

### Dockerfile (Multi-Stage)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration Highlights
- **Gzip:** Enabled for JSON, JS, CSS, SVG (level 5)
- **Client max body size:** 100MB (for resume/document uploads)
- **Proxy timeouts:** 300s read timeout for API, 3600s for WebSocket
- **Asset caching:** `/assets/*` gets `max-age=31536000, immutable` (Vite hashed filenames)
- **SPA fallback:** All non-API, non-asset routes → `index.html`
- **WebSocket:** `/ws/*` and `/weekly_interview/*` upgraded to WebSocket protocol

---

## 22. Feature Flags

Feature flags are set via environment variables and read at build time:

```javascript
// src/config/env.js
FEATURES: {
  AI_INTERVIEW:   import.meta.env.VITE_FEATURE_AI_INTERVIEW === "true",
  ASSESSMENTS:    import.meta.env.VITE_FEATURE_ASSESSMENTS === "true",
  CANDIDATE_POOL: import.meta.env.VITE_FEATURE_CANDIDATE_POOL === "true",
}
```

**Usage in components:**
```jsx
import env from '@/config/env';

{env.FEATURES.AI_INTERVIEW && <AIInterviewSection />}
```

> **Note:** Since these are baked at build time, changing a flag requires a rebuild and redeployment.

---

## 23. Coding Conventions

### File Naming
- **Components:** PascalCase (e.g., `JobseekerDashboard.jsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useJobs.js`)
- **Services:** camelCase with `Service` suffix (e.g., `jobService.js`)
- **Constants:** camelCase file, UPPER_SNAKE_CASE exports (e.g., `ROLES`, `SIGNALS`)

### Component Organization
```
components/
  └── role/                    # Group by user role
      └── Feature/             # One folder per feature/page
          └── FeatureName.jsx  # Main component (default export)
```

### Import Order
```javascript
// 1. React & React libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party libraries
import { Box, Typography } from '@mui/material';

// 3. Internal modules (using @ aliases)
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/api';
import { ROLES } from '@/constants';

// 4. Relative imports
import './styles.css';
```

### API Pattern
```
Component → Hook (useXxx) → Service (xxxService) → Axios Instance → Backend
```
- Components never call `api.get()` directly
- Hooks handle React Query configuration
- Services handle endpoint URLs and request shaping

### State Rule
- **Server data → React Query** (never `useState` for API data)
- **Auth → Context** (never prop-drill user/token)
- **Forms → React Hook Form** (never manual `onChange` for complex forms)
- **UI → `useState`** (modals, tabs, tooltips)

### Build Tags
Code added in specific builds is tagged with comments:
```javascript
// BUILD: 2026-08-24-iaem-roles-v1
```
This helps trace when features were added and group related changes.

---

## 24. Troubleshooting

### Common Issues

| Problem | Solution |
|---|---|
| **`npm run dev` fails with port in use** | Kill the process on port 5173: `lsof -ti:5173 \| xargs kill` |
| **API requests returning 401** | Check if `ievalx_token` exists in localStorage. Try logging out and back in. |
| **CORS errors in dev** | Make sure Vite proxy is configured correctly in `vite.config.js`. All `/api/*` should proxy. |
| **MediaPipe errors** | Run with HTTPS (need mkcert certs). Check that `/public/mediapipe-vision/` WASM files exist. |
| **Webcam not working** | HTTPS required. Check browser permissions. Try `navigator.mediaDevices.getUserMedia({video: true})` in console. |
| **Blank page after login** | Check browser console. Usually a lazy-load failure — verify the component file exists and exports `default`. |
| **GET cache serving stale data** | Wrap your call in `withFreshGet(() => api.get(...))` to bypass the 30s cache. |
| **Token refresh loop** | Clear localStorage entirely (`localStorage.clear()`) and re-login. |
| **Build fails on import** | Check that you're using `@/` aliases not relative paths. Verify the alias exists in `vite.config.js`. |
| **Large bundle warning** | Check `chunkSizeWarningLimit` in vite.config.js (set to 700KB). Use lazy loading for heavy components. |

### Debug Tips

1. **React Query DevTools:** Add `@tanstack/react-query-devtools` for cache inspection
2. **Network tab:** All API calls go through `/api/*` — filter by this prefix
3. **Auth debugging:** Check `localStorage.getItem('ievalx_token')` and decode the JWT at jwt.io
4. **Console warnings:** `[AuthProvider] refreshUser failed` means the token is valid but the profile endpoint failed — non-fatal
5. **Mock data:** Check `src/mocks/` for test data during development when backend is unavailable

### Key Resources
- **Frontend Repo:** This repository
- **Infrastructure Repo:** `ievalx-tech/ievalx-infra` (Helm charts, K8s configs)
- **Backend Services:** Separate repositories per microservice
- **Production:** `https://ievalx.com`

---

> **Last updated:** October 2026
>
> **Maintained by:** Lanciere Technologies Engineering Team