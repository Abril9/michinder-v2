import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} · ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#e6007e" fill-rule="evenodd" d="M128 16c-46.4 0-84 37.6-84 84 0 63 84 148 84 148s84-85 84-148c0-46.4-37.6-84-84-84Zm0 26a58 58 0 1 0 0 116 58 58 0 0 0 0-116Z"/><g fill="#e6007e" stroke="#e6007e" stroke-width="17" stroke-linecap="round"><path d="M105.37 122.63 150.63 77.37"/><circle cx="96.18" cy="113.44" r="12.5" stroke="none"/><circle cx="114.56" cy="131.82" r="12.5" stroke="none"/><circle cx="141.44" cy="68.18" r="12.5" stroke="none"/><circle cx="159.82" cy="86.56" r="12.5" stroke="none"/></g></svg>`;
const pinSrc = `data:image/svg+xml;base64,${btoa(pinSvg)}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#ffffff",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 24,
              fontWeight: 800,
              color: "#e6007e",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Mascotas perdidas y encontradas
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 92,
              lineHeight: 0.95,
              fontWeight: 900,
              color: "#000000",
              letterSpacing: -4,
            }}
          >
            Se perdió.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 0.95,
              fontWeight: 900,
              color: "#000000",
              letterSpacing: -4,
            }}
          >
            Se encontró.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 0.95,
              fontWeight: 900,
              color: "#e6007e",
              letterSpacing: -3,
            }}
          >
            Volvió a casa.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 640,
              fontSize: 26,
              lineHeight: 1.35,
              fontWeight: 600,
              color: "#333333",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 30,
              fontWeight: 900,
              color: "#000000",
            }}
          >
            Michinder
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 420,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 360,
              height: 360,
              borderRadius: 180,
              background: "#ffffff",
            }}
          >
            <img src={pinSrc} width={260} height={260} alt="" />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
