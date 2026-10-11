---
doc: spec
status: approved
---

# Technical Specification: CozyStudy Companion

## Architecture Overview
CozyStudy Companion is structured as a modular system consisting of a desktop app launcher shell, a local FastAPI backend core, a React frontend dashboard with Tailwind CSS and DaisyUI, a Manifest V3 Chrome extension for distraction guarding, and a local vector search RAG pipeline for study notes analysis.

---

## Components

### 1. Desktop App Launcher (`start_cozystudy.bat` / Shell Script)
* Acts as the desktop app entry point.
* Boots the FastAPI backend server (`uvicorn main:app --reload`) in a background terminal.
* Opens the React frontend dashboard in a standalone browser window using the `--app` flag (e.g., `chrome --app=http://localhost:5173`) to provide a native app feel.

### 2. FastAPI Backend Core (`/backend`)
* Built with Python and FastAPI.
* Handles API endpoints for session management, study task tracking, mood logging, RAG quiz generation, and AI relevance checking.
* Includes a `/health` endpoint for instant status checks by the frontend and browser extension.
* Houses local storage / JSON state handling for sessions and distraction logs.

### 3. React Frontend Dashboard (`/frontend`)
* Built with React, Vite, Tailwind CSS, and DaisyUI.
* Implements a warm pastel UI theme with window controls.
* Houses the interactive companion (animal sprite with sleep/idle/cheer states), mood check-in modal, task checklist, break hub, RAG quiz interface, music player, and reward store.

### 4. Chrome Extension Distraction Guard (`/extension`)
* Built as a Manifest V3 browser extension.
* Background script (`background.js`) listens to active tab navigation (`chrome.tabs.onUpdated`), full URLs, domain names, search engine queries, and YouTube video titles.
* Communicates via `fetch` with FastAPI to evaluate distraction relevance.
* Whitelists audio and music platforms (e.g., Spotify web player, YouTube music streams) so they are never flagged.
* Gracefully intercepts non-study tabs with a gentle "Look At Later" save prompt instead of a hard block.

### 5. RAG Quiz Pipeline & Study Notes Analyzer (`/backend/rag_engine.py`)
* Ingests uploaded text, markdown, or PDF notes.
* Uses local vector search via **ChromaDB** or **FAISS** to chunk text and index core concepts.
* Prompts the LLM with retrieved context chunks to generate structured JSON-based Multiple Choice Questions (MCQs).
* Tracks correct/incorrect answers and saves weak spots into a review bank for exam prep.

### 6. Break Hub & Mini-Games (`/frontend/src/components/BreakHub.jsx`)
* Activated when the user requests a break; features customizable timers with friendly sanity-check nudges for overly long breaks.
* Displays the "Look At Later" inbox containing saved links and videos.
* Hosts lightweight JavaScript mini-games (e.g., a cozy breathing or clicking game) with an extension slot for future Godot HTML5 web exports.

### 7. Curated Educational Reels & Videos
* Integrated inside the break hub via a secure embedded iframe player.
* Fetches topic-matched micro-learning reels and short educational videos via the YouTube search engine integration, keeping breaks productive yet relaxing.

### 8. Mood-Based Background Music Integration
* Features a built-in React ambient audio player with royalty-free soundscapes (lofi beats, rain, café ambience) matched to user mood preferences.
* Open support for external music apps (Spotify, YouTube Music) without extension interference.

---

## Data Model
* **Session State:** `{ session_id, start_time, topic, mood, active_tasks, study_duration }`
* **Distraction Log:** `{ url, title, search_query, timestamp, saved_to_inbox }`
* **Quiz Question:** `{ question_id, prompt, options[], correct_index, explanation }`
* **Review Item:** `{ item_id, question_text, user_answer, correct_answer, status }`

---

## External Services & APIs
* **LLM API:** Used by the FastAPI backend for RAG-based MCQ generation, study note chunk evaluation, and browser activity relevance checking.
* **YouTube Search / API:** Used by the backend to fetch concise micro-learning videos and educational shorts for break time.

---

## Failure Modes & Recovery
* **Backend Unreachable:** Frontend and extension display a gentle connection banner ("Waking up your study buddy...") and retry connection automatically via the `/health` endpoint.
* **API Token Limit / Rate Limit:** Fallback to direct context window chunking if vector search fails or chunk size exceeds normal thresholds.
* **Extension Sync Lag:** Local storage caching in the extension background script ensures offline queuing before syncing to FastAPI.