import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = process.env.CMS_PASSWORD || "admin123";
const SESSION_COOKIE = "cms_session";
const SESSION_VALUE = "authenticated";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}
