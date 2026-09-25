import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { totalMs } from "@/lib/lifecycle";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

// Served as a real `/og.png` file: GitHub Pages picks the content type from the extension.
// Latin-only on purpose: the default OG font has no Hangul glyphs.
export function GET() {
  const hops = ["CLIENT", "MIDDLEWARE", "SERVICE", "DATABASE", "RESPONSE"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0e100f", color: "#e7e6e0", fontFamily: "monospace" }}>
        <div style={{ display: "flex", fontSize: 26, color: "#7fd99a", letterSpacing: 2 }}>GET / · CLIENT</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 36 }}>
            <span>GET /{profile.handle}&nbsp;</span>
            <span style={{ color: "#7fd99a" }}>200 OK&nbsp;</span>
            <span style={{ color: "#8c8f88" }}>· {totalMs}ms</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: "#8c8f88" }}>
          {hops.map((h, i) => (
            <div key={h} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 14, height: 14, border: "2px solid #7fd99a", background: i === hops.length - 1 ? "#7fd99a" : "transparent", marginRight: 12 }} />
              <span>{h}</span>
              {i < hops.length - 1 && <div style={{ width: 48, height: 2, background: "#3a413c", margin: "0 18px" }} />}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
