import { NextRequest, NextResponse } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/cms-data";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("cms_session")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = getCmsData();
  return NextResponse.json({ heroImage: data.heroImage });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `hero-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  await writeFile(path.join(uploadsDir, filename), buffer);

  const imageUrl = `/uploads/${filename}`;
  const data = getCmsData();
  data.heroImage = imageUrl;
  saveCmsData(data);

  return NextResponse.json({ heroImage: imageUrl });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = getCmsData();
  data.heroImage = "";
  saveCmsData(data);

  return NextResponse.json({ heroImage: "" });
}

