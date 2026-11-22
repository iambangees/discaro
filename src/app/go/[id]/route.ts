import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/*
  Affiliate redirect: /go/<link-id> logs one click in affiliate_clicks
  and redirects to the link's destination. The click log never blocks
  the visitor — if logging fails, the redirect still happens. Unknown
  or inactive links go home instead.
*/
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const home = new URL("/", request.url);
  const sb = getSupabase();
  if (!sb) return NextResponse.redirect(home);

  const { data } = await sb
    .from("affiliate_links")
    .select("url,active")
    .eq("id", id)
    .maybeSingle();
  if (!data || !data.active) return NextResponse.redirect(home);

  let destination: URL;
  try {
    destination = new URL(data.url as string);
  } catch {
    return NextResponse.redirect(home);
  }
  if (destination.protocol !== "http:" && destination.protocol !== "https:") {
    return NextResponse.redirect(home);
  }

  try {
    await sb.from("affiliate_clicks").insert({ link_id: id });
  } catch {
    // A failed click log must never strand the visitor.
  }
  return NextResponse.redirect(destination);
}
