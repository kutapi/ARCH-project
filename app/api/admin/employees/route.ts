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
  return NextResponse.json({ employees: data.employees });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const photoFile = formData.get("photoFile") as File | null;

  let imageUrl = "";
  if (photoFile && photoFile.size > 0) imageUrl = await saveUpload(photoFile, "employee");

  const newEmployee = {
    id: randomUUID(),
    name: name || "Unknown",
    role: role || "",
    bio: bio || "",
    imageUrl,
  };

  const data = getCmsData();
  data.employees.push(newEmployee);
  saveCmsData(data);

  return NextResponse.json({ employee: newEmployee }, { status: 201 });
}
