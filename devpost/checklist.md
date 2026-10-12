---
doc: checklist
status: approved
---

# 🐰 Bun Bun's Quest — Build Checklist

Build mode: learn

## Slices

- [ ] **1. Setup Project Folders & Git Repository**
  Becomes usable: Clean directory layout (`/backend`, `/frontend`, `/extension`, `devpost/`) initialized as a Git repository.
  Why now: Establishes a clean home base before writing any code.
  PRD ref: `prd.md > Architecture`
  Spec ref: `spec.md > Components`
  Build: Create the root directory structure and initialize git.
  Verify (mechanical): Run `git status` and confirm repository is ready.
  Learner check: Verify that your project folders match the planned structure.
  Commit: `Initialize Bun Bun repository and core folder structure`

- [ ] **2. FastAPI Backend Health Check Endpoint**
  Becomes usable: A running FastAPI server responding with status OK at `/health`.
  Why now: Verifies the backend framework is working correctly before adding complex logic.
  PRD ref: `prd.md > Backend Core`
  Spec ref: `spec.md > Components > 2. FastAPI Backend Core`
  Build: Create `backend/main.py` with FastAPI app and `/health` route, plus `requirements.txt`.
  Verify (mechanical): Run `uvicorn backend.main:app --reload` and query `http://localhost:8000/health`.
  Learner check: Visit `http://localhost:8000/health` in your browser and see the healthy JSON response.
  Commit: `Add FastAPI backend core and health check endpoint`

- [ ] **3. React Frontend Dashboard Scaffold**
  Becomes usable: A running Vite React app with Tailwind CSS and DaisyUI showing a cozy welcome header.
  Why now: Sets up the visual interface for Bun Bun's dashboard.
  PRD ref: `prd.md > Frontend Dashboard`
  Spec ref: `spec.md > Components > 3. React Frontend Dashboard`
  Build: Initialize Vite React app in `/frontend`, install Tailwind CSS & DaisyUI, and create a basic header component.
  Verify (mechanical): Run `npm run dev` in frontend and check that it starts on `http://localhost:5173`.
  Learner check: Open `http://localhost:5173` and see your styled cozy dashboard header.
  Commit: `Scaffold React frontend dashboard with Tailwind and DaisyUI`

- [ ] **4. Desktop App Shell Launcher Script**
  Becomes usable: A desktop batch script (`start_cozystudy.bat`) that boots the backend and opens the frontend in standalone `--app` mode.
  Why now: Unifies backend and frontend into a single desktop-like launch experience.
  PRD ref: `prd.md > Desktop Launcher`
  Spec ref: `spec.md > Components > 1. Desktop App Launcher`
  Build: Write `start_cozystudy.bat` to launch uvicorn and open Chrome/Edge in `--app=http://localhost:5173`.
  Verify (mechanical): Double-click the batch file and verify both terminal and browser window open correctly.
  Learner check: Run the batch file and confirm Bun Bun's sanctuary pops open cleanly as a standalone app.
  Commit: `Create desktop app launcher script`

- [ ] **5. Chrome Extension Manifest & Background Tab Monitor**
  Becomes usable: A Manifest V3 Chrome extension background worker that listens to active tab changes and URL navigation.
  Why now: Lays the groundwork for Bun Bun's distraction guard.
  PRD ref: `prd.md > Distraction Guard`
  Spec ref: `spec.md > Components > 4. Chrome Extension Distraction Guard`
  Build: Create `extension/manifest.json` and `extension/background.js` to log active tab updates.
  Verify (mechanical): Load unpacked extension in Chrome developer mode and check background console logs.
  Learner check: Load the extension in Chrome and see it successfully monitoring tab changes.
  Commit: `Add Chrome extension manifest V3 and tab monitor background worker`

- [ ] **6. Distraction Guard & Music Whitelisting API**
  Becomes usable: FastAPI endpoint that evaluates URL relevance and ignores whitelisted music domains (Spotify, YouTube audio).
  Why now: Protects focus without interrupting the user's music.
  PRD ref: `prd.md > Whitelisting & Guard`
  Spec ref: `spec.md > Components > 4. Chrome Extension Distraction Guard`
  Build: Add `/api/check-distraction` endpoint in FastAPI that filters URLs and whitelists music streams.
  Verify (mechanical): Send POST request with a music URL vs a game URL to `/api/check-distraction` and verify correct boolean response.
  Learner check: Test the API endpoint locally to ensure music sites pass freely while distractions are flagged.
  Commit: `Implement FastAPI distraction check and music whitelisting route`

- [ ] **7. "Look At Later" Inbox Storage & UI Panel**
  Becomes usable: Intercepted distraction URLs are saved into a local inbox and displayed inside a React drawer/panel.
  Why now: Gives users a guilt-free way to save distractions for break time.
  PRD ref: `prd.md > Inbox`
  Spec ref: `spec.md > Components > 4. Chrome Extension Distraction Guard`
  Build: Create backend storage list for saved links and build `InboxPanel.jsx` in React to render them.
  Verify (mechanical): Push a test link to backend storage and confirm it renders inside the React frontend inbox component.
  Learner check: Open the Look At Later inbox in the dashboard and verify saved items appear correctly.
  Commit: `Add Look At Later inbox storage and frontend panel`

- [ ] **8. RAG Engine Note Chunking & Vector Store Setup**
  Becomes usable: Python module (`backend/rag_engine.py`) that chunks uploaded text and indexes them using ChromaDB or FAISS.
  Why now: Prepares the knowledge store for study quizzes.
  PRD ref: `prd.md > RAG Pipeline`
  Spec ref: `spec.md > Components > 5. RAG Quiz Pipeline`
  Build: Implement text chunking and local vector database initialization in `backend/rag_engine.py`.
  Verify (mechanical): Run a test Python script importing `rag_engine` to confirm vector store initializes without errors.
  Learner check: Verify that the local vector database folder is created successfully upon chunking test notes.
  Commit: `Set up local RAG vector store and text chunking engine`

- [ ] **9. LLM MCQ Quiz Generator Endpoint**
  Becomes usable: FastAPI endpoint that takes study context from vector search and generates structured JSON multiple-choice questions.
  Why now: Powers Bun Bun's interactive quizzes.
  PRD ref: `prd.md > Quiz Generator`
  Spec ref: `spec.md > Components > 5. RAG Quiz Pipeline`
  Build: Add `/api/quiz/generate` endpoint formatting RAG chunks into JSON quiz questions with answer keys.
  Verify (mechanical): Call `/api/quiz/generate` with sample topic text and verify valid JSON question array returns.
  Learner check: Test generating a quick 3-question quiz from sample notes via API.
  Commit: `Add LLM MCQ quiz generation endpoint`

- [ ] **10. Exam Review Bank & Wrong Answer Tracker**
  Becomes usable: Incorrect quiz answers are automatically saved to a review bank for future study sessions.
  Why now: Helps students reinforce weak spots.
  PRD ref: `prd.md > Review Bank`
  Spec ref: `spec.md > Components > 5. RAG Quiz Pipeline`
  Build: Implement review bank storage in FastAPI and build review view in React frontend.
  Verify (mechanical): Submit a wrong quiz answer and verify it appears in the review bank endpoint.
  Learner check: Take a sample quiz, miss a question intentionally, and see it logged in your Exam Review Bank.
  Commit: `Implement Exam Review Bank for wrong answer reinforcement`

- [ ] **11. Companion Mood Check-in Modal**
  Becomes usable: Startup modal where users select their energy level / mood before starting a study session.
  Why now: Customizes the session flow to the student's current state.
  PRD ref: `prd.md > Companion Flow`
  Spec ref: `spec.md > Components > 3. React Frontend Dashboard`
  Build: Create `MoodModal.jsx` component in React with energy options and state handler.
  Verify (mechanical): Load dashboard, verify mood modal pops up on start, and check that selecting an option dismisses it.
  Learner check: Open the app, pick your mood, and watch the dashboard adapt to your energy level.
  Commit: `Add companion mood check-in startup modal`

- [ ] **12. Companion State Machine (Awake, Sleeping, Cheering)**
  Becomes usable: Interactive animal companion visual sprite / card that shifts between awake, sleeping (during focus), and cheering states.
  Why now: Gives Bun Bun its living personality.
  PRD ref: `prd.md > Companion States`
  Spec ref: `spec.md > Components > 3. React Frontend Dashboard`
  Build: Create `Companion.jsx` component with state props for active study vs break.
  Verify (mechanical): Toggle session state in React and verify companion graphic/animation changes accordingly.
  Learner check: Start a study session and watch Bun Bun transition into a peaceful sleeping state.
  Commit: `Implement Bun Bun companion visual state machine`

- [ ] **13. Focus Timer & Periodic Wellness Whispers**
  Becomes usable: Pomodoro-style focus timer that periodically triggers gentle stretch and posture reminders from Bun Bun.
  Why now: Promotes student health and well-being during long study blocks.
  PRD ref: `prd.md > Wellness Whispers`
  Spec ref: `spec.md > Components > 3. React Frontend Dashboard`
  Build: Implement countdown timer hook and toast notification system for wellness whispers.
  Verify (mechanical): Run a shortened test timer and confirm whisper alert triggers at interval.
  Learner check: Watch for Bun Bun's gentle posture and blink reminder popup during study time.
  Commit: `Add focus timer and periodic wellness whisper alerts`

- [ ] **14. Cozy Break Hub Modal & Custom Timer**
  Becomes usable: Break hub overlay with countdown timer and sanity-check alerts for overly long breaks.
  Why now: Organizes study breaks into a relaxing sanctuary.
  PRD ref: `prd.md > Break Hub`
  Spec ref: `spec.md > Components > 6. Break Hub & Mini-Games`
  Build: Create `BreakHub.jsx` with break timer and sanity warning validation (>25m check).
  Verify (mechanical): Trigger break mode, test timer controls, and verify sanity alert fires if break time is set too high.
  Learner check: Click take a break and verify the cozy break hub interface opens smoothly.
  Commit: `Create cozy Break Hub modal and sanity-check timer`

- [ ] **15. Lightweight React Breathing & Clicker Mini-Game**
  Becomes usable: Embedded mini-game inside the break hub for relaxing de-stressing.
  Why now: Adds fun gamification and relaxation to study breaks.
  PRD ref: `prd.md > Mini-Games`
  Spec ref: `spec.md > Components > 6. Break Hub & Mini-Games`
  Build: Build a simple plant-watering clicker / breathing animation component in React.
  Verify (mechanical): Open break hub, interact with the mini-game, and confirm score/progress state updates.
  Learner check: Play a round of Bun Bun's break mini-game and water your virtual sprout.
  Commit: `Add lightweight React breathing clicker mini-game`

- [ ] **16. YouTube Educational Shorts Search & API Endpoint**
  Becomes usable: FastAPI endpoint that fetches short educational videos (<60s) based on study topic tags.
  Why now: Powers productive micro-learning during breaks.
  PRD ref: `prd.md > Educational Reels`
  Spec ref: `spec.md > Components > 7. Curated Educational Reels & Videos`
  Build: Create `/api/reels/fetch` endpoint integrating search queries for educational shorts.
  Verify (mechanical): Query `/api/reels/fetch?topic=Python` and confirm valid video results return.
  Learner check: Test fetching educational short recommendations via the backend.
  Commit: `Implement educational shorts search and API endpoint`

- [ ] **17. In-App Educational Reels Iframe Player**
  Becomes usable: Break hub tab that embeds curated educational shorts safely inside an iframe player.
  Why now: Keeps students learning without falling into YouTube rabbit holes.
  PRD ref: `prd.md > Iframe Player`
  Spec ref: `spec.md > Components > 7. Curated Educational Reels & Videos`
  Build: Create `ReelsTab.jsx` rendering safe embedded YouTube iframe player inside the break hub.
  Verify (mechanical): Open Reels tab in break hub and confirm video iframe loads correctly.
  Learner check: Watch a micro-learning educational short inside Bun Bun's safe break player.
  Commit: `Add safe in-app educational reels iframe player`

- [ ] **18. Mood-Based Ambient Audio Player**
  Becomes usable: Built-in React audio player with royalty-free ambient soundscapes (lofi beats, rain, café chatter) matched to user mood.
  Why now: Provides a soothing acoustic environment for studying.
  PRD ref: `prd.md > Ambient Audio`
  Spec ref: `spec.md > Components > 8. Mood-Based Background Music Integration`
  Build: Create `MusicPlayer.jsx` with HTML5 audio elements and mood track mapping.
  Verify (mechanical): Click play on ambient tracks and confirm HTML5 audio triggers playback.
  Learner check: Play lofi rain soundscapes and verify smooth audio playback in the background.
  Commit: `Build mood-based ambient audio player and soundscapes`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — App shell, launcher, and distraction guard active (Slices 1–6)
- [ ] Final kick-the-tires exploration and feedback completed (Slices 7–18)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route or focused alternative
- [ ] Optional edit and transfer reflection addressed
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: