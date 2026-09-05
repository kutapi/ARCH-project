import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getProject, upsertProject, deleteProject } from "@/lib/cms-data";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("cms_session")?.value === "authenticated";
}

async function saveUpload(file: File, prefix: string): Promise<string> {
  const filename = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { url } = await put(filename, file, { access: "public" });
  return url;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await getProject(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const title = (formData.get("title") as string) ?? existing.title;
  const description = (formData.get("description") as string) ?? existing.description;
  const location = (formData.get("location") as string) ?? existing.location;
  const featured = formData.has("featured") ? formData.get("featured") === "true" : existing.featured;
  const imageFile = formData.get("imageFile") as File | null;
  const iconFile = formData.get("iconFile") as File | null;
  const clearImage = formData.get("clearImage") === "true";
  const clearIcon = formData.get("clearIcon") === "true";

  let imageUrl = existing.imageUrl;
  let iconUrl = existing.iconUrl;

  if (clearImage) {
    imageUrl = "";
  } else if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUpload(imageFile, "project");
  }

  if (clearIcon) {
    iconUrl = "";
  } else if (iconFile && iconFile.size > 0) {
    iconUrl = await saveUpload(iconFile, "icon");
  }

  const updated = await upsertProject({ id, imageUrl, iconUrl, title, description, location, featured });
  return NextResponse.json({ project: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ success: true });
}
