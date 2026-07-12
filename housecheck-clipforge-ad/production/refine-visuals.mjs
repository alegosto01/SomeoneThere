#!/usr/bin/env node
/**
 * refine-visuals.mjs — replace off-brand / empty shot footage with curated, on-theme
 * apartment / Madrid / video-call imagery, using ClipForge's free keyless stock search
 * (Openverse + Wikimedia). Persists per-shot as stock_footage so credits stay accurate.
 */
const BASE = (process.env.CLIPFORGE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const PID = process.env.PROJECT_ID;
if (!PID) { console.error("PROJECT_ID env required"); process.exit(1); }

// Ordered candidate queries per shot (first that returns footage wins). English for recall.
const SHOTS = {
  1: ["modern apartment living room interior", "apartment interior bright"],
  2: ["person using smartphone in cafe", "hand holding phone screen"],
  3: ["camera lens close up", "photographer wide angle lens"],
  4: ["apartment building entrance door", "residential building facade street"],
  5: ["woman video call laptop home", "video call laptop screen"],
  6: ["empty apartment kitchen interior", "apartment room window daylight"],
  7: ["checklist clipboard notes", "notebook writing checklist desk"],
  8: ["Madrid street city buildings", "Madrid old town street"],
  9: ["Madrid apartment building street", "Madrid city skyline street"],
};

async function searchDownload(shotId, query, mediaType) {
  const res = await fetch(`${BASE}/api/stock/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query, source: "all", mediaType, orientation: "portrait",
      perPage: 10, count: 1, download: true, projectId: PID, shotId,
    }),
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = { _raw: text }; }
  if (!res.ok) return { ok: false, status: res.status, err: (data.error || text).slice(0, 160) };
  const a = data.assets?.[0];
  return a ? { ok: true, provider: a.provider, license: a.license, author: a.author, media: a.mediaType, url: a.filePath } : { ok: false, err: "no asset" };
}

for (const [shotId, queries] of Object.entries(SHOTS)) {
  let done = null;
  for (const q of queries) {
    // try image (reliable for relevance); Openverse keyless is image-only
    const r = await searchDownload(Number(shotId), q, "image");
    if (r.ok) { done = { q, ...r }; break; }
    console.log(`  shot ${shotId} "${q}" -> ${r.err}`);
  }
  if (done) console.log(`shot ${shotId}: OK "${done.q}" [${done.provider}/${done.license}] ${done.media}`);
  else console.log(`shot ${shotId}: FAILED all queries (keeps existing asset)`);
}
console.log("refine done");
