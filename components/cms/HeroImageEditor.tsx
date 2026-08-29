"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function HeroImageEditor({ initialImage }: { initialImage: string }) {
  const [heroImage, setHeroImage] = useState(initialImage);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setSuccess(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setSuccess(false);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/hero", { method: "PUT", body: fd });
    if (res.ok) {
      const { heroImage: url } = await res.json();
      setHeroImage(url);
      setPreview(null);
      setFile(null);
      setSuccess(true);
    }
    setLoading(false);
  }

  const displaySrc = preview || heroImage;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-lg font-bold text-white">Hero Image</h2>
          <p className="font-mono text-xs text-white/30 mt-1">
            This image appears at the top of the main portfolio page.
          </p>
        </div>
        {file && (
          <button
            id="hero-upload-btn"
            onClick={handleUpload}
            disabled={loading}
            className="bg-white text-black font-mono font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all disabled:opacity-40"
          >
            {loading ? "Saving…" : "Save Image"}
          </button>
        )}
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 font-mono text-xs text-green-400">
          ✓ Hero image updated successfully.
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
          dragging
            ? "border-white/40 bg-white/[0.06]"
            : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.03]"
        }`}
        style={{ aspectRatio: "16/7" }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {displaySrc ? (
          <Image
            src={displaySrc}
            alt="Hero image"
            fill
            className="object-cover"
            unoptimized={displaySrc.startsWith("blob:")}
          />
        ) : null}

        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity ${displaySrc ? "opacity-0 hover:opacity-100" : "opacity-100"} bg-black/50`}>
          <span className="text-3xl">🖼️</span>
          <p className="font-mono text-xs text-white/60 text-center px-8">
            {displaySrc ? "Click or drag to replace image" : "Click or drag to upload hero image"}
          </p>
          <p className="font-mono text-[10px] text-white/30">PNG, JPG, WebP — any size</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {heroImage && !preview && (
        <p className="font-mono text-[10px] text-white/25 truncate">
          Current: {heroImage}
        </p>
      )}
    </div>
  );
}
