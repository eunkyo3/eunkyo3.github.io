// Builds a Pretendard subset containing only the glyphs this site uses.
// The full Korean font ships as ~90 unicode-range files; loading ~18 of them
// on first paint cost ~470KB on mobile. One subset file replaces all of them.
// Runs before `dev` and `build`, so editing content never leaves glyphs missing.
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import subsetFont from "subset-font";

const SRC_DIR = "src";
const SOURCE_FONT = "node_modules/pretendard/dist/public/variable/PretendardVariable.ttf";
const OUT = "src/app/fonts/pretendard-subset.woff2";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(tsx?|css)$/.test(entry.name)) yield path;
  }
}

const chars = new Set();
for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c)); // all printable ASCII
for await (const file of walk(SRC_DIR)) {
  for (const ch of await readFile(file, "utf8")) if (ch.codePointAt(0) > 0x7f) chars.add(ch);
}

const text = [...chars].join("");
const font = await subsetFont(await readFile(SOURCE_FONT), text, {
  targetFormat: "woff2",
  variationAxes: { wght: { min: 400, max: 700, default: 400 } },
});
await mkdir("src/app/fonts", { recursive: true });
await writeFile(OUT, font);
console.log(`pretendard subset: ${chars.size} glyphs, ${(font.length / 1024).toFixed(1)} KB → ${OUT}`);
