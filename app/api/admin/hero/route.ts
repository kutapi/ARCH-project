import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getHeroImage, setHeroImage } from "@/lib/cms-data";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("cms_session")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const heroImage = await getHeroImage();
  return NextResponse.json({ heroImage });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const filename = `hero-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { url } = await put(filename, file, { access: "public" });

  await setHeroImage(url);
  return NextResponse.json({ heroImage: url });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await setHeroImage("");
  return NextResponse.json({ heroImage: "" });
}
