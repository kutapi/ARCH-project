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
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const featured = formData.get("featured") === "true";
  const imageFile = formData.get("imageFile") as File | null;
  const iconFile = formData.get("iconFile") as File | null;
  const clearImage = formData.get("clearImage") === "true";
  const clearIcon = formData.get("clearIcon") === "true";

  const data = getCmsData();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (title !== null) data.projects[idx].title = title;
  if (description !== null) data.projects[idx].description = description;
  if (location !== null) data.projects[idx].location = location;
  data.projects[idx].featured = featured;

  if (clearImage) {
    data.projects[idx].imageUrl = "";
  } else if (imageFile && imageFile.size > 0) {
    data.projects[idx].imageUrl = await saveUpload(imageFile, "project");
  }

  if (clearIcon) {
    data.projects[idx].iconUrl = "";
  } else if (iconFile && iconFile.size > 0) {
    data.projects[idx].iconUrl = await saveUpload(iconFile, "icon");
  }

  saveCmsData(data);
  return NextResponse.json({ project: data.projects[idx] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const data = getCmsData();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  data.projects.splice(idx, 1);
  saveCmsData(data);
  return NextResponse.json({ success: true });
}
