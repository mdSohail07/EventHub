# 🚀 EventHub — AI-Powered Opportunity Aggregator

> **A centralized discovery engine that aggregates, extracts, and tracks tech opportunities (Hackathons, Hiring Challenges, Internships, Workshops) from fragmented web sources.**

---

## 📌 The Problem
Students miss out on valuable hackathons and internships because opportunity announcements are scattered across Unstop, Devfolio, Devpost, LinkedIn, Discord channels, and raw WhatsApp notices.

## 💡 The Solution: EventHub
EventHub actively scrapes and ingests raw opportunity notices, processes unstructured text via an LLM extraction pipeline, scores matches against user-defined skill profiles directly in PostgreSQL, and automates 1-click Google Calendar syncs and deadline alerts.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js REST API
- **Database:** PostgreSQL (JSONB schema, GIN Text Indexing, Composite Foreign Keys)
- **AI Engine:** Google Gemini Flash (Structured JSON extraction & parsing)
- **Automation:** `node-cron` scheduled workers, Nodemailer batch dispatcher

---

## ✨ Key Features

- **Multi-Source Aggregation:** Pulls opportunities across platforms with live channel badges.
- **AI Unstructured Ingestion:** Converts raw message text or club posters into structured JSON (`title`, `ai_summary`, `deadline`, `application_link`).
- **Postgres-Optimized Smart Matching:** Shuffled correlated subqueries dynamically score events against user skills without memory leaks.
- **Fault-Tolerant Email Alerts:** Batched parallel dispatcher (`Promise.allSettled()`) for deadline reminders.
- **Saved Opportunity Tracker:** Personal Kanban-style application tracker with strict user session isolation.
- **1-Click Google Calendar Sync:** Direct integration with standard RFC format calendar actions.

---

## 🚀 Local Development Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/EventHub.git
cd EventHub
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd event-hub-backend
npm install
\`\`\`

Create a `.env` file in `event-hub-backend`:
\`\`\`env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/event_hub
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
\`\`\`

Initialize tables & run the server:
\`\`\`bash
node create-table.js
npm start
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../event-hub-frontend
npm install
\`\`\`

Create a `.env.local` file in `event-hub-frontend`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

Start Next.js dev server:
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` in your browser.

---

## 📜 License
This project is open-source under the MIT License.