import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/*
  Default social-share image for the whole site, drawn in code
  (1200×630): navy panel, electric-blue compass ring, name + motto.
  Article pages override it with their cover image when they have one.
*/
export const alt = `${SITE.name} — ${SITE.motto}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#081226",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div
            style={{
              width: "104px",
              height: "104px",
              borderRadius: "28px",
              backgroundColor: "#0b6bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "58px",
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: "84px", fontWeight: 700, letterSpacing: "-2px" }}>
            {SITE.name}
          </div>
        </div>
        <div style={{ marginTop: "36px", fontSize: "40px", color: "#bcd3ff" }}>
          {SITE.motto}
        </div>
        <div style={{ marginTop: "18px", fontSize: "26px", color: "#7e93bd" }}>
          Freebies · Rewards · Technology · Tutorials · Opportunities · Reviews
        </div>
      </div>
    ),
    size,
  );
}
