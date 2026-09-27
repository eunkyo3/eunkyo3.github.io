import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Titles and numbers are Korean, which the default OG font can't draw, so load Pretendard at build time.
const fontDir = join(process.cwd(), "node_modules/pretendard/dist/public/static");
const fonts = Promise.all([readFile(join(fontDir, "Pretendard-Regular.otf")), readFile(join(fontDir, "Pretendard-Bold.otf"))]);

export async function GET(_req: Request, { params }: RouteContext<"/projects/[slug]/og.png">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });

  const index = String(projects.indexOf(project) + 1).padStart(2, "0");
  const metric = project.metrics[0];
  const [regular, bold] = await fonts;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#0e100f", color: "#e7e6e0", fontFamily: "Pretendard", wordBreak: "keep-all" }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, color: "#8c8f88" }}>
          <span style={{ color: "#7fd99a" }}>CASE STUDY · {index}</span>
          <span style={{ marginLeft: 20 }}>{project.org === "company" ? "회사 · 애니셀" : "개인 프로젝트"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1 }}>{project.title}</div>
          <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.45, color: "#8c8f88", maxWidth: 1000 }}>{project.summary}</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {metric ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 22, color: "#8c8f88" }}>{metric.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", marginTop: 8, fontSize: 64, fontWeight: 700, letterSpacing: -1.5 }}>
                {metric.before && (
                  <>
                    <span style={{ color: "#8c8f88" }}>{metric.before}</span>
                    <span style={{ color: "#7fd99a", margin: "0 18px" }}>→</span>
                  </>
                )}
                <span>{metric.after}</span>
              </div>
            </div>
          ) : (
            <div />
          )}
          <div style={{ display: "flex", fontSize: 24, color: "#8c8f88" }}>
            ~/<span style={{ color: "#e7e6e0" }}>{profile.handle}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
