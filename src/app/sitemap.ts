import type { MetadataRoute } from "next";
import { getRecentPosts } from "@/lib/data/posts";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${appUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/explorar?estado=perdido`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${appUrl}/explorar?estado=encontrado`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${appUrl}/legal/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${appUrl}/legal/terminos`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const posts = await getRecentPosts(50);
    return [
      ...staticRoutes,
      ...posts.map((post) => ({
        url: `${appUrl}/publicacion/${post.id}`,
        lastModified: new Date(post.createdAt),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
