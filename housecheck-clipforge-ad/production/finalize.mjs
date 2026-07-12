#!/usr/bin/env node
/**
 * finalize.mjs — recompose an EXISTING ClipForge project (after curated per-shot footage was
 * attached) and regenerate all deliverables: master, QC, credits, TikTok + Reels exports.
 * Reuses the same free bring-your-own-script pipeline; requires PROJECT_ID + VOICE env.
 */
import { mkdir, writeFile, copyFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(resolve(__dirname, ".."), "output");
const BASE = (process.env.CLIPFORGE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const projectId = process.env.PROJECT_ID;
const voice = process.env.VOICE || "en-GB-SoniaNeural";
if (!projectId) { console.error("PROJECT_ID required"); process.exit(1); }

const log = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);
const fail = (m) => { console.error("FATAL:", m); process.exit(1); };
const resolveUrl = (u) => (u?.startsWith("http") ? u : BASE + u);

async function api(method, path, body, raw = false) {
  const opts = { method, headers: {} };
  if (body !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(BASE + path, opts);
  if (raw) { if (!res.ok) throw new Error(`${method} ${path} HTTP ${res.status}`); return res; }
  const t = await res.text(); let d; try { d = t ? JSON.parse(t) : {}; } catch { d = { _raw: t }; }
  if (!res.ok) throw new Error(`${method} ${path} HTTP ${res.status}: ${t.slice(0, 500)}`);
  return d;
}
async function download(url, dest) {
  const res = await fetch(resolveUrl(url));
  if (!res.ok) throw new Error(`download ${url} HTTP ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return (await stat(dest)).size;
}
async function ffprobe(file) {
  try {
    const { stdout } = await execFileAsync("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file], { maxBuffer: 20 * 1024 * 1024 });
    const j = JSON.parse(stdout);
    const v = (j.streams || []).find((s) => s.codec_type === "video");
    const a = (j.streams || []).find((s) => s.codec_type === "audio");
    return { duration: parseFloat(j.format?.duration || "0"), width: v?.width, height: v?.height, hasVideo: !!v, hasAudio: !!a, vcodec: v?.codec_name, acodec: a?.codec_name };
  } catch (e) { return { error: String(e) }; }
}

await mkdir(OUT, { recursive: true });

log("Composing (curated assets, English disclosure)...");
const compose = await api("POST", `/api/project/${projectId}/compose`, {
  freeTts: { enabled: true, voice },
  aspectRatio: "9:16", renderPreset: "hd",
  freeBgm: true, bgmMood: "upbeat", bgmDuck: true,
  karaoke: true, aiDisclosure: true, disclosureText: "AI-generated · Ad",
  ctaText: "Visit a Madrid rental remotely before sending a deposit.",
});
const compositionId = compose.compositionId;
if (!compositionId) fail(`no compositionId: ${JSON.stringify(compose)}`);
log("compositionId =", compositionId);

let comp = null; const deadline = Date.now() + 15 * 60 * 1000; let errs = 0;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 5000));
  let res; try { res = await api("GET", `/api/project/${projectId}/compose?compositionId=${compositionId}`); }
  catch (e) { if (++errs > 40) fail(e.message); log("  poll transient:", e.message.slice(0, 80)); continue; }
  comp = res.composition; log("  status", comp?.status);
  if (comp?.status === "done") break;
  if (comp?.status === "failed") fail("composition failed");
}
if (comp?.status !== "done") fail(`did not finish (last=${comp?.status})`);

const masterPath = join(OUT, "housecheck-ad-master.mp4");
const bytes = await download(comp.url, masterPath);
const probe = await ffprobe(masterPath);
log("master:", JSON.stringify(probe), bytes, "bytes");
if (!probe.hasVideo || !probe.hasAudio) fail("master missing stream");

const qc = await api("POST", `/api/project/${projectId}/qc`, { compositionId });
await writeFile(join(OUT, "housecheck-qc.json"), JSON.stringify(qc, null, 2));
log("QC:", qc.status);

const credits = await api("GET", `/api/project/${projectId}/credits`);
await writeFile(join(OUT, "housecheck-credits.json"), JSON.stringify(credits, null, 2));
const md = await (await api("GET", `/api/project/${projectId}/credits?format=md&lang=en`, undefined, true)).text();
await writeFile(join(OUT, "housecheck-credits.md"), md);
log("credits: items", credits.items?.length, "needReview", credits.summary?.needsReview);

for (const [platform, name] of [["tiktok", "housecheck-ad-tiktok.mp4"], ["reels", "housecheck-ad-reels.mp4"]]) {
  const dest = join(OUT, name);
  try {
    const r = await api("POST", `/api/project/${projectId}/export-platform`, { platform });
    const sz = await download(r.url, dest); const p = await ffprobe(dest);
    log(`${platform}: ${sz} bytes ${p.width}x${p.height}`);
  } catch (e) { await copyFile(masterPath, dest); log(`${platform}: fallback to master (${e.message.slice(0, 80)})`); }
}

console.log(JSON.stringify({ projectId, compositionId, voice, master: probe, qc: qc.status }, null, 2));
