import type { CSSProperties } from "react";

export type BunState = "idle" | "greeting" | "sleeping" | "happy";

interface BunBunProps {
  state?: BunState;
  /** Swap in your own art: pass a URL (png/webp/gif/svg) per state. */
  sprites?: Partial<Record<BunState, string>>;
  size?: number;
  className?: string;
}

/** Wrapper animation per state. Replace with your own sprite animations if you prefer. */
const wrapperAnim: Record<BunState, string> = {
  idle: "animate-float",
  greeting: "animate-hop",
  sleeping: "animate-breathe",
  happy: "animate-wiggle",
};

export default function BunBun({
  state = "idle",
  sprites,
  size = 220,
  className = "",
}: BunBunProps) {
  const style: CSSProperties = { width: size, height: size };
  const custom = sprites?.[state];

  return (
    <div className={`relative inline-block ${className}`} style={style}>
      <div className={`h-full w-full ${wrapperAnim[state]}`}>
        {custom ? (
          <img src={custom} alt="BunBun" className="h-full w-full object-contain" />
        ) : (
          <PlaceholderBun sleeping={state === "sleeping"} />
        )}
      </div>

      {state === "sleeping" && (
        <div className="pointer-events-none absolute -right-2 top-2 font-display text-2xl text-secondary">
          <span className="absolute animate-zzz">z</span>
          <span className="absolute animate-zzz [animation-delay:1s]">Z</span>
        </div>
      )}
    </div>
  );
}

/** Simple SVG bunny so the screen looks finished before your art is dropped in. */
function PlaceholderBun({ sleeping }: { sleeping: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="BunBun">
      {/* ears */}
      <g className="origin-bottom animate-ear" style={{ transformBox: "fill-box" }}>
        <ellipse cx="75" cy="45" rx="16" ry="38" fill="#FFFFFF" stroke="#E9CDB8" strokeWidth="3" />
        <ellipse cx="75" cy="48" rx="7" ry="26" fill="#F9C6D3" />
      </g>
      <g className="origin-bottom animate-ear [animation-delay:0.4s]" style={{ transformBox: "fill-box" }}>
        <ellipse cx="125" cy="45" rx="16" ry="38" fill="#FFFFFF" stroke="#E9CDB8" strokeWidth="3" />
        <ellipse cx="125" cy="48" rx="7" ry="26" fill="#F9C6D3" />
      </g>
      {/* body */}
      <ellipse cx="100" cy="148" rx="46" ry="38" fill="#FFFFFF" stroke="#E9CDB8" strokeWidth="3" />
      {/* head */}
      <ellipse cx="100" cy="100" rx="52" ry="44" fill="#FFFFFF" stroke="#E9CDB8" strokeWidth="3" />
      {/* cheeks */}
      <ellipse cx="68" cy="112" rx="10" ry="7" fill="#F9B4C4" opacity="0.7" />
      <ellipse cx="132" cy="112" rx="10" ry="7" fill="#F9B4C4" opacity="0.7" />
      {/* eyes */}
      {sleeping ? (
        <g stroke="#4B3A2E" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M72 100 q8 7 16 0" />
          <path d="M112 100 q8 7 16 0" />
        </g>
      ) : (
        <g fill="#4B3A2E">
          <ellipse cx="80" cy="100" rx="5" ry="6.5" className="origin-center animate-blink" style={{ transformBox: "fill-box" }} />
          <ellipse cx="120" cy="100" rx="5" ry="6.5" className="origin-center animate-blink" style={{ transformBox: "fill-box" }} />
        </g>
      )}
      {/* nose + mouth */}
      <ellipse cx="100" cy="112" rx="4" ry="3" fill="#F59AB0" />
      <path d="M100 115 v4 M100 119 q-5 5 -10 1 M100 119 q5 5 10 1" stroke="#4B3A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* tail hint */}
      <circle cx="148" cy="168" r="9" fill="#FFFFFF" stroke="#E9CDB8" strokeWidth="3" />
    </svg>
  );
}