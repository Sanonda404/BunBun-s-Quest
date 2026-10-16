# 🐰 Bun Bun’s Quest: Master Project Checklist

## Phase 1: Project Foundation & Core Scaffolding
- [x] Initial Repository Setup: Scaffolded project structure and git tracking rules.
- [x] Backend Core: FastAPI backend setup with health check endpoints.
- [x] Frontend Shell: React dashboard structured with Tailwind CSS and DaisyUI.
- [x] Extension Setup: Chrome Extension Manifest V3 configuration and desktop app launcher script.
- [x] Tab Monitoring: Background worker for tracking active tab navigation.

## Phase 2: Guard Service & AI Pipeline
- [x] Routing & Whitelisting: FastAPI distraction check routes and system/music domain whitelisting.
- [x] AI Guard Service: Hybrid evaluation using Gemini and Groq fallback layers.
- [x] Inbox Storage: Initial setup for the "Look At Later" inbox storage and frontend panel.

## Phase 3: Focus Timer & State Synchronization
- [x] Focus Timer Engine: Fully functional focus timer component with countdown logic and session presets.
- [x] Backend State Sync: Synchronizing focus active states (`is_focus_active`) and study topics with FastAPI server storage.
- [x] Quiz System Evaluation & Removal: Intentionally dropped to streamline extension focus.
- [x] Vector Store Evaluation & Removal: Cleaned up local RAG vector store code to keep the app lightweight.

## Phase 4: Distraction Enforcement & Polish
- [x] Full Distraction Blocking: Integrated the guard evaluation engine directly into active browsing protection.
- [x] Extension Functional Polish: Main core loops (Timer -> Guard -> Backend -> Inbox) verified and working.

## Phase 5: Gamification, Rewards & Cozy Features (Active Roadmap)
- [ ] **Daily Focus Streaks & Stats:**
  - [ ] Track consecutive focus sessions and daily completion consistency.
  - [ ] Display streak counters and session history on the dashboard popup.
- [ ] **Rewards & Mascot Costumes:**
  - [ ] Award virtual carrots or "Bun Coins" upon successfully completing focus blocks.
  - [ ] Build an unlockable wardrobe system to dress up Bun Bun in cozy alternate outfits.
- [ ] **Hydration & Wellness Break Reminders:**
  - [ ] Add gentle water-sip and stretch prompts triggered automatically when a focus block ends / break time starts.
- [ ] **Ambient Focus Audio Integration:**
  - [ ] Refine built-in audio player hooks for lofi beats and rain soundscapes during deep work.
- [ ] **Cozy Micro-Interactions:**
  - [ ] Implement celebratory animations and randomized cute commentary messages from Bun Bun when distractions are caught or focus goals are reached.