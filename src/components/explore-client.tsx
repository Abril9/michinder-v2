"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Loader2, Plus, RefreshCw, SquareStack } from "lucide-react";
import { toast } from "sonner";
import { FilterBar } from "@/components/filter-bar";
import { PostCard } from "@/components/post-card";
import { SwipeDeck } from "@/components/swipe-deck";
import { EmptyState } from "@/components/empty-state";
import { Button, ButtonLink } from "@/components/ui/button";
import { DEFAULT_LOCATION, RADIUS_DEFAULT_KM } from "@/lib/constants";
import { statusPlural } from "@/lib/format";
import type { ExploreFilters, Post } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewMode = "swipe" | "grid";
type LocationSource = "demo" | "gps" | "stored";

const locationKey = "michinder:location";

export function ExploreClient({
  initialFilters,
  isLoggedIn,
  initialRadius = RADIUS_DEFAULT_KM,
}: {
  initialFilters: ExploreFilters;
  isLoggedIn: boolean;
  initialRadius?: number;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<ExploreFilters>(initialFilters);
  const [radiusKm, setRadiusKm] = useState(initialRadius);
  const [reloadKey, setReloadKey] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  });
  const [locationLabel, setLocationLabel] = useState<string>(DEFAULT_LOCATION.label);
  const [locationSource, setLocationSource] = useState<LocationSource>("demo");
  const [locating, setLocating] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("swipe");

  const applyLocation = useCallback(
    (next: { lat: number; lng: number }, label: string, source: LocationSource) => {
      setLocation(next);
      setLocationLabel(label);
      setLocationSource(source);
      try {
        localStorage.setItem(locationKey, JSON.stringify({ ...next, label, source }));
      } catch {
        // localStorage puede estar bloqueado; no es crítico.
      }
    },
    [],
  );

  const requestLocation = useCallback(
    (silent = false) => {
      if (!navigator.geolocation) {
        if (!silent) toast.error("Tu navegador no soporta geolocalización.");
        return;
      }
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          applyLocation(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            "Mi ubicación actual",
            "gps",
          );
          setLocating(false);
        },
        () => {
          setLocating(false);
          if (!silent) {
            toast.error("No pudimos obtener tu ubicación. Podés usar la zona demo.");
          }
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
      );
    },
    [applyLocation],
  );

  useEffect(() => {
    let savedLocation: { lat: number; lng: number; label: string; source: LocationSource } | null =
      null;

    try {
      const raw = localStorage.getItem(locationKey);
      if (raw) {
        const saved = JSON.parse(raw) as {
          lat?: number;
          lng?: number;
          label?: string;
          source?: LocationSource;
        };
        if (
          typeof saved.lat === "number" &&
          typeof saved.lng === "number" &&
          typeof saved.label === "string"
        ) {
          savedLocation = {
            lat: saved.lat,
            lng: saved.lng,
            label: saved.label,
            source: saved.source === "gps" ? "gps" : "stored",
          };
        }
      }
    } catch {
      // Ignoramos datos corruptos.
    }

    if (!savedLocation) return;

    const timer = window.setTimeout(() => {
      setLocation({ lat: savedLocation.lat, lng: savedLocation.lng });
      setLocationLabel(savedLocation.label);
      setLocationSource(savedLocation.source);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          estado: filters.status === "lost" ? "perdido" : "encontrado",
          lat: String(location.lat),
          lng: String(location.lng),
          radio: String(radiusKm),
        });
        if (filters.species !== "all") params.set("especie", filters.species);
        if (filters.sex !== "all") params.set("sexo", filters.sex);
        if (filters.age !== "all") params.set("edad", filters.age);
        if (filters.size !== "all") params.set("tamano", filters.size);

        const response = await fetch(`/api/posts?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("No pudimos cargar los avisos.");
        const data = (await response.json()) as { posts?: Post[] };
        setPosts(data.posts ?? []);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") return;
        setError((fetchError as Error).message);
        setPosts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [
    filters.status,
    filters.species,
    filters.sex,
    filters.age,
    filters.size,
    location.lat,
    location.lng,
    radiusKm,
    reloadKey,
  ]);

  const loginHref = `/ingresar?next=${encodeURIComponent(
    `/explorar?estado=${filters.status === "lost" ? "perdido" : "encontrado"}`,
  )}`;
  const searchingFoundPosts = filters.status === "found";
  const speciesQuery = filters.species === "all" ? "" : `&especie=${filters.species}`;
  const createHref = `/publicar?estado=${searchingFoundPosts ? "perdido" : "encontrado"}${speciesQuery}`;
  const createLabel = searchingFoundPosts
    ? "Crear publicación de perdido"
    : "Crear publicación de encontrado";

  async function handleAction(post: Post, action: "like" | "pass") {
    if (!isLoggedIn) {
      toast.error("Ingresá para guardar intereses y chatear.", {
        action: { label: "Ingresar", onClick: () => router.push(loginHref) },
      });
      return false;
    }

    setActing(true);
    try {
      const response = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, action }),
      });
      const data = (await response.json()) as {
        error?: string;
        conversationId?: string | null;
      };

      if (!response.ok) {
        toast.error(data.error ?? "No pudimos guardar la acción.");
        return false;
      }

      setPosts((previous) => previous.filter((item) => item.id !== post.id));

      if (action === "like" && data.conversationId) {
        toast.success("¡Chat creado! Ya pueden coordinar.", {
          action: {
            label: "Abrir",
            onClick: () => router.push(`/chats/${data.conversationId}`),
          },
        });
        router.refresh();
      }

      return true;
    } catch {
      toast.error("Se cortó la conexión. Probá de nuevo.");
      return false;
    } finally {
      setActing(false);
    }
  }

  function resetFilters() {
    setFilters((previous) => ({
      status: previous.status,
      species: "all",
      sex: "all",
      age: "all",
      size: "all",
    }));
    setRadiusKm(RADIUS_DEFAULT_KM);
  }

  function useDemoLocation() {
    applyLocation(
      { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng },
      DEFAULT_LOCATION.label,
      "demo",
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
            Resultados
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            {statusPlural(filters.status)}
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted">
            {loading ? "Buscando avisos..." : `${posts.length} aviso(s) cerca de ${locationLabel}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-line bg-white/80 p-1">
            <button
              type="button"
              onClick={() => setView("swipe")}
              aria-pressed={view === "swipe"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold",
                view === "swipe" ? "bg-ink text-cream" : "text-muted hover:text-ink",
              )}
            >
              <SquareStack size={15} /> Swipe
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold",
                view === "grid" ? "bg-ink text-cream" : "text-muted hover:text-ink",
              )}
            >
              <LayoutGrid size={15} /> Grilla
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex rounded-full border border-line bg-white/70 p-1">
        {(["lost", "found"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilters((previous) => ({ ...previous, status }))}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm font-black transition-colors",
              filters.status === status
                ? status === "lost"
                  ? "bg-coral text-white"
                  : "bg-leaf text-white"
                : "text-muted hover:text-ink",
            )}
          >
            {status === "lost" ? "Perdidos" : "Encontrados"}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-line bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black tracking-tight">
            {searchingFoundPosts ? "¿Perdiste a tu mascota?" : "¿Encontraste una mascota?"}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-muted">
            {searchingFoundPosts
              ? "Estos avisos son de personas que encontraron una. Publicá el tuyo para que puedan reconocerla."
              : "Estos avisos son de familias que la están buscando. Publicá que la encontraste para ayudarlas a volver a casa."}
          </p>
        </div>
        <ButtonLink
          href={createHref}
          variant={searchingFoundPosts ? "primary" : "secondary"}
          size="sm"
          className="shrink-0"
        >
          <Plus size={16} strokeWidth={3} /> {createLabel}
        </ButtonLink>
      </div>

      <div className="mt-4">
        <FilterBar
          filters={filters}
          onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          locationLabel={locationLabel}
          locationSource={locationSource}
          locating={locating}
          onUseGps={() => requestLocation(false)}
          onUseDemo={useDemoLocation}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-8">
        {error ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-fucsia bg-blanco p-8 text-center">
            <p className="text-lg font-black text-fucsia">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              <RefreshCw size={16} /> Reintentar
            </Button>
          </div>
        ) : loading && posts.length === 0 ? (
          <LoadingState />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No hay avisos con estos filtros"
            text="Probá ampliar el radio, cambiar la especie o mirar la zona demo. También podés publicar el tuyo."
            actionHref={createHref}
            actionLabel={createLabel}
          />
        ) : view === "swipe" ? (
          <SwipeDeck posts={posts} onAction={handleAction} acting={acting} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {!isLoggedIn && posts.length > 0 ? (
        <p className="mt-6 text-center text-sm font-bold text-muted">
          Para guardar intereses y chatear,{" "}
          <Link href={loginHref} className="font-black text-coral hover:underline">
            ingresá o creá una cuenta
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto grid max-w-md gap-4">
      <div className="flex h-[min(68vh,640px)] min-h-[500px] items-center justify-center rounded-[2rem] border border-line bg-white/60">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-coral" size={30} />
          <p className="mt-3 text-sm font-extrabold text-muted">Buscando avisos cerca tuyo...</p>
        </div>
      </div>
    </div>
  );
}
