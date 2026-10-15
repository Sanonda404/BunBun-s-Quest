import { useState, useEffect } from "react";

type FocusTimerProps = {
  onSessionStateChange: (isFocusing: boolean) => void;
  onTakeBreak: () => void;
};

export default function FocusTimer({ onSessionStateChange, onTakeBreak }: FocusTimerProps) {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Sync initial state when workMinutes changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(workMinutes * 60);
    }
  }, [workMinutes]);

  // Main countdown ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onSessionStateChange(false);
      setCompletedSessions((prev) => prev + 1);
      onTakeBreak();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onSessionStateChange, onTakeBreak]);

  const toggleTimer = () => {
    const nextRunningState = !isRunning;
    setIsRunning(nextRunningState);
    onSessionStateChange(nextRunningState);
  };

  const resetTimer = () => {
    setIsRunning(false);
    onSessionStateChange(false);
    setTimeLeft(workMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((workMinutes * 60 - timeLeft) / (workMinutes * 60)) * 100;

  return (
    <div className="cozy-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-display text-lg font-bold text-primary-content">
            ⏱️ Focus Timer
          </p>
          <span className="badge badge-sm badge-warning font-bold">
            {completedSessions} Sessions Completed
          </span>
        </div>
        <p className="text-xs opacity-70">
          {isRunning
            ? "Bun Bun is keeping you focused. Distractions go straight to your Inbox!"
            : "Set your session duration and dive into deep study."}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Timer display badge */}
        <div className="flex flex-col items-center">
          <span className="font-display text-2xl font-bold tracking-wider text-primary-content">
            {formatTime(timeLeft)}
          </span>
          {/* Progress mini-bar */}
          <div className="w-24 bg-base-300 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Duration preset selector */}
        {!isRunning && (
          <select
            value={workMinutes}
            onChange={(e) => setWorkMinutes(Number(e.target.value))}
            className="select select-xs select-bordered rounded-xl text-xs"
          >
            <option value={15}>15m</option>
            <option value={25}>25m</option>
            <option value={45}>45m</option>
            <option value={60}>60m</option>
          </select>
        )}

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className={`btn btn-sm ${isRunning ? "btn-warning text-warning-content" : "btn-primary"} rounded-full font-bold`}
          >
            {isRunning ? "⏸ Pause" : "▶ Start"}
          </button>
          
          {isRunning && (
            <button
              onClick={resetTimer}
              className="btn btn-sm btn-ghost text-error rounded-full"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}