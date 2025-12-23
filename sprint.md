## 7. Non-Functional Requirements

### 7.1 Performance

- Typical API response time: < 300–500ms for standard operations.
- AI operations may run asynchronously where necessary.

### 7.2 Security

- All endpoints behind TLS.
- Passwords hashed with a secure algorithm.
- Strict input validation and sanitization.
- Role-based authorization enforced server-side and client-side.

### 7.3 Reliability & Availability

- Production target uptime: ≥ 99.5%.
- Regular database and file backups.
- Graceful handling of AI failures (fallback flows).

### 7.4 Observability

- Centralized logging with correlation IDs.
- Error tracking and alerting.
- Basic metrics: request rate, error rate, latency.

---

## 8. UX & UI Requirements

### 8.1 Admin UX

- Clear dashboard with:
  - Active assignments.
  - Pending grading.
  - High-level performance cards.
- Assignment creation wizard:
  - Steps: Basics → Questions → Settings → Assign.
- Easy navigation between Content, Questions, Assignments, Analytics, and Settings.

### 8.2 Trainee UX

- Clean dashboard:
  - “To Do” and “Completed” sections.
- Attempt page:
  - Progress bar, question index, timer (if applicable).
- Result page:
  - Summary and breakdown; clear feedback messages.

### 8.3 Accessibility & Localization (foundations)

- Keyboard navigable primary flows.
- Adequate contrast for theme.
- Text content externalized for future translations.

---

## 9. Sprint Plan (4-Week Sprints)

Below is a 6-sprint plan (each sprint = 4 weeks) with goals and main deliverables.

### Sprint 1 (Weeks 1–4) – Foundations & Auth

**Goal:** Set up core project structure, environments, and secure role-based access.

**Deliverables:**

- Backend:
  - NestJS project scaffolding.
  - Auth module:
    - Register, login, logout endpoints.
    - JWT-based access and refresh tokens.
    - Role-based guards (Admin/Trainee).
  - Basic User, Domain, Topic schemas.
- Frontend:
  - react vite ts  project scaffolding.
  - Tailwind/MUI integration.
  - Authentication pages:
    - Login for Admin & Trainee.
  - Minimal dashboards:
    - Admin dashboard shell.
    - Trainee dashboard shell.

**Done criteria:**

- Admin and Trainee can sign in and see role-specific placeholder dashboards.
- Code is deployed to a reachable dev/stage environment.

---

### Sprint 2 (Weeks 5–8) – Content Upload & Question Engine

**Goal:** Enable Admins to upload content and generate questions using AI.

**Deliverables:**

- Backend:
  - Content upload endpoints.
  - File storage integration.
  - Text extraction from uploaded files.
  - Question model finalized with metadata fields.
  - Question Engine module:
    - AI integration for question generation.
    - Structured prompts and response validation.
- Frontend:
  - Admin UI to:
    - Upload content (with upload status).
    - Choose domain/topic and generation settings.
    - Trigger question generation.
    - View generated questions and edit them (content, type, difficulty, marks, options, expected answer).
  - Save selected questions to the question bank.

**Done criteria:**

- Admin can upload a document, generate questions using AI, edit them, and save into the question bank.
- Questions persist with full metadata and can be listed and filtered.

---

### Sprint 3 (Weeks 9–12) – Assignment Creation & Distribution

**Goal:** Allow Admins to create configurable assignments and assign them to Trainees.

**Deliverables:**

- Backend:
  - Assignment schema and module.
  - APIs for:
    - Create/update/delete assignment.
    - Add/remove questions to assignment.
    - Auto-selection of questions by type/difficulty/count.
    - Assigning to Trainees.
    - Fetch assignments per Admin and per Trainee.
- Frontend:
  - Assignment wizard:
    - Step 1: Basics (title, domain, topics).
    - Step 2: Question selection (manual or auto).
    - Step 3: Configuration (marks, difficulty mix, mode, deadline, time limit, negative marking, shuffle).
    - Step 4: Assign to Trainees and confirm.
  - Trainee dashboard:
    - List of “Assigned” trainings with key metadata (title, domain, deadline, status).

**Done criteria:**

- Admin can fully configure and assign a training to one or more Trainees.
- Trainees see their assigned trainings correctly on their dashboard.

---

### Sprint 4 (Weeks 13–16) – Attempt, Submission & Auto-Scoring

**Goal:** Enable Trainees to complete assignments and handle scoring for objective questions.

**Deliverables:**

- Backend:
  - Submission schema and module.
  - APIs to:
    - Start and submit an assignment attempt.
    - Auto-score SingleChoice and MCQ questions.
    - Store per-answer and total scores.
  - Enforcement of:
    - Deadlines.
    - Time limits (if configured).
- Frontend:
  - Attempt UI:
    - Question rendering for all types.
    - Navigation (next/prev, question index).
    - Timer for Assessment mode.
  - Submission flow:
    - Confirmation.
    - Error handling (deadline exceeded, already submitted).
  - Result page:
    - For Trainee: total score, breakdown for objective questions.
    - For Admin: list of submissions with scores.

**Done criteria:**

- Trainee can attempt and submit an assignment respecting deadlines/time limits.
- Objective questions are auto-scored and scores visible to Trainee and Admin.

---

### Sprint 5 (Weeks 17–20) – Analytics v1 & Insights

**Goal:** Provide Admin with useful analytics and dashboards.

**Deliverables:**

- Backend:
  - Analytics endpoints:
    - Assignment-level:
      - Score distribution, completion rate, average time.
    - Topic-level:
      - Average scores per topic and difficulty.
  - Capture `timeTakenSec` per question/attempt.
- Frontend:
  - Admin analytics dashboard:
    - Select assignment → view:
      - Bar chart: score per Trainee.
      - Pie/donut: question type breakdown.
      - Metrics cards: completion rate, avg score, avg time.
  - Topic performance view:
    - Table/chart of topics vs average score and difficulty.
  - Export:
    - CSV download for assignment results.

**Done criteria:**

- Admin can view at least one assignment with charts and metrics computed from real submissions.
- Admin can export data for deeper offline analysis.

---

### Sprint 6 (Weeks 21–24) – AI Grading v1, Adaptivity & Pilot Readiness

**Goal:** Add AI-assisted paragraph grading, basic adaptive recommendations, and polish for pilot release.

**Deliverables:**

- Backend:
  - AI grading integration:
    - Endpoint to request AI scores for paragraph answers.
    - Store `aiScore`, `aiFeedback`, and `finalScore`.
  - Adaptive rules:
    - Logic to mark topics as weak based on performance.
    - Endpoint for “recommended practice” by trainee.
- Frontend:
  - Admin grading UI:
    - List submissions per assignment.
    - For each paragraph answer: question, trainee answer, AI suggestion, Admin override controls.
  - Trainee dashboard enhancements:
    - “Weak topics” section.
    - “Recommended next steps” list.
  - UX polish:
    - Better error and empty states.
    - Loading skeletons.
- Operational:
  - Run a small internal/pilot rollout.
  - Capture feedback and fix critical bugs.

**Done criteria:**

- AI-assisted grading is available for paragraph answers with Admin oversight.
- Trainees see weak topics and basic recommendations.
- System is stable enough for a small real-world pilot.

---

## 10. Future Extensions (Beyond This Spec)

- Organization and cohort management (departments, batches).
- Multi-language support and localized content.
- Gamification (badges, streaks, leaderboards).
- PWA/mobile apps with offline attempt support.
- SSO, SCORM/xAPI, and integrations with external LMS/HR systems.

---
