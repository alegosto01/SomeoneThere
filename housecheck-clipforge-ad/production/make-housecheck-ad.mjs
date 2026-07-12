#!/usr/bin/env node
/**
 * make-housecheck-ad.mjs — HouseCheck "The Wide-Angle Lens Deserves an Oscar" ad.
 *
 * Bring-your-own-script ClipForge pipeline (NO LLM key used):
 *   create project -> import narration -> stock-fill -> pick free Edge TTS voice
 *   -> compose (9:16 HD, karaoke subs, ducked free BGM, AI disclosure, CTA)
 *   -> poll -> download master -> QC -> credits -> platform exports -> summary.
 *
 * Standard Node.js APIs only (global fetch, fs, child_process). Node 20+.
 */
import { mkdir, writeFile, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = join(ROOT, "output");
const SCRIPT_TXT = join(__dirname, "housecheck-script.txt");

const BASE = (process.env.CLIPFORGE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const NARRATION = (await import("node:fs/promises")).readFile(SCRIPT_TXT, "utf8");

const log = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);
const fail = (msg) => { console.error("FATAL:", msg); process.exit(1); };

async function api(method, path, body, { raw = false } = {}) {
  const url = path.startsWith("http") ? path : BASE + path;
  const opts = { method, headers: {} };
  if (body !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  if (raw) {
    if (!res.ok) { const t = await res.text().catch(() => ""); throw new Error(`${method} ${path} -> HTTP ${res.status}: ${t.slice(0, 500)}`); }
    return res;
  }
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : {}; } catch { data = { _raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} -> HTTP ${res.status}: ${text.slice(0, 800)}`);
  return data;
}

function resolveUrl(u) {
  if (!u) return null;
  return u.startsWith("http") ? u : BASE + u;
}

async function download(url, dest) {
  const res = await fetch(resolveUrl(url));
  if (!res.ok) throw new Error(`download ${url} -> HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  const s = await stat(dest);
  if (s.size < 1000) throw new Error(`downloaded file ${dest} is suspiciously small (${s.size} bytes)`);
  return s.size;
}

async function ffprobe(file) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "error", "-print_format", "json",
      "-show_format", "-show_streams", file,
    ], { maxBuffer: 20 * 1024 * 1024 });
    const j = JSON.parse(stdout);
    const v = (j.streams || []).find((s) => s.codec_type === "video");
    const a = (j.streams || []).find((s) => s.codec_type === "audio");
    return {
      duration: parseFloat(j.format?.duration || "0"),
      width: v?.width, height: v?.height,
      hasVideo: !!v, hasAudio: !!a,
      vcodec: v?.codec_name, acodec: a?.codec_name,
    };
  } catch (e) { return { error: String(e) }; }
}

// ---- main ----
const summary = { steps: [], warnings: [], fallbacks: [] };
const narrationText = (await NARRATION).trim();

await mkdir(OUT, { recursive: true });

// 1. connectivity
log("Testing connectivity:", BASE);
try { await api("GET", "/api/project"); } catch (e) { fail(`ClipForge not reachable at ${BASE}: ${e.message}`); }
summary.baseUrl = BASE;

// 2. create project
log("Creating project...");
const project = await api("POST", "/api/project", {
  name: "HouseCheck — Wide-Angle Oscar Ad",
  productName: "HouseCheck",
  productCategory: "other",
  productDescription: "Remote Madrid rental viewing with a trusted local verifier and live client video call before sending a deposit.",
  productImages: [],
  videoMode: "graphic_montage",
});
const projectId = project.id;
if (!projectId) fail("No project id returned");
summary.projectId = projectId;
log("projectId =", projectId);

// 3. import script
log("Importing narration...");
const imported = await api("POST", `/api/project/${projectId}/import-script`, {
  title: "The Wide-Angle Lens Deserves an Oscar",
  script: narrationText,
});
if (!imported.shots || imported.shots < 2) fail(`Expected multiple shots, got ${imported.shots}`);
summary.shots = imported.shots;
summary.totalDurationScript = imported.totalDuration;
log(`Imported: ${imported.shots} shots, est ${imported.totalDuration}s`);

// 4. stock-fill.
// NOTE: never use force — force refills every shot and can overwrite good video assets.
// Each non-force call only targets shots that still lack an asset (server skips filled ones).
// Cumulative fill is the count of distinct shots with a persisted asset, read from /assets.
async function stockFill(bodyExtra) {
  return api("POST", `/api/project/${projectId}/stock-fill`, { source: "all", apiKeys: {}, force: false, ...bodyExtra });
}
async function filledShotCount() {
  const rows = await api("GET", `/api/project/${projectId}/assets`);
  return new Set((rows || []).filter((r) => r.filePath).map((r) => r.shotId)).size;
}
log("Stock-fill (auto: video first, image fallback)...");
let fill = await stockFill({ mediaType: "auto" });
let cumFilled = await filledShotCount();
const total = fill.total;
log(`cumulative filled ${cumFilled}/${total} (call reported ${fill.filled} new)`);
// Top up remaining shots with image-only passes until no further progress (max 3 passes).
for (let pass = 0; pass < 3 && cumFilled < total; pass++) {
  const r = await stockFill({ mediaType: "image" });
  const now = await filledShotCount();
  log(`  image pass ${pass + 1}: +${now - cumFilled} -> ${now}/${total}`);
  if (now <= cumFilled) break;
  cumFilled = now;
  fill = r;
}
summary.total = total;
summary.filled = cumFilled;
summary.stockFillCallReported = fill.filled;
summary.fillResults = fill.results;
if (cumFilled === 0) fail("No scenes filled with footage — refusing to produce a blank video");
if (cumFilled < total) summary.warnings.push(`Only ${cumFilled}/${total} scenes filled with stock footage; remaining shots reuse the first available asset during compose.`);

// 5. select voice
log("Fetching free TTS voices...");
const voices = await api("GET", "/api/tts/free");
const list = (voices.voices || []).map((v) => (typeof v === "string" ? v : v.value));
let voice = list.includes("en-GB-SoniaNeural") ? "en-GB-SoniaNeural"
  : list.includes("en-US-AriaNeural") ? "en-US-AriaNeural"
  : (list.find((v) => /^en-/i.test(v)) || voices.default);
if (!voice) fail("No suitable English Edge TTS voice available");
summary.voice = voice;
log("Selected voice:", voice);

// 6. compose
log("Starting composition...");
const compose = await api("POST", `/api/project/${projectId}/compose`, {
  freeTts: { enabled: true, voice },
  aspectRatio: "9:16",
  renderPreset: "hd",
  freeBgm: true,
  bgmMood: "upbeat",
  bgmDuck: true,
  karaoke: true,
  aiDisclosure: true,
  disclosureText: "AI-generated · Ad",
  ctaText: "Visit a Madrid rental remotely before sending a deposit.",
});
const compositionId = compose.compositionId;
if (!compositionId) fail(`No compositionId returned: ${JSON.stringify(compose)}`);
summary.compositionId = compositionId;
log("compositionId =", compositionId, "status:", compose.status);

// 7. poll
log("Polling composition...");
let comp = null;
const deadline = Date.now() + 15 * 60 * 1000;
let netErrs = 0;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 5000));
  let res;
  try {
    res = await api("GET", `/api/project/${projectId}/compose?compositionId=${compositionId}`);
  } catch (e) {
    netErrs++;
    log(`  poll transient error (${netErrs}): ${e.message.slice(0, 120)}`);
    if (netErrs > 40) fail(`Too many polling errors: ${e.message}`);
    continue;
  }
  comp = res.composition;
  const st = comp?.status;
  process.stdout.write(`  status=${st}\n`);
  if (st === "done") break;
  if (st === "failed") fail(`Composition ${compositionId} failed. Check logs/clipforge.log`);
}
if (!comp || comp.status !== "done") fail(`Composition did not finish in time (last status=${comp?.status})`);
summary.compositionUrl = comp.url;
summary.compositionResolution = comp.resolution;
summary.compositionAspect = comp.aspectRatio;
if (comp.duration) summary.compositionDurationSec = comp.duration / 1000;

// 8. download master
const masterPath = join(OUT, "housecheck-ad-master.mp4");
log("Downloading master ->", masterPath);
const masterSize = await download(comp.url, masterPath);
const probe = await ffprobe(masterPath);
summary.master = { path: masterPath, bytes: masterSize, probe };
log("master:", JSON.stringify(probe));
if (!probe.hasVideo) fail("Master has no video stream");
if (!probe.hasAudio) summary.warnings.push("Master appears to have no audio stream");
if (probe.width && probe.height && probe.height <= probe.width) summary.warnings.push(`Master is not portrait: ${probe.width}x${probe.height}`);

// 9. QC
log("Running ClipForge QC...");
let qc;
try {
  qc = await api("POST", `/api/project/${projectId}/qc`, { compositionId });
  await writeFile(join(OUT, "housecheck-qc.json"), JSON.stringify(qc, null, 2));
  summary.qc = qc;
  log("QC:", JSON.stringify(qc.pass ?? qc.ok ?? qc.status ?? qc));
} catch (e) {
  summary.warnings.push(`QC request error: ${e.message}`);
  await writeFile(join(OUT, "housecheck-qc.json"), JSON.stringify({ error: e.message }, null, 2));
}

// 10. credits
log("Fetching credits...");
try {
  const credits = await api("GET", `/api/project/${projectId}/credits`);
  await writeFile(join(OUT, "housecheck-credits.json"), JSON.stringify(credits, null, 2));
  summary.credits = credits;
} catch (e) { summary.warnings.push(`Credits JSON error: ${e.message}`); }
try {
  const mdRes = await api("GET", `/api/project/${projectId}/credits?format=md&lang=en`, undefined, { raw: true });
  const md = await mdRes.text();
  await writeFile(join(OUT, "housecheck-credits.md"), md);
} catch (e) { summary.warnings.push(`Credits MD error: ${e.message}`); }

// 11. platform exports
async function exportPlatform(platform, destName) {
  const dest = join(OUT, destName);
  try {
    const r = await api("POST", `/api/project/${projectId}/export-platform`, { platform });
    if (!r.url) throw new Error(`no url: ${JSON.stringify(r)}`);
    const size = await download(r.url, dest);
    const p = await ffprobe(dest);
    log(`${platform} export -> ${dest} (${size} bytes) ${p.width}x${p.height}`);
    return { platform, path: dest, bytes: size, probe: p, report: r.report ?? null, size_label: r.size };
  } catch (e) {
    log(`${platform} export failed (${e.message}); using master as platform-ready fallback`);
    await copyFile(masterPath, dest);
    summary.fallbacks.push(`${platform}: platform export unavailable, copied validated 9:16 HD master to ${destName}`);
    return { platform, path: dest, fallback: true, error: e.message };
  }
}
log("Exporting platform versions...");
summary.tiktok = await exportPlatform("tiktok", "housecheck-ad-tiktok.mp4");
summary.reels = await exportPlatform("reels", "housecheck-ad-reels.mp4");

// 12. copy script into output
await copyFile(SCRIPT_TXT, join(OUT, "housecheck-script.txt"));

// 13. write summary JSON (human summary md is written by the shell wrapper)
await writeFile(join(OUT, "production-summary.json"), JSON.stringify(summary, null, 2));

log("DONE. Deliverables in", OUT);
console.log(JSON.stringify({
  projectId, compositionId, voice,
  filled: `${summary.filled}/${summary.total}`,
  master: summary.master?.probe,
  qcKeys: summary.qc ? Object.keys(summary.qc) : null,
}, null, 2));
