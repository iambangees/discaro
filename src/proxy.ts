import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/*
  Next 16 "proxy" (formerly middleware), two jobs:
  1. /admin — refresh the Supabase session and keep signed-out visitors
     on the login page.
  2. /articles/<slug> and /opportunities/<slug> — hard 404s. With cache
     components the static shell streams a 200 before the page can call
     notFound(), so a missing slug is checked here, before rendering.
     The check uses the public (anon) key, so row-level security decides
     what "exists" for a visitor — drafts and paused listings 404 too.
     Any failure of the check itself lets the request through.
*/

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found · Discaro</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f7f9fc;color:#0a1a33}
  main{max-width:40rem;margin:0 auto;padding:6rem 1.5rem;text-align:center}
  h1{font-size:2rem;letter-spacing:-.02em;margin:0 0 .75rem}
  p{color:#5b6b8c;line-height:1.6}
  a{display:inline-block;margin-top:1.5rem;background:#0b6bff;color:#fff;font-weight:600;
    padding:.8rem 1.6rem;border-radius:.9rem;text-decoration:none}
</style></head><body><main>
  <h1>We could not find that page</h1>
  <p>It may have been removed, or the address is slightly off. Everything current is on the homepage.</p>
  <a href="/">Back to Discaro</a>
</main></body></html>`;

async function slugExists(table: "posts" | "opportunities", slug: string): Promise<boolean | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as unknown[];
    return rows.length > 0;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- content routes: hard 404 for unknown slugs ---
  const articleMatch = pathname.match(/^\/articles\/([^/]+)$/);
  const opportunityMatch = pathname.match(/^\/opportunities\/([^/]+)$/);
  if (articleMatch || opportunityMatch) {
    const table = articleMatch ? "posts" : "opportunities";
    const slug = decodeURIComponent((articleMatch ?? opportunityMatch)![1]);
    const exists = await slugExists(table, slug);
    if (exists === false) {
      return new NextResponse(NOT_FOUND_HTML, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return NextResponse.next();
  }

  // --- admin: session refresh + guard ---
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = pathname === "/admin/login";
  if (!user && !isLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }
  if (user && isLogin) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/articles/:path*", "/opportunities/:path*"],
};
