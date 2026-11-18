import type { MetadataRoute } from "next";
import { SITE, CATEGORIES } from "@/lib/site";
import { getLatestPosts, getOpportunities } from "@/lib/data";

/*
  Dynamic sitemap: static pages, the six categories, every publicly
  visible article and opportunity. Built from the same data layer the
  pages use, so it can never list something the site itself hides.
*/
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/discover`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/opportunities`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/affiliate-disclosure`, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const c of CATEGORIES) {
    if (c.slug === "opportunities") continue; // already listed as the directory
    entries.push({ url: `${base}/${c.slug}`, changeFrequency: "daily", priority: 0.7 });
  }

  const posts = await getLatestPosts(500);
  for (const p of posts) {
    entries.push({
      url: `${base}/articles/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  const { items } = await getOpportunities({ page: 1, pageSize: 200 });
  for (const o of items) {
    entries.push({
      url: `${base}/opportunities/${o.slug}`,
      lastModified: o.last_verified_at ? new Date(o.last_verified_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
