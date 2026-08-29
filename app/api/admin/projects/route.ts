import { NextRequest, NextResponse } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/cms-data";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = getCmsData();
  return NextResponse.json({ projects: data.projects });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const featured = formData.get("featured") === "true";
  const imageFile = formData.get("imageFile") as File | null;
  const iconFile = formData.get("iconFile") as File | null;

  let imageUrl = formData.get("imageUrl") as string || "";
  let iconUrl = formData.get("iconUrl") as string || "";

  if (imageFile && imageFile.size > 0) imageUrl = await saveUpload(imageFile, "project");
  if (iconFile && iconFile.size > 0) iconUrl = await saveUpload(iconFile, "icon");

  const newProject = {
    id: randomUUID(),
    imageUrl,
    iconUrl,
    title: title || "Untitled",
    description: description || "",
    location: location || "",
    featured,
  };

  const data = getCmsData();
  data.projects.push(newProject);
  saveCmsData(data);

  return NextResponse.json({ project: newProject }, { status: 201 });
}
