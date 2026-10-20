import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} · ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #fff8ef 0%, #ffe7cc 100%)",
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
              color: "#e11d48",
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
              color: "#1d1916",
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
              color: "#1d1916",
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
              color: "#e11d48",
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
              color: "#6b625c",
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
              color: "#1d1916",
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
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              width: 320,
              height: 320,
              borderRadius: 160,
              background: "#ffd6a5",
            }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                width: 230,
                height: 210,
                borderRadius: 110,
                background: "#1d1916",
                marginTop: 36,
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  left: 38,
                  top: 78,
                  width: 54,
                  height: 64,
                  borderRadius: 32,
                  background: "#facc15",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 14,
                    height: 48,
                    borderRadius: 10,
                    background: "#1d1916",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  right: 38,
                  top: 78,
                  width: 54,
                  height: 64,
                  borderRadius: 32,
                  background: "#facc15",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 14,
                    height: 48,
                    borderRadius: 10,
                    background: "#1d1916",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  left: 92,
                  top: 138,
                  width: 46,
                  height: 34,
                  background: "#fb7185",
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                position: "absolute",
                bottom: 58,
                width: 190,
                height: 54,
                borderRadius: 16,
                background: "#e11d48",
              }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                bottom: 22,
                width: 78,
                height: 64,
                background: "#be123c",
                clipPath: "polygon(50% 100%, 0 0, 100% 0)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
