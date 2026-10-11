---
doc: scope
status: approved
---

# CozyStudy Companion (StudyBuddy)

A cozy desktop and web-extension companion application featuring interactive voice communication, smart AI-driven distraction filtering, interest-aligned educational micro-breaks, session task planning, and gamified rewards to keep students motivated.

## The Unique Kernel
An AI-driven context filter (via a companion web extension and LLM backend) that evaluates active search queries and video titles in real time to allow study-relevant research while instantly blocking irrelevant distractions, paired with voice interaction, study task planning, and gamified rewards.

## Who It's For
Students and self-learners who want a warm, friendly study environment, struggle with getting distracted by random web scrolling, and want an engaging companion to keep them accountable and organized.

## The Core Loop
1. **Check-in, Study Planning & Setup:** Open the app, get a warm voice greeting from an adorable animated animal character, set up today's **study plan and actionable task checklist**, set the active study topic, and set the mood with cozy background music.
2. **Focused Studying & Grace Periods:** Study with an intelligent browser extension. If a distraction site is hit, use a "Cozy Pause" grace period to log a structured break rather than hitting a hard wall.
3. **Cozy Voice Breaks:** When taking a break, choose a duration (with gentle reality checks for very long breaks) and enjoy curated educational short reels or light mini-games matching your interests.
4. **Session Wrap-up, Task Review & Rewards:** Upload notes or slides to generate a playful review quiz, review planned vs. executed tasks, and earn **streaks, gold rewards, and companion unlocks** upon completion.

## Inspiration & Identity
- **Aesthetic:** Cozy, warm, friendly, and supportive (feels like a friendly companion, not a strict tutor or clinical app).
- **Vibe:** Encouraging, relaxing, interactive, gamified, and voice-enabled.

## Why This Matters to the Learner
Provides a practical, multi-week project to learn full-stack development, browser extension architecture, AI API integration (including text-to-speech/speech-to-text or voice pipelines), and effective collaboration with AI coding agents.

## What "Working" Looks Like
A fully integrated system consisting of a cozy dashboard app with voice support and task planning, a functional browser extension communicating with the backend, real-time AI relevance checking for browsing, an educational feed, and an AI quiz generator with streaks and gold rewards.

## The POC / MVP Boundary
- Cozy dashboard UI shell with animal companion voice greetings, **session study plan/task checklist**, and music player.
- FastAPI backend integrated with an LLM API to evaluate search/video relevance.
- Companion web extension that hooks into browser navigation/YouTube titles and checks them against the backend.
- Voice-enabled interaction loop.
- Curated educational video/reels tab with customizable break durations.
- Study note upload, AI quiz generation interface, **planned vs. executed task review summary, and streak/gold reward tracking**.

## Later
- Advanced user accounts, cloud sync, and historical study analytics.
- Expanded mini-game library and custom cosmetic item unlocks for the animal companion using earned gold.

## Explicitly Cut
- Heavy native desktop window managers (relying on a clean web app + extension architecture instead).