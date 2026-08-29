"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Project } from "@/lib/cms-data";

type EditingProject = Omit<Project, "id"> & { id?: string };

const EMPTY: EditingProject = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  iconUrl: "",
  featured: false,
};

function ImagePicker({
  label,
  current,
  onFile,
}: {
  label: string;
  current: string;
  onFile: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    onFile(f);
    setPreview(URL.createObjectURL(f));
  }

  const src = preview || current;

  return (
    <div
      onClick={() => ref.current?.click()}
      className="cursor-pointer rounded-lg border-2 border-dashed border-white/[0.1] hover:border-white/25 transition-all flex items-center justify-center overflow-hidden bg-white/[0.03]"
      style={{ width: 80, height: 60 }}
    >
      {src ? (
        <Image src={src} alt={label} width={80} height={60} className="w-full h-full object-cover" unoptimized={src.startsWith("blob:")} />
      ) : (
        <span className="text-white/20 text-xs font-mono text-center px-1">{label}</span>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

function ProjectRow({
  project,
  onDelete,
  onSave,
}: {
  project: Project;
  onDelete: () => void;
  onSave: (p: Project, imageFile?: File, iconFile?: File) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditingProject>({ ...project });
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [iconFile, setIconFile] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({ ...form, id: project.id } as Project, imageFile, iconFile);
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    onDelete();
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden transition-all hover:border-white/[0.12]">
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
          {project.iconUrl ? (
            <Image src={project.iconUrl} alt="icon" width={40} height={40} className="object-cover w-full h-full" />
          ) : (
            <span className="text-white/20 text-xs">🏗</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm font-bold text-white truncate">{project.title || "Untitled"}</p>
          <p className="font-mono text-xs text-white/30 truncate">{project.location}</p>
        </div>
        {project.featured && (
          <span className="font-mono text-[10px] uppercase tracking-widest bg-white/10 text-white/60 px-2 py-1 rounded">
            Featured
          </span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="font-mono text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-xs text-red-400/50 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-30"
          >
            {deleting ? "…" : "Delete"}
          </button>
        </div>
      </div>

      {/* Edit Panel */}
      {editing && (
        <div className="border-t border-white/[0.07] px-5 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Main Image</label>
              <ImagePicker label="Upload" current={form.imageUrl} onFile={(f) => setImageFile(f)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Icon</label>
              <ImagePicker label="Upload" current={form.iconUrl} onFile={(f) => setIconFile(f)} />
            </div>
            <div className="flex items-center gap-2 ml-auto self-end pb-1">
              <input
                id={`featured-${project.id}`}
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-white"
              />
              <label htmlFor={`featured-${project.id}`} className="font-mono text-xs text-white/50">Featured</label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-black font-mono font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddProjectForm({ onAdd }: { onAdd: (p: Project) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EditingProject>({ ...EMPTY });
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [iconFile, setIconFile] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setSaving(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("location", form.location);
    fd.append("featured", String(form.featured));
    if (imageFile) fd.append("imageFile", imageFile);
    if (iconFile) fd.append("iconFile", iconFile);

    const res = await fetch("/api/admin/projects", { method: "POST", body: fd });
    if (res.ok) {
      const { project } = await res.json();
      onAdd(project);
      setForm({ ...EMPTY });
      setImageFile(undefined);
      setIconFile(undefined);
      setOpen(false);
    }
    setSaving(false);
  }

  return (
    <div className="border border-dashed border-white/[0.1] rounded-xl overflow-hidden">
      <button
        id="cms-add-project-btn"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-3 font-mono text-sm text-white/40 hover:text-white hover:bg-white/[0.03] transition-all"
      >
        <span className="text-lg">＋</span> Add New Project
      </button>

      {open && (
        <div className="border-t border-white/[0.07] px-5 py-5 flex flex-col gap-4 bg-white/[0.02]">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project name"
                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all placeholder:text-white/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. India, Kochi"
                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Short project description…"
              className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all resize-none placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Main Image</label>
              <ImagePicker label="Upload" current="" onFile={(f) => setImageFile(f)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Icon</label>
              <ImagePicker label="Upload" current="" onFile={(f) => setIconFile(f)} />
            </div>
            <div className="flex items-center gap-2 ml-auto self-end pb-1">
              <input
                id="new-featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-white"
              />
              <label htmlFor="new-featured" className="font-mono text-xs text-white/50">Featured</label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              disabled={saving || !form.title}
              className="bg-white text-black font-mono font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all disabled:opacity-40"
            >
              {saving ? "Adding…" : "Add Project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsEditor({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  async function handleSave(p: Project, imageFile?: File, iconFile?: File) {
    const fd = new FormData();
    fd.append("title", p.title);
    fd.append("description", p.description);
    fd.append("location", p.location);
    fd.append("featured", String(p.featured));
    if (imageFile) fd.append("imageFile", imageFile);
    if (iconFile) fd.append("iconFile", iconFile);

    const res = await fetch(`/api/admin/projects/${p.id}`, { method: "PUT", body: fd });
    if (res.ok) {
      const { project } = await res.json();
      setProjects((prev) => prev.map((x) => (x.id === project.id ? project : x)));
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function handleAdd(p: Project) {
    setProjects((prev) => [...prev, p]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-lg font-bold text-white">Projects</h2>
        <p className="font-mono text-xs text-white/30 mt-1">
          {projects.length} project{projects.length !== 1 ? "s" : ""} — add images, icons, titles and descriptions.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            onDelete={() => handleDelete(p.id)}
            onSave={handleSave}
          />
        ))}
        <AddProjectForm onAdd={handleAdd} />
      </div>
    </div>
  );
}
