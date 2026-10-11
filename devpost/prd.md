---
doc: prd
status: approved
---

# CozyStudy Companion (StudyBuddy) — Product Requirements

A cozy desktop and web-extension companion application featuring interactive voice/text communication, mood-adapted check-ins, smart AI-driven distraction filtering, session task planning, curated educational micro-breaks, and gamified rewards for students and self-learners.
Source: `scope.md > CozyStudy Companion`

## The Core Journey
1. **Arrival & Mood Check-in:** The user opens the app and is greeted by an animated kawaii animal companion with a voice/text greeting. The companion checks on their mood, energy level, and day to subtly tailor the study session.
2. **Planning & Setup:** The companion prompts the user to set today's study plan and task checklist, choose an active study topic, toggle between voice or silent text mode depending on their environment, and optionally play background music.
3. **Focused Studying & Guardrails:** The companion enters a peaceful sleeping state, occasionally offering gentle wellness whispers (like shoulder stretches). The browser extension monitors browsing and YouTube titles in real time. If an irrelevant distraction is hit, the app opens with a "Look At Later" prompt instead of a hard block.
4. **Cozy Breaks:** When the user requests a break, the companion checks in, allows custom break durations with gentle reality checks for very long breaks, and offers curated educational reels, mini-games, or the "Look At Later" inbox.
5. **Session Wrap-up & Rewards:** The user signals they are finished. The app reviews completed task checklists, offers an AI-generated study quiz from uploaded notes, and awards streaks, Cozy Gold points, and companion cosmetic unlocks.

## Screens and Layout
- **Dashboard / Home Screen:** Main cozy workspace featuring the animated animal companion, input mode toggle (Voice/Text), background music controls, and the active session status.
- **Task Planning Modal / View:** Clean checklist interface to outline study goals at the start of the session.
- **Break Menu Overlay:** A friendly hub offering access to educational micro-videos, mini-games, and the "Look At Later" inbox.
- **Session Wrap-up & Quiz View:** Note-upload interface, interactive review quiz, and reward summary display.

## Look and Feel
- **Aesthetic:** Cozy, warm, friendly, and supportive (avoiding clinical or harsh productivity styling).
- **Vibe:** Soft pastel palettes, rounded UI cards, gentle typography, and playful animations (flying, sleeping, greeting).

## Features and Behavior

### AI Companion, Voice/Text Toggle & Wellness Whispers
- Supports both voice (STT/TTS) and text interaction, with an instant toggle for quiet environments like libraries.
- Mood-adapted check-in at startup to calibrate study pacing.
- Gentle background whispers from the sleeping companion during long focus blocks (e.g., reminding the user to stretch).

### Smart Distraction Filter & "Look At Later" Inbox
- Web extension evaluates active search queries and YouTube video titles against the active study topic using backend AI.
- Irrelevant content triggers a gentle modal offering to save the item to a "Look At Later" inbox for break time.

### Session Task Planner
- Allows users to input a checklist of goals at the start of the session.
- Tracks execution and reviews planned vs. completed tasks at wrap-up.

### Customizable Breaks & Educational Feed
- Users select break duration with a gentle reality check prompt if an unusually long duration (e.g., 2+ hours) is selected.
- Provides interest-matched educational reels/videos and mini-games.

### Gamified Wrap-up & Rewards
- AI-generated review quiz based on uploaded notes or study slides.
- **Streak & Gold Reward System:** Awards consecutive study day streaks and "Cozy Gold" currency for completed tasks and passed quizzes.
- **Companion Unlocks:** Earned gold can be spent to unlock cute cosmetic accessories and alternative animal friends for the dashboard companion.

## States and Boundaries
- **First Use / Arrival:** Welcomes the user warmly and prompts for mood, energy level, and study goals.
- **Focus State:** Companion goes into a quiet sleeping animation while the background extension guards against distractions.
- **Break State:** Pauses study timers and opens the cozy break hub.
- **Persistence:** Local session data and task lists persist during the active study day.

## Product Decisions
- **Graceful Redirection over Hard Blocks:** Using a "Look At Later" inbox rather than locking out the user entirely to maintain a low-stress, supportive environment.
- **Autonomous Break Duration with Nudges:** Allowing user control over break length while providing friendly caution for overly long breaks.

## What We're Building
- Cozy dashboard UI with companion animations, mood check-in, and voice/text toggle.
- Task checklist planner and session summary.
- FastAPI backend with LLM-powered search and video title relevance checking.
- Companion browser extension communicating with the backend.
- Customizable break hub with educational reels and "Look At Later" inbox.
- AI quiz generator and gold/streak reward tracking.

## Deferred From the POC
- Cloud database user accounts and cross-device sync (relying on local storage/mock state).
- Expansive marketplace of mini-games (curating a core set for the PoC).

## Non-Goals
- Full system-level native OS app blocking (relying on browser extension monitoring).
- Clinical or strict enterprise time-tracking analytics.

## Open Questions
- None. All core product mechanics and boundaries are locked in.