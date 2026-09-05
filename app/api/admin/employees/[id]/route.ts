import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getEmployees, upsertEmployee, deleteEmployee } from "@/lib/cms-data";

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

  const employees = await getEmployees();
  const existing = employees.find((e) => e.id === id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const name = (formData.get("name") as string) || existing.name;
  const role = (formData.get("role") as string) ?? existing.role;
  const bio = (formData.get("bio") as string) ?? existing.bio;
  const photoFile = formData.get("photoFile") as File | null;
  const clearPhoto = formData.get("clearPhoto") === "true";

  let imageUrl = existing.imageUrl;
  if (clearPhoto) {
    imageUrl = "";
  } else if (photoFile && photoFile.size > 0) {
    imageUrl = await saveUpload(photoFile, "employee");
  }

  const updated = await upsertEmployee({ id, name, role, bio, imageUrl });
  return NextResponse.json({ employee: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteEmployee(id);
  return NextResponse.json({ success: true });
}
