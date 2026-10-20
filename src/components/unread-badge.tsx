"use client";

import { useEffect, useState } from "react";

export function UnreadBadge({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/unread", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { count?: number };
        if (!cancelled) setCount(Number(data.count ?? 0));
      } catch {
        // Silencioso: el badge no debe romper la navegación.
      }
    }

    const timer = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-black text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
