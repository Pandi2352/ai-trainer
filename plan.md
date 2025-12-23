# OmniTrain AI – Full Specification & Sprint Plan

> Version: v1.0 (Draft)

---

## 1. Product Overview

**Product name:** OmniTrain AI – Admin-Driven Training Platform  
**Type:** SaaS, AI-powered training and assessment platform focused on Admin → Trainee workflows.  

**Problem statement**  
Organizations and educators spend significant time converting learning material into structured, evaluable training and assessments while lacking detailed insight into performance and weak areas.  

**Solution summary**  
OmniTrain AI lets Admins upload content, auto-generate questions (MCQ / Single Choice / Paragraph) using AI, configure marks and difficulty, assign trainings to Trainees, and view analytics and AI-assisted grading with topic-wise insights.  

**Primary user roles**

- **Admin**
  - Uploads content.
  - Generates and manages questions.
  - Creates and assigns trainings.
  - Reviews submissions and analytics.
- **Trainee**
  - Receives assignments.
  - Attempts and submits answers.
  - Views scores, feedback, and recommendations.

**Core v1 goals**

- Minimize time to create a high-quality assessment from existing documents.  
- Give Admin full control over question mix, difficulty, and marks.  
- Provide actionable analytics at assignment, topic, and trainee level.

---

## 2. Scope

### 2.1 In-scope (v1 / v1.5)

- Role-based authentication (Admin, Trainee).
- Domain/topic management (IT, Physics, Chemistry, TNPSC, etc.).
- Content upload (PDF, DOCX, PPTX, TXT) and AI-based question generation.
- Question bank with:
  - Types: Paragraph, SingleChoice, MCQ.
  - Difficulty: Easy / Medium / Hard.
  - Marks, tags, expected answers.
- Admin-driven training assignment:
  - Configure total questions and per-type counts.
  - Configure difficulty and marks per question.
  - Configure time limit per question.
  - Configure total time limit for the assignment.
  - Configure total marks for the assignment.
  - Configure total time limit for the assignment.
  - select language for the assignment.
  - Practice vs Assessment modes.
  - Assign to selected Trainees with optional deadlines and time limits.
- Trainee module:
  - View assigned trainings.
  - Attempt, submit, and view scores.
- Auto-scoring for objective questions (SingleChoice, MCQ).
- AI-assisted scoring for paragraph answers with Admin override.
- Analytics:
  - Assignment-level performance (distribution, completion, timing).
  - Topic and difficulty-level performance.
  - Basic trainee progress view.
- Basic adaptive recommendations (weak topics → recommended practice).

## 3. Tech Stack

### 3.1 Backend

- **Framework:** NestJS (TypeScript).
- **API style:** REST (JSON over HTTPS).
- **Database:** MongoDB.
- **Auth:** JWT + role-based authorization.
- **AI:** Gemini API
  - Question generation.
  - Paragraph-answer grading (AI suggestion).
- **Storage:** Object storage (e.g., S3 equivalent) for file uploads.
- **Messaging/Jobs (optional):** Redis + BullMQ (for async AI and analytics tasks).

### 3.2 Frontend

- **Framework:** React vite + tailwindcss + typescript + redux + antd + chartjs .
- **Styling:** Tailwind CSS + selected component library (e.g., MUI or headless UI).
- **Charts:** Chart.js or Recharts.
- **State/data:** React Query / SWR for server state; Context for auth/session.


## 4. System Architecture

### 4.1 High-level architecture

- **Client (React vite + tailwindcss + typescript + redux + antd + chartjs)**
  - Admin App:
    - Content upload & management.
    - Question bank management.
    - Assignment creation and management.
    - Analytics and reporting.
  - Trainee App:
    - Assigned trainings & progress.
    - Attempt and submission views.
    - Score, feedback, and recommendations.

- **API (NestJS)**
  - Auth Module
  - User Module
  - Domain & Topic Module
  - Content Upload Module
  - Question Engine Module (AI integration)
  - Question Management Module
  - Assignment Module
  - Submission Module
  - Analytics Module
  - Settings Module

- **Data Layer (MongoDB)**
  - `users`
  - `domains`
  - `topics`
  - `questions`
  - `assignments`
  - `submissions`
  - `content_files`
  - `settings`

### 4.2 Module responsibilities

- **Auth Module**
  - Registration, login, JWT issuing/refresh, password hashing.
  - Role-based access guards.

- **Domain & Topic Module**
  - CRUD for domains.
  - CRUD for topics/subtopics.

- **Content Upload Module**
  - File upload endpoints.
  - Text extraction and association with domain/topic.

- **Question Engine Module**
  - Interaction with Gemini for:
    - Question generation.
    - AI-based grading suggestions.
  - Prompt construction and response validation.

- **Question Management Module**
  - CRUD for questions.
  - Filtering, tagging, soft delete/archiving.
  - Usage statistics tracking (times used, average score/time).

- **Assignment Module**
  - CRUD for assignments.
  - Logic for manual/automatic question selection.
  - Assignment lifecycle and status updates.
  - Assignment → Trainee mapping.

- **Submission Module**
  - Creation of submissions.
  - Auto-scoring for objective questions.
  - Integration with AI grading for paragraph questions.
  - Score aggregation.

- **Analytics Module**
  - Aggregated metrics (assignment, topic, trainee).
  - Export endpoints (CSV/Excel).

---

## 5. Core Functional Requirements

### 5.1 Authentication & User Management

- Users can register with email and password.
- Login generates an access token (short-lived) and refresh mechanism.
- Roles: `Admin`, `Trainee`.
- Protected endpoints enforce role-based access.
- Admin can view list of users (basic management, future enhancements optional).

### 5.2 Domain & Topic Management

- Admin can:
  - Create, update, archive domains.
  - Create, update, archive topics under domains.
- Each question and assignment links to domain and topics.

### 5.3 Content Upload & AI Question Generation

**Upload**

- Admin can upload files (PDF, DOCX, PPTX, TXT).
- System extracts text content and stores a reference to the source file.

**Question generation**

- Admin selects:
  - Domain and topics.
  - Desired question type(s).
  - Difficulty and marks.
- System sends a structured prompt to AI including:
  - Extracted content.
  - Topic, difficulty, type, marks.
- AI returns JSON with:
  - Question text.
  - Question type.
  - Marks.
  - Difficulty.
  - Options (for choice questions).
  - Expected answer/solution.
- Admin can:
  - Inspect generated questions.
  - Edit content, options, answers, difficulty, marks.
  - Save selected questions to the question bank.

### 5.4 Question Bank

- Admin can browse and filter questions by:
  - Domain, topics.
  - Type (Paragraph / SingleChoice / MCQ).
  - Difficulty.
  - Tags.
- Admin can:
  - Edit question metadata and content.
  - Tag questions (e.g., exam, mock, practice).
  - Archive questions (soft delete) without breaking historical submissions.
- System updates statistics:
  - `timesUsed`, `avgScore`, `avgTimeSec` for each question (used by analytics and adaptivity).

### 5.5 Assignment Management (Admin)

- Admin can create an assignment with:
  - Title, description.
  - Domain and topics.
  - Mode: `Practice` or `Assessment`.
  - Configuration per question type:
    - Count.
    - Marks per question.
    - Difficulty mix (optional).
  - Settings:
    - Deadline (optional).
    - Time limit (optional).
    - Negative marking (optional).
    - Shuffle questions and options.
- Question selection:
  - Manual selection from question bank.
  - Auto-selection based on config:
    - For each type, difficulty, and count, select questions from bank.
- Assignment lifecycle states:
  - `draft`: Admin configuring.
  - `assigned`: Assigned to trainees, not started.
  - `in-progress`: Trainees started.
  - `completed`: All intended use done (for analytics).
- Assignment distribution:
  - Admin selects one or more Trainee IDs to assign.
  - Future: groups/cohorts (out-of-scope now).

### 5.6 Trainee Experience

- **Dashboard**
  - Lists:
    - “To Do” assignments (with status, deadlines).
    - “Completed” assignments (with scores).
- **Attempt view**
  - Shows questions with:
    - MCQ: multiple selections allowed.
    - SingleChoice: radio button.
    - Paragraph: text area.
  - Navigation:
    - Next/previous, question index view.
  - Timer:
    - For Assessment mode with time limit.
    - Warnings as time approaches zero.
- **Submission**
  - Validation of:
    - Deadline.
    - Time limit.
    - Allowed attempts (if enforced).
  - On submit:
    - Responses saved to `Submission` record.
    - Objective questions auto-scored.
    - Paragraph questions queued for AI scoring (or triggered immediate if synchronous).
- **Results**
  - Trainee sees:
    - Total score and max score.
    - Breakdown by question (objective correctness).
    - For practice mode, optionally show correct answers and explanations.

### 5.7 AI-Assisted Grading for Paragraph Answers

- For each paragraph answer:
  - System sends question, expected answer, rubric/meta, and trainee answer to AI.
  - AI returns:
    - Suggested score.
    - Explanation of reasoning.
    - Feedback text for trainee.
- Admin grading interface:
  - Shows question, trainee answer, AI suggestion and explanation.
  - Admin can:
    - Accept AI suggestion.
    - Override score and optionally add manual comments.
- Final scores:
  - Stored per answer with:
    - `autoScore` (if any).
    - `aiScore`.
    - `finalScore`.
    - `aiFeedback` text.

### 5.8 Analytics & Reporting

**Assignment-level analytics**

- Metrics:
  - Score distribution (min, max, mean, median).
  - Completion rate.
  - Average time spent.
- Visualizations:
  - Bar chart: score per trainee.
  - Pie/donut chart: question type distribution.
  - Summary cards for key metrics.

**Topic-level analytics**

- Metrics:
  - Average score per topic.
  - Average score per difficulty per topic.
- View:
  - Table or chart showing topics vs performance.

**Trainee-level analytics**

- Metrics:
  - Total assignments attempted.
  - Average score.
  - Completion rate.
  - Weak topics list.

**Exports**

- Admin can export assignment results and basic analytics to CSV.

### 5.9 Adaptive Recommendations (Basic)

- After each submission:
  - For each topic:
    - If averaged score below threshold, mark topic as weak.
- Trainee dashboard shows:
  - “Weak topics” list.
  - Recommended practice assignments or question sets (simple rule-based selection from bank).

---

