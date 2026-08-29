"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/cms-data";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, " +
  "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
  "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse " +
  "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat " +
  "non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const GALLERY_COUNT = 5;

// ---------------------------------------------------------------------------
// Horizontal drag-scroll gallery
// ---------------------------------------------------------------------------

function DragGallery({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = ref.current.scrollLeft;
    ref.current.setPointerCapture(e.pointerId);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !ref.current) return;
    const delta = startX.current - e.clientX;
    ref.current.scrollLeft = scrollStart.current + delta;
  }

  function onPointerUp() {
    isDragging.current = false;
    if (ref.current) {
      ref.current.style.cursor = "grab";
      ref.current.style.userSelect = "";
    }
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 450ms ease-out, transform 450ms ease-out",
      }}
    >
      {/* Section label */}
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-4">
        Gallery
      </p>

      {/* Scrollable track */}
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
        style={{
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label="Project gallery"
      >
        {Array.from({ length: GALLERY_COUNT }).map((_, i) => (
          <div
            key={i}
            className="snap-start shrink-0 bg-gray-100 border border-gray-200 overflow-hidden"
            style={{
              width: "clamp(280px, 62vw, 700px)",
              aspectRatio: "16 / 10",
            }}
          >
            {/* placeholder — real images slot in here */}
            <div className="w-full h-full flex items-end p-4">
              <span className="font-mono text-[10px] text-gray-300 uppercase tracking-widest">
                Image {i + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Focus trap hook
// ---------------------------------------------------------------------------

function useFocusTrap(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    // Autofocus first focusable element (close button)
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (nodes.length === 0) { e.preventDefault(); return; }

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref]);
}

// ---------------------------------------------------------------------------
// Main overlay
// ---------------------------------------------------------------------------

export interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  // ── Animation state ──────────────────────────────────────────────────────
  const [bgVisible, setBgVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [descVisible, setDescVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // ── Focus trap ───────────────────────────────────────────────────────────
  useFocusTrap(overlayRef);

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Staggered entrance ───────────────────────────────────────────────────
  useEffect(() => {
    // bg first — immediate
    const t0 = requestAnimationFrame(() => setBgVisible(true));
    // hero after 1 frame
    const t1 = setTimeout(() => setHeroVisible(true), 80);
    // description
    const t2 = setTimeout(() => setDescVisible(true), 280);
    // gallery
    const t3 = setTimeout(() => setGalleryVisible(true), 420);

    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animated close ────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setGalleryVisible(false);
    setDescVisible(false);
    setHeroVisible(false);
    setTimeout(() => setBgVisible(false), 60);
    setTimeout(onClose, 380); // wait for bg fade-out
  }, [isClosing, onClose]);

  // ── Backdrop click (only when click is exactly on backdrop) ───────────────
  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) handleClose();
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Project: ${project.title}`}
      className="fixed inset-0 z-50"
      style={{
        opacity: bgVisible ? 1 : 0,
        transition: "opacity 320ms ease-out",
      }}
    >
      {/* ── Overlay background ── */}
      <div className="absolute inset-0 bg-white" />

      {/* ── Scrollable content area (backdrop-click to close) ── */}
      <div
        ref={scrollAreaRef}
        className="relative h-full overflow-y-auto overscroll-contain"
        onClick={onBackdropClick}
      >
        {/* ── Close button ── */}
        <button
          id="project-overlay-close"
          onClick={handleClose}
          aria-label="Close project overlay"
          className="fixed top-5 right-5 md:top-8 md:right-8 z-20 w-11 h-11 flex items-center justify-center font-mono text-base text-black hover:opacity-40 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-black"
        >
          ✕
        </button>

        {/* ── Inner content (not a backdrop-click target) ── */}
        <div
          className="px-5 pt-14 pb-20 md:px-12 md:pt-16 max-w-[1400px] mx-auto"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Project meta — animates with hero ── */}
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 420ms ease-out, transform 420ms ease-out",
            }}
            className="mb-6 md:mb-8"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
              {project.location}
            </p>
            <h2 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight">
              {project.title}
            </h2>
          </div>

          {/* ── Hero image — animates first ── */}
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible
                ? "translateY(0) scale(1)"
                : "translateY(28px) scale(0.97)",
              transition:
                "opacity 480ms ease-out, transform 480ms ease-out",
              aspectRatio: "16 / 9",
            }}
            className="relative w-full bg-gray-100 overflow-hidden"
          >
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              /* Gray placeholder */
              <div className="absolute inset-0 bg-gray-100 flex items-end p-6">
                <span className="font-mono text-xs text-gray-300 uppercase tracking-widest">
                  {project.title}
                </span>
              </div>
            )}
          </div>

          {/* ── Description — staggered after hero ── */}
          <div
            style={{
              opacity: descVisible ? 1 : 0,
              transform: descVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 420ms ease-out, transform 420ms ease-out",
            }}
            className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12"
          >
            {/* Left col: meta */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                  Project
                </p>
                <p className="font-mono text-sm font-bold">{project.title}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                  Location
                </p>
                <p className="font-mono text-sm">{project.location || "—"}</p>
              </div>
              {project.featured && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                    Status
                  </p>
                  <p className="font-mono text-sm">Featured</p>
                </div>
              )}
            </div>

            {/* Right col: description */}
            <div>
              <p className="font-mono text-sm text-gray-600 leading-relaxed">
                {project.description || LOREM}
              </p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              opacity: galleryVisible ? 1 : 0,
              transition: "opacity 350ms ease-out",
            }}
            className="my-10 md:my-14 border-t border-gray-100"
          />

          {/* ── Horizontal gallery ── */}
          <DragGallery visible={galleryVisible} />

        </div>
      </div>
    </div>
  );
}
