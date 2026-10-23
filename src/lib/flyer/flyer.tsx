import "server-only";

import sharp from "sharp";
import { ImageResponse } from "next/og";
import { ageLabel, petTitle, sexLabel, sizeLabel, speciesLabel } from "@/lib/format";
import type { Post } from "@/lib/types";
import { flyerDate, phoneLabel, truncate } from "@/lib/flyer/format";
import { qrDataUrl } from "@/lib/flyer/qr";

type FlyerFont = {
  name: string;
  data: ArrayBuffer;
  weight: 700 | 900;
  style: "normal";
};

const photoWidth = 952;
const photoHeight = 740;
const cream = "#ffffff";
const ink = "#000000";
const muted = "rgba(255, 255, 255, 0.62)";
const fontCache = new Map<string, Promise<FlyerFont[]>>();

export async function createFlyerResponse({
  post,
  origin,
}: {
  post: Post;
  origin: string;
}) {
  const postUrl = new URL(`/publicacion/${post.id}`, origin).toString();
  const photoUrl = absoluteUrl(post.photos[0]?.url, origin);
  const [qr, photo, logo, fonts] = await Promise.all([
    qrDataUrl(postUrl),
    loadPhoto(photoUrl),
    loadLogo(origin),
    loadFonts(origin),
  ]);

  return new ImageResponse(
    (
      <Flyer
        post={post}
        qrDataUrl={qr}
        photoUrl={photo}
        logoUrl={logo}
      />
    ),
    {
      width: 1080,
      height: 1920,
      fonts,
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

function Flyer({
  post,
  qrDataUrl: qr,
  photoUrl,
  logoUrl,
}: {
  post: Post;
  qrDataUrl: string;
  photoUrl: string | null;
  logoUrl: string | null;
}) {
  const name = truncate(petTitle(post), 24);
  const nameSize = name.length > 18 ? 76 : name.length > 12 ? 100 : 120;
  const details = [
    speciesLabel(post.species),
    post.sex === "unknown" ? "" : sexLabel(post.sex),
    ageLabel(post.age),
    sizeLabel(post.size),
  ]
    .filter(Boolean)
    .join(" · ");
  const status = post.resolvedAt
    ? "VOLVIÓ A CASA"
    : post.status === "lost"
      ? "SE PERDIÓ"
      : "ENCONTRADO";
  const accent = post.resolvedAt || post.status !== "lost"
    ? { solid: "#14532d", soft: "#ffffff", text: "#ffffff" }
    : { solid: "#e6007e", soft: "#ffffff", text: "#ffffff" };
  const dateText = post.resolvedAt
    ? `Reencuentro · ${flyerDate(post)}`
    : `${post.status === "lost" ? "Se perdió el" : "Se encontró el"} ${flyerDate(post)}`;
  const contact = post.authorWhatsapp ? phoneLabel(post.authorWhatsapp) : null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: ink,
        padding: "96px 64px 240px",
        fontFamily: "Nunito",
        color: cream,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Michinder"
            width={50}
            height={64}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 64,
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            M
          </div>
        )}
        <div
          style={{
            display: "flex",
            marginLeft: 16,
            fontSize: 40,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          Michinder
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: photoHeight,
          marginTop: 36,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: 36,
          border: "1px solid rgba(255, 255, 255, 0.10)",
          backgroundColor: "#000000",
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={petTitle(post)}
            width={photoWidth}
            height={photoHeight}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              gap: 18,
              backgroundColor: "#000000",
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                width={160}
                height={205}
                style={{ objectFit: "contain", opacity: 0.9 }}
              />
            ) : null}
            <div style={{ fontSize: 34, fontWeight: 900, color: muted }}>
              Sin foto
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 32,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            padding: "10px 24px",
            backgroundColor: accent.solid,
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          {status}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 14,
          fontSize: nameSize,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: -2,
          color: cream,
        }}
      >
        {name}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 16,
          fontSize: 36,
          fontWeight: 700,
          color: muted,
        }}
      >
        {details || speciesLabel(post.species)}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: accent.solid,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -0.5,
          }}
        >
          {truncate(post.locationLabel, 30)}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 12,
          fontSize: 32,
          fontWeight: 700,
          color: muted,
        }}
      >
        {dateText}
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "26px 30px",
          borderRadius: 32,
          backgroundColor: cream,
          color: ink,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.05,
            }}
          >
            {truncate(post.authorName, 24)}
          </div>
          {contact ? (
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 34,
                fontWeight: 900,
                color: "#e6007e",
              }}
            >
              WhatsApp {contact}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 30,
                fontWeight: 700,
                color: "#d9d9d9",
              }}
            >
              Contacto en el aviso
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 10,
              borderRadius: 18,
              border: "2px solid #000000",
              backgroundColor: "#ffffff",
            }}
          >
            <img src={qr} alt="Código QR del aviso" width={170} height={170} />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              color: "#4f6b60",
            }}
          >
            Ver aviso
          </div>
        </div>
      </div>
    </div>
  );
}

async function loadPhoto(url: string | null) {
  if (!url) return null;

  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) return null;

    const input = Buffer.from(await response.arrayBuffer());
    const output = await sharp(input)
      .rotate()
      .resize({ width: photoWidth, height: photoHeight, fit: "cover" })
      .jpeg({ quality: 88 })
      .toBuffer();

    return `data:image/jpeg;base64,${output.toString("base64")}`;
  } catch {
    return null;
  }
}

async function loadLogo(origin: string) {
  try {
    const response = await fetch(
      new URL("/michinder-pin.png", origin).toString(),
      { cache: "force-cache" },
    );
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function absoluteUrl(value: string | undefined, origin: string) {
  if (!value) return null;

  try {
    const url = new URL(value, origin);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function loadFonts(origin: string) {
  const cached = fontCache.get(origin);
  if (cached) return cached;

  const fonts = Promise.all([
    fetch(new URL("/fonts/nunito-700.woff", origin).toString(), {
      cache: "force-cache",
    }),
    fetch(new URL("/fonts/nunito-900.woff", origin).toString(), {
      cache: "force-cache",
    }),
  ])
    .then(async ([bold, black]) => {
      if (!bold.ok || !black.ok) throw new Error("No se pudieron cargar las fuentes");

      return [
        {
          name: "Nunito",
          data: await bold.arrayBuffer(),
          weight: 700,
          style: "normal",
        },
        {
          name: "Nunito",
          data: await black.arrayBuffer(),
          weight: 900,
          style: "normal",
        },
      ] satisfies FlyerFont[];
    })
    .catch(() => {
      fontCache.delete(origin);
      return [];
    });

  fontCache.set(origin, fonts);
  return fonts;
}
