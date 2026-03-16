import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || password !== sitePassword) {
    // Redirect back — middleware will show the password page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Set auth cookie and redirect to home
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("site-auth", password, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
