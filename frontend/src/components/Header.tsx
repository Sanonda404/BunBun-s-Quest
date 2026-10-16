import { useState, useEffect } from "react";

type HeaderProps = {
  inboxCount: number;
  onOpenQuiz: () => void;
};

export default function Header({ inboxCount, onOpenQuiz }: HeaderProps) {
  const [activeTopic, setActiveTopic] = useState("Computer Science & Engineering");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTopic, setTempTopic] = useState(activeTopic);

  useEffect(() => {
    fetch("http://localhost:8000/api/session/active-topic")
      .then((res) => res.json())
      .then((data) => {
        if (data.active_topic) {
          setActiveTopic(data.active_topic);
          setTempTopic(data.active_topic);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveTopic = async () => {
    try {
      await fetch("http://localhost:8000/api/session/active-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: tempTopic }),
      });
      setActiveTopic(tempTopic);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to set topic", err);
    }
  };

  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-content">
          BunBun&apos;s <span className="text-neutral">Quest</span>
        </h1>
        <div className="flex gap-2 items-center">
          <div className="badge badge-lg gap-1 border-2 border-warning bg-warning/40 font-semibold">
            🪙 120
          </div>
          <button
            onClick={onOpenQuiz}
            className="btn btn-sm btn-outline btn-primary rounded-full font-semibold"
          >
            🧠 Knowledge Vault
          </button>
          <label
            htmlFor="inbox-drawer"
            className="btn btn-sm btn-secondary rounded-full gap-1 cursor-pointer shadow-xs font-semibold"
          >
            📥 Inbox <span className="badge badge-xs badge-primary font-bold">{inboxCount}</span>
          </label>
        </div>
      </div>

      {/* Active Study Topic Bar */}
      <div className="cozy-card flex items-center justify-between p-3 bg-base-200/50">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <div>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-wide">Current Topic</p>
            {isEditing ? (
              <div className="flex gap-2 mt-1 items-center">
                <input
                  type="text"
                  value={tempTopic}
                  onChange={(e) => setTempTopic(e.target.value)}
                  className="input input-xs input-bordered rounded-lg text-xs"
                />
                <button onClick={handleSaveTopic} className="btn btn-xs btn-primary rounded-md">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="btn btn-xs btn-ghost rounded-md">
                  Cancel
                </button>
              </div>
            ) : (
              <p className="font-display text-xs font-bold text-primary-content">{activeTopic}</p>
            )}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-xs btn-ghost text-primary text-xs"
          >
            Change ✏️
          </button>
        )}
      </div>
    </header>
  );
}