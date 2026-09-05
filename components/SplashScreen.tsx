"use client";

import { useEffect, useRef, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"words" | "divider" | "hold" | "wipe" | "done">("words");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setVisible(true);

    // Phase timeline
    // 0ms    → words slide in (CSS handles the 1.1s animation)
    // 1200ms → divider grows in
    // 1800ms → hold (divider fully visible)
    // 3300ms → wipe up
    // 4000ms → unmount

    const t1 = setTimeout(() => setPhase("divider"), 1200);
    const t2 = setTimeout(() => setPhase("hold"), 1800);
    const t3 = setTimeout(() => setPhase("wipe"), 3300);
    const t4 = setTimeout(() => { setPhase("done"); setVisible(false); }, 4000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0e0e0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: phase === "wipe" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "wipe"
          ? "transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
        willChange: "transform",
      }}
    >
      {/* Words row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {/* LEFT — END Design */}
        <span
          style={{
            fontFamily: "var(--font-roboto), 'Roboto', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 7vw, 6rem)",
            color: "#fff",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            paddingRight: "clamp(0.6rem, 2vw, 2rem)",
            display: "block",
            transform: phase === "words" ? "translateX(0)" : undefined,
            animation: "slideInLeft 1.1s cubic-bezier(.16,.84,.44,1) forwards",
            willChange: "transform",
          }}
        >
          END Design
        </span>

        {/* DIVIDER */}
        <span
          style={{
            display: "block",
            width: "1px",
            backgroundColor: "#fff",
            alignSelf: "stretch",
            transformOrigin: "top center",
            transform: phase === "divider" || phase === "hold" || phase === "wipe"
              ? "scaleY(1)"
              : "scaleY(0)",
            transition:
              phase === "divider"
                ? "transform 0.45s cubic-bezier(.16,.84,.44,1)"
                : "none",
            opacity:
              phase === "divider" || phase === "hold" || phase === "wipe" ? 1 : 0,
            willChange: "transform, opacity",
            minHeight: "1em",
          }}
        />

        {/* RIGHT — Mutam */}
        <span
          style={{
            fontFamily: "var(--font-roboto), 'Roboto', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 7vw, 6rem)",
            color: "#fff",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            paddingLeft: "clamp(0.6rem, 2vw, 2rem)",
            display: "block",
            animation: "slideInRight 1.1s cubic-bezier(.16,.84,.44,1) forwards",
            willChange: "transform",
          }}
        >
          Muttam
        </span>
      </div>

      {/* Keyframes injected via a style tag */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(calc(-50vw - 100%)); opacity: 0; }
          20%  { opacity: 1; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(calc(50vw + 100%)); opacity: 0; }
          20%  { opacity: 1; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
