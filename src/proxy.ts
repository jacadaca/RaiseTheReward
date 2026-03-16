import { NextRequest, NextResponse } from "next/server";

/**
 * Simple password protection for the site during development.
 * Set SITE_PASSWORD in your Vercel environment variables to enable.
 * Remove this file (or unset the env var) when you're ready to go public.
 */
export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  // If no password is set, let everything through
  if (!password) return NextResponse.next();

  // Check for the auth cookie
  const authCookie = request.cookies.get("site-auth");
  if (authCookie?.value === password) return NextResponse.next();

  // Let the auth API route handle password submissions
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Serve the password page (uses fetch to avoid POST issues)
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>RaiseTheReward — Access Required</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #ededed; }
    .container { text-align: center; max-width: 360px; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #888; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .form { display: flex; gap: 0.5rem; }
    input { flex: 1; padding: 0.75rem 1rem; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #ededed; font-size: 1rem; outline: none; }
    input:focus { border-color: #555; }
    button { padding: 0.75rem 1.25rem; border: none; border-radius: 8px; background: #ededed; color: #0a0a0a; font-size: 1rem; font-weight: 600; cursor: pointer; }
    button:hover { background: #ccc; }
    .error { color: #e55; margin-top: 0.75rem; font-size: 0.85rem; display: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>RaiseTheReward</h1>
    <p>This site is under development. Enter the password to continue.</p>
    <div class="form">
      <input type="password" id="pw" placeholder="Password" autofocus />
      <button onclick="submit()">Enter</button>
    </div>
    <div class="error" id="err">Incorrect password</div>
  </div>
  <script>
    document.getElementById('pw').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submit();
    });
    async function submit() {
      const pw = document.getElementById('pw').value;
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById('err').style.display = 'block';
      }
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
