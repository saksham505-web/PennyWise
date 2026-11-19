# PENNYWISE

**Learn money. Master money.**

A gamified financial literacy and personal finance platform built from scratch, combining:
1. **Personal Financial Tracker** (Income/expenses, budget limits, interactive enlarged donut chart, savings goals, button-triggered transaction ledger).
2. **Sims Centre** (Educational virtual stock market with exactly 5 fictional stocks, fundamentals tooltips, financial performance bar charts, Buy/Sell execution, plus a 30-day accelerated SIP mutual fund timeline engine).
3. **Gamified Learning Journey** (Duolingo-inspired vertical curved pathway across Unit 1: Financial Literacy and Unit 2: Budgeting & Saving, interactive scenario MCQs, +20 XP rewards, streaks, and golden mastery nodes).
4. **AI Coach (Mr. LLAMA)** (Directly integrated live conversational financial coach powered by the Python backend via `/api/chat`, supporting natural-language guidance in English, Hindi, and Hinglish with interactive quizzes).

---

## Quick Start: How to Run Locally

### 1. Run the Flask Web Application
Ensure your `GEMINI_API_KEY` is present in `.env`, then run:
```bash
python server.py
```
Open your browser at:
```
http://127.0.0.1:5000
```
This serves the complete Pennywise web application and connects directly to the Mr. LLAMA AI Coach backend on `/api/chat`.

### 2. Frontend Development (Optional)
If you want to modify or rebuild the frontend source files:
```bash
cd frontend
npm run dev      # Runs Vite dev server on http://localhost:5173 with API proxy
npm run build    # Compiles production assets directly into ../static/
```

### 3. Run the Terminal AI Helper
```bash
python ask.py
```

---

## Architectural Layout

```
Llama/
├── server.py              # Flask server serving static web app & /api/chat endpoint
├── ask.py                 # Core AI assistant brain (sentence-transformers semantic search + Gemini)
├── static/                # Compiled production web bundle & brand assets
│   ├── index.html         # Pennywise Single-Page Application
│   ├── assets/            # Compiled React + Tailwind + Recharts JS/CSS bundles
│   └── llama.png          # Official Mr. LLAMA mascot asset
├── frontend/              # Source code for Pennywise React frontend
│   ├── src/
│   │   ├── components/    # Navigation, mascot with expression badges, tooltips
│   │   ├── data/          # Seeded demonstration datasets & curriculum
│   │   ├── modules/
│   │   │   ├── tracker/   # Personal tracker, enlarged donut chart, ledger drawer, budget, goals
│   │   │   ├── sims/      # Stock market, fundamentals, quarterly charts, 30-day SIP engine, portfolio
│   │   │   ├── learning/  # Vertical curved pathway, interactive lesson modal, XP/mastery
│   │   │   └── coach/     # Live Mr. LLAMA AI chat interface
│   │   └── utils/         # Indian Rupee formatters, localStorage persistence
│   ├── package.json
│   ├── tailwind.config.js # Official Pennywise brand color system
│   └── vite.config.js     # Relative base build into ../static/
└── knowledge/             # Financial literacy source documents (RBI, DICGC, NCFE)
```

---

## Official Palette

- **Deep teal:** `#087985` (main teal brand surface and accents)
- **Dark teal:** `#063F46` (primary dark backgrounds and navigation)
- **Pale mint:** `#D7ECE5` (soft highlights and light surfaces)
- **Muted olive:** `#B7D16A` (secondary accent and chart colours)
- **Electric chartreuse:** `#C5E86C` (main brand highlight and primary actions)
- **Warm off-white:** `#F4F3E9` (main text and light surfaces)
