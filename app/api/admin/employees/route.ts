import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { getEmployees, upsertEmployee } from "@/lib/cms-data";

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
  const employees = await getEmployees();
  return NextResponse.json({ employees });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const name = (formData.get("name") as string) || "Unknown";
  const role = (formData.get("role") as string) || "";
  const bio = (formData.get("bio") as string) || "";
  const photoFile = formData.get("photoFile") as File | null;

  let imageUrl = "";
  if (photoFile && photoFile.size > 0) imageUrl = await saveUpload(photoFile, "employee");

  const newEmployee = await upsertEmployee({
    id: randomUUID(),
    name,
    role,
    bio,
    imageUrl,
  });

  return NextResponse.json({ employee: newEmployee }, { status: 201 });
}
