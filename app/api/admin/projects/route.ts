import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { getProjects, upsertProject } from "@/lib/cms-data";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("cms_session")?.value === "authenticated";
}

async function saveUpload(file: File, prefix: string): Promise<string> {
  const filename = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { url } = await put(filename, file, { access: "public" });
  return url;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const title = (formData.get("title") as string) || "Untitled";
  const description = (formData.get("description") as string) || "";
  const location = (formData.get("location") as string) || "";
  const featured = formData.get("featured") === "true";
  const imageFile = formData.get("imageFile") as File | null;
  const iconFile = formData.get("iconFile") as File | null;

  let imageUrl = "";
  let iconUrl = "";
  if (imageFile && imageFile.size > 0) imageUrl = await saveUpload(imageFile, "project");
  if (iconFile && iconFile.size > 0) iconUrl = await saveUpload(iconFile, "icon");

  const newProject = await upsertProject({
    id: randomUUID(),
    imageUrl,
    iconUrl,
    title,
    description,
    location,
    featured,
  });

  return NextResponse.json({ project: newProject }, { status: 201 });
}
