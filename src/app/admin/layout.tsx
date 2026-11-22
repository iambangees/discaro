import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Briefcase,
  Flag,
  Gauge,
  LogOut,
  Mail,
  MessageSquare,
  Newspaper,
  Tags,
  Send,
} from "lucide-react";
import { getAdminContext } from "@/lib/admin";
import { signOut } from "./actions";

// Admin is session-driven: rendered per request, never prerendered.
export const instant = false;

const NAV = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/posts", label: "Articles", icon: Newspaper },
  { href: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Send },
  { href: "/admin/tags", label: "Tags", icon: Tags },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();

  // Login page (and any pre-auth state) renders without the admin shell;
  // the proxy already redirects signed-out visitors to /admin/login.
  if (!ctx) return <>{children}</>;

  // Hard authorisation gate: a signed-in NON-admin never sees the admin
  // shell or pages. (Before this, the layout rendered for any signed-in
  // user with a "not an admin" banner; RLS and the server actions still
  // blocked all private data and every write, but the shell itself should
  // never have been visible.) Admin data functions and actions keep their
  // own isAdmin checks behind this gate as a second layer.
  if (!ctx.isAdmin) redirect("/account");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-surface px-5 py-4">
        <p className="font-bold tracking-tight text-ink">Discaro Admin</p>
        <nav className="flex flex-wrap items-center gap-1" aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep"
            >
              <item.icon className="h-4 w-4" aria-hidden /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:block">
            {ctx.email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent-deep"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
