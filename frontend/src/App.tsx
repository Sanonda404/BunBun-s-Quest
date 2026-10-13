import { useEffect, useState } from "react";
import BunBun, { type BunState } from "../components/BunBun";
import InboxDrawer from "../components/InboxDrawer";

type Mood = { id: string; emoji: string; label: string; reply: string };
type InputMode = "voice" | "text";

const MOODS: Mood[] = [
  { id: "glowing", emoji: "🌸", label: "Glowing", reply: "Yay! Let's make the most of that sparkle today~" },
  { id: "okay", emoji: "🍵", label: "Okay", reply: "Cozy and steady. We'll take it one little hop at a time." },
  { id: "sleepy", emoji: "🌙", label: "Sleepy", reply: "Sleepy is okay. Short sessions and soft breaks today?" },
  { id: "stressed", emoji: "🌧️", label: "Stressed", reply: "Thanks for telling me. We'll go gently, I'm right here." },
];

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const [bun, setBun] = useState<BunState>("greeting");
  const [mood, setMood] = useState<Mood | null>(null);
  const [mode, setMode] = useState<InputMode>("text");
  const [music, setMusic] = useState(false);
  const [focusing, setFocusing] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);

  // After the hello hop, settle into idle.
  useEffect(() => {
    const t = setTimeout(() => setBun("idle"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Fetch inbox count for badge
  useEffect(() => {
    const fetchInboxCount = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/inbox");
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.inbox || [];
        setInboxCount(items.length);
      } catch (err) {
        console.error("Failed to fetch inbox count:", err);
      }
    };
    fetchInboxCount();
    const interval = setInterval(fetchInboxCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const pickMood = (m: Mood) => {
    setMood(m);
    setBun("happy");
    setTimeout(() => setBun(focusing ? "sleeping" : "idle"), 1900);
  };

  const toggleFocus = () => {
    const next = !focusing;
    setFocusing(next);
    setBun(next ? "sleeping" : "idle");
  };

  const bubble = focusing
    ? "Shh... I'm napping beside you. Roll those shoulders when you can 💤"
    : mood
      ? mood.reply
      : `${greeting(new Date().getHours())}! How are you feeling today?`;

  return (
    <div data-theme="bunbun" className="drawer drawer-end min-h-screen bg-base-100">
      {/* Hidden checkbox controlling DaisyUI Drawer */}
      <input id="inbox-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Screen Content */}
      <div className="drawer-content flex flex-col min-h-screen cozy-bg">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-5 py-6 w-full">
          {/* Top bar */}
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-primary-content">
              BunBun&apos;s <span className="text-neutral">Quest</span>
            </h1>
            <div className="flex gap-2 items-center">
              <div className="badge badge-lg gap-1 border-2 border-warning bg-warning/40 font-semibold">
                🪙 120
              </div>
              <div className="badge badge-lg gap-1 border-2 border-primary bg-primary/30 font-semibold">
                🔥 4 days
              </div>
              {/* Inbox Trigger Badge */}
              <label htmlFor="inbox-drawer" className="btn btn-sm btn-secondary rounded-full gap-1 ml-1 cursor-pointer shadow-xs font-semibold">
                📥 Inbox <span className="badge badge-xs badge-primary font-bold">{inboxCount}</span>
              </label>
            </div>
          </header>

          {/* Companion stage */}
          <section className="cozy-card relative flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8">
            <div key={bubble} className="chat chat-start animate-pop self-stretch">
              <div className="chat-bubble chat-bubble-primary max-w-md text-base font-semibold">
                {bubble}
              </div>
            </div>

            <div className="relative mt-2">
              <BunBun state={bun} size={230} />
              {/* cushion */}
              <div className="mx-auto -mt-4 h-5 w-48 rounded-full bg-secondary/40 blur-[1px]" />
            </div>

            {/* Mood check-in */}
            {!focusing && (
              <div className="flex flex-wrap justify-center gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => pickMood(m)}
                    className={`btn btn-sm ${mood?.id === m.id ? "btn-primary" : "btn-outline btn-primary"}`}
                  >
                    <span aria-hidden>{m.emoji}</span> {m.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Controls */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="cozy-card flex items-center justify-between p-4">
              <div>
                <p className="font-display text-lg">Talk mode</p>
                <p className="text-sm opacity-70">
                  {mode === "voice" ? "BunBun is listening" : "Quiet text mode"}
                </p>
              </div>
              <div role="tablist" className="tabs tabs-boxed bg-base-200">
                <button
                  role="tab"
                  className={`tab ${mode === "voice" ? "tab-active !bg-primary" : ""}`}
                  onClick={() => setMode("voice")}
                >
                  🎙️ Voice
                </button>
                <button
                  role="tab"
                  className={`tab ${mode === "text" ? "tab-active !bg-primary" : ""}`}
                  onClick={() => setMode("text")}
                >
                  💬 Text
                </button>
              </div>
            </div>

            <div className="cozy-card flex items-center justify-between p-4">
              <div>
                <p className="font-display text-lg">Cozy music</p>
                <p className="text-sm opacity-70">{music ? "Lo-fi rain & piano" : "Off"}</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-secondary toggle-lg"
                checked={music}
                onChange={(e) => setMusic(e.target.checked)}
                aria-label="Toggle background music"
              />
            </div>
          </section>

          {/* Session */}
          <section className="cozy-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg">
                {focusing ? "Focus session in progress" : "Ready when you are"}
              </p>
              <p className="text-sm opacity-70">
                {focusing
                  ? "BunBun is guarding your focus. Distractions go to Look At Later."
                  : "Plan today's goals, then settle in."}
              </p>
            </div>
            <div className="flex gap-2">
              {!focusing && <button className="btn btn-outline btn-secondary">📝 Plan tasks</button>}
              {focusing && <button className="btn btn-accent">🍡 Take a break</button>}
              <button className="btn btn-primary" onClick={toggleFocus}>
                {focusing ? "Finish session" : "Start studying"}
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Slide-out Inbox Drawer Sidebar Component */}
      <InboxDrawer />
    </div>
  );
}