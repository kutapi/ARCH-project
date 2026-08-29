"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Employee } from "@/lib/cms-data";

function EmployeeCard({
  employee,
  onDelete,
}: {
  employee: Employee;
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/employees/${employee.id}`, { method: "DELETE" });
    onDelete();
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 flex gap-4 items-start hover:border-white/[0.12] transition-all group">
      {/* Photo */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/[0.06] shrink-0 flex items-center justify-center">
        {employee.imageUrl ? (
          <Image
            src={employee.imageUrl}
            alt={employee.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">👤</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm font-bold text-white leading-tight">{employee.name}</p>
        <p className="font-mono text-xs text-white/40 mt-0.5">{employee.role}</p>
        {employee.bio && (
          <p className="font-mono text-xs text-white/30 mt-2 line-clamp-2 leading-relaxed">
            {employee.bio}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 font-mono text-xs text-red-400/60 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-30 shrink-0"
      >
        {deleting ? "…" : "Remove"}
      </button>
    </div>
  );
}

function AddEmployeeForm({ onAdd }: { onAdd: (e: Employee) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePhoto(f: File) {
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }

  async function handleAdd() {
    if (!name) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("role", role);
    fd.append("bio", bio);
    if (photoFile) fd.append("photoFile", photoFile);

    const res = await fetch("/api/admin/employees", { method: "POST", body: fd });
    if (res.ok) {
      const { employee } = await res.json();
      onAdd(employee);
      setName(""); setRole(""); setBio("");
      setPhotoFile(null); setPhotoPreview(null);
      setOpen(false);
    }
    setSaving(false);
  }

  return (
    <div className="border border-dashed border-white/[0.1] rounded-xl overflow-hidden">
      <button
        id="cms-add-employee-btn"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-3 font-mono text-sm text-white/40 hover:text-white hover:bg-white/[0.03] transition-all"
      >
        <span className="text-lg">＋</span> Add New Employee
      </button>

      {open && (
        <div className="border-t border-white/[0.07] px-5 py-5 flex flex-col gap-4 bg-white/[0.02]">
          {/* Photo picker */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => inputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-white/[0.1] hover:border-white/25 cursor-pointer overflow-hidden bg-white/[0.04] flex items-center justify-center transition-all shrink-0"
            >
              {photoPreview ? (
                <Image src={photoPreview} alt="preview" width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/20 font-mono text-xs text-center px-2">Photo</span>
              )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }} />

            <div className="flex flex-col gap-3 flex-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name *"
                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all placeholder:text-white/20"
              />
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role / Position"
                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Short bio…"
              className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-white/25 transition-all resize-none placeholder:text-white/20"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              disabled={saving || !name}
              className="bg-white text-black font-mono font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-white/90 active:scale-95 transition-all disabled:opacity-40"
            >
              {saving ? "Adding…" : "Add Employee"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeesEditor({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-lg font-bold text-white">Employees</h2>
        <p className="font-mono text-xs text-white/30 mt-1">
          {employees.length} team member{employees.length !== 1 ? "s" : ""} — add photos, names, roles and bios.
        </p>
      </div>

      {employees.length === 0 && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-8 text-center">
          <p className="font-mono text-sm text-white/25">No employees yet. Add your first team member below.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {employees.map((e) => (
          <EmployeeCard
            key={e.id}
            employee={e}
            onDelete={() => setEmployees((prev) => prev.filter((x) => x.id !== e.id))}
          />
        ))}
        <AddEmployeeForm onAdd={(e) => setEmployees((prev) => [...prev, e])} />
      </div>
    </div>
  );
}
