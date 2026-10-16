import { useEffect, useState } from "react";
import BunBun, { type BunState } from "./components/BunBun";
import Header from "./components/Header";
import FocusTimer from "./components/FocusTimer";
import InboxDrawer from "./components/InboxDrawer";
import QuizModal from "./components/QuizModal";

type Mood = { id: string; emoji: string; label: string; reply: string };

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
  const [mode, setMode] = useState<"voice" | "text">("text");
  const [music, setMusic] = useState(false);
  const [focusing, setFocusing] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Transition from greeting hop to idle
  useEffect(() => {
    const t = setTimeout(() => setBun("idle"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Poll inbox item count for trigger badge
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

  const bubble = focusing
    ? "Shh... I'm napping beside you. Roll those shoulders when you can 💤"
    : mood
      ? mood.reply
      : `${greeting(new Date().getHours())}! How are you feeling today?`;

  return (
    <div data-theme="bunbun" className="drawer drawer-end min-h-screen bg-base-100">
      <input id="inbox-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Viewport Container */}
      <div className="drawer-content flex flex-col min-h-screen cozy-bg">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-5 py-6 w-full">
          
          {/* Top Header Section */}
          <Header
            inboxCount={inboxCount}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />

          {/* Companion Stage */}
          <section className="cozy-card relative flex flex-1 flex-col items-center justify-center gap-4 px-6 py-6">
            <div key={bubble} className="chat chat-start animate-pop self-stretch">
              <div className="chat-bubble chat-bubble-primary max-w-md text-sm font-semibold">
                {bubble}
              </div>
            </div>

            <div className="relative mt-2">
              <BunBun state={bun} size={220} />
              <div className="mx-auto -mt-4 h-4 w-44 rounded-full bg-secondary/40 blur-[1px]" />
            </div>

            {/* Mood Selector */}
            {!focusing && (
              <div className="flex flex-wrap justify-center gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => pickMood(m)}
                    className={`btn btn-xs ${mood?.id === m.id ? "btn-primary" : "btn-outline btn-primary"}`}
                  >
                    <span aria-hidden>{m.emoji}</span> {m.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Quick Settings & Controls */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="cozy-card flex items-center justify-between p-4">
              <div>
                <p className="font-display text-base font-bold">Talk Mode</p>
                <p className="text-xs opacity-70">
                  {mode === "voice" ? "BunBun is listening" : "Quiet text mode"}
                </p>
              </div>
              <div role="tablist" className="tabs tabs-boxed bg-base-200">
                <button
                  role="tab"
                  className={`tab tab-xs ${mode === "voice" ? "tab-active bg-primary!" : ""}`}
                  onClick={() => setMode("voice")}
                >
                  🎙️ Voice
                </button>
                <button
                  role="tab"
                  className={`tab tab-xs ${mode === "text" ? "tab-active bg-primary!" : ""}`}
                  onClick={() => setMode("text")}
                >
                  💬 Text
                </button>
              </div>
            </div>

            <div className="cozy-card flex items-center justify-between p-4">
              <div>
                <p className="font-display text-base font-bold">Ambient Sound</p>
                <p className="text-xs opacity-70">{music ? "Lo-fi rain & piano" : "Off"}</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-secondary toggle-md"
                checked={music}
                onChange={(e) => setMusic(e.target.checked)}
              />
            </div>
          </section>

          {/* Pomodoro Focus Timer Section */}
          <FocusTimer
            onSessionStateChange={(isFocusing) => {
              setFocusing(isFocusing);
              setBun(isFocusing ? "sleeping" : "idle");
            }}
            onTakeBreak={() => {
              setBun("happy");
            }}
          />
        </div>
      </div>

      {/* Slide-out Drawers & Modals */}
      <InboxDrawer />
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}