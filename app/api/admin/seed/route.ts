import { NextRequest, NextResponse } from "next/server";
import { setHeroImage, upsertProject, upsertEmployee } from "@/lib/cms-data";
import cmsJson from "@/data/cms-data.json";

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("cms_session")?.value === "authenticated";
}

/**
 * One-time seed endpoint — imports data from the committed cms-data.json into Neon.
 * Hit POST /api/admin/seed once after setting up your DATABASE_URL.
 * Safe to call multiple times (uses upsert).
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = cmsJson as {
    heroImage: string;
    projects: {
      id: string; imageUrl: string; iconUrl: string;
      title: string; description: string; location: string; featured: boolean;
    }[];
    employees: {
      id: string; name: string; role: string; bio: string; imageUrl: string;
    }[];
  };

  if (data.heroImage) await setHeroImage(data.heroImage);

  for (const p of data.projects) {
    await upsertProject(p);
  }

  for (const e of data.employees) {
    await upsertEmployee(e);
  }

  return NextResponse.json({
    ok: true,
    seeded: {
      heroImage: !!data.heroImage,
      projects: data.projects.length,
      employees: data.employees.length,
    },
  });
}
