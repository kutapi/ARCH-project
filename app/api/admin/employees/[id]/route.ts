import { NextRequest, NextResponse } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/cms-data";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("cms_session")?.value === "authenticated";
}

async function saveUpload(file: File, prefix: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const photoFile = formData.get("photoFile") as File | null;

  const data = getCmsData();
  const idx = data.employees.findIndex((e) => e.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (name) data.employees[idx].name = name;
  if (role !== null) data.employees[idx].role = role;
  if (bio !== null) data.employees[idx].bio = bio;
  if (photoFile && photoFile.size > 0) {
    data.employees[idx].imageUrl = await saveUpload(photoFile, "employee");
  }

  saveCmsData(data);
  return NextResponse.json({ employee: data.employees[idx] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const data = getCmsData();
  const idx = data.employees.findIndex((e) => e.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  data.employees.splice(idx, 1);
  saveCmsData(data);
  return NextResponse.json({ success: true });
}
