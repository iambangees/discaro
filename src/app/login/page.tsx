import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const instant = false;

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Discaro to reach your saved bookmarks.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  return <LoginForm next={safeNext} />;
}
