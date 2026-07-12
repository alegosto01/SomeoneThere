# HouseCheck ad — production summary

**Concept:** "The Wide-Angle Lens Deserves an Oscar" — a funny, fast-paced, faceless social ad.
It moves from the anxiety of trusting suspiciously perfect listing photos to the practical HouseCheck
solution (a trusted local verifier attends the Madrid viewing while the client joins by live video call).

## Environment
- **Date:** 2026-07-12 (local, Europe/Madrid)
- **OS:** Ubuntu 22.04 (Linux 6.8.0), x86_64
- **Node.js:** v20.12.1
- **pnpm:** 10.33.0 (via Corepack — no global install permission)
- **ffmpeg/ffprobe:** 4.4.2 (system)
- **Docker:** not installed → used the source-code fallback

## ClipForge
- **Version:** 0.8.43
- **Commit:** `f0b1160667017e28d19a6262171ab0a6bf67e623`
- **Startup method:** source (Docker unavailable). `next dev`/Turbopack hit the OS inotify
  watch limit (65536, not raisable without root), so the app was built one-shot with
  **`next build --webpack`** and served with **`next start`**.
- **Base URL:** http://localhost:3000 (port 3000 was free)
- **Repository copy:** `housecheck-clipforge-ad/clipforge/`

## Workflow (bring-your-own-script — NO LLM key used)
Create blank project → import narration → free stock-fill → free Edge TTS voice → compose
(9:16 HD, karaoke subs, ducked free BGM, AI disclosure, CTA) → poll → download → QC →
credits → platform exports. No OpenAI/OpenRouter/Atlas/DeepSeek/image/video keys were requested;
`clipforge_create_video` was not used.

## Result
- **Project ID:** `ad3f1d5e-31d5-419a-bc22-6a83c7d27416`
- **Final composition ID:** `d7805dc1-3bcb-4ebd-be78-5324bbfe7ebf`
- **Voice:** `en-GB-SoniaNeural` (first preference; confirmed present in `/api/tts/free`)
- **Scenes:** 9 (one per narration sentence)
- **Scenes filled with footage:** 9 / 9
- **Duration:** 40.1 s (brief target "approximately 28–40 s"; sits at the top of the range — driven
  by the fixed narration length at the selected TTS rate)
- **Resolution / aspect:** 1080 × 1920, 9:16, HD preset (h264 video + aac audio)
- **Background music:** "Upbeat Forever" — Kevin MacLeod (CC BY 3.0), auto-selected free CC track,
  mixed at low volume with ducking enabled (`bgmVolume 0.18`, `bgmDuck: true`)
- **Subtitles:** karaoke word-highlight (burned via libass)
- **AI disclosure:** on-screen "AI-generated · Ad" (top, full duration; English via `disclosureText`)
- **End CTA (exact):** "Visit a Madrid rental remotely before sending a deposit."
- **Safety disclaimer (in narration):** "HouseCheck does not guarantee safety. We are your eyes and ears in Madrid."

## QC status
**PASS ("ok")** — all 8 checks OK: video-stream (1080×1920), audio-stream, duration (30.2→40.1 s),
resolution matches, no black frames, no abnormal silence, loudness OK (−14.2 LUFS), no frozen picture.
- **QC warnings:** none.
- Full report: `output/housecheck-qc.json`.

## Deliverables (verified present, non-empty, portrait, video+audio)
| File | Path | Notes |
|---|---|---|
| Master | `output/housecheck-ad-master.mp4` | 1080×1920, 40.1 s, ~15 MB |
| TikTok | `output/housecheck-ad-tiktok.mp4` | 1080×1920 blur-pad export, ~11 MB |
| Reels | `output/housecheck-ad-reels.mp4` | 1080×1920 blur-pad export, ~10 MB |
| Script | `output/housecheck-script.txt` | exact narration |
| QC | `output/housecheck-qc.json` | ClipForge QC report |
| Credits (JSON) | `output/housecheck-credits.json` | asset licence manifest (+ BGM added) |
| Credits (MD) | `output/housecheck-credits.md` | paste-ready attributions (+ BGM added) |
| Summary | `output/production-summary.md` | this file |

Production scripts: `production/make-housecheck-ad.mjs` (full pipeline),
`production/refine-visuals.mjs` (per-shot curated footage), `production/finalize.mjs` (recompose).
Server log: `logs/clipforge.log`.

## Licensing review
- **9 visual assets:** all commercially usable. **0 need manual review.** `commercialSafe: true`.
  **7 require attribution** (CC BY / CC BY-SA); 2 are CC0/public-domain. Paste-ready attribution
  lines are in `housecheck-credits.md`.
- **Background music:** "Upbeat Forever" by **Kevin MacLeod, CC BY 3.0 — attribution REQUIRED.**
  ⚠️ ClipForge's `/credits` endpoint does **not** list the BGM (it never persists
  `compositions.bgmPath`), so the BGM attribution was **added manually** to both credits files.
  Publishers MUST include this line in the caption/description alongside the visual attributions.
- **Action required before publishing:** include every attribution line from `housecheck-credits.md`
  (6 visual authors + Kevin MacLeod for the music) in the post caption/description.

## Platform exports
Real platform exports succeeded (not fallbacks): `POST /api/project/{id}/export-platform` with
`tiktok` (TikTok Shop spec, 1080×1920, ≤8000 kbps) and `reels` (Instagram Reels, 1080×1920, ≤5000 kbps),
both re-encoded with blur-pad and downloaded locally.

## Fallbacks & deviations (honest record)
1. **Docker → source build.** Docker not installed; ran from source.
2. **Turbopack → webpack.** `next dev` and the default Turbopack build both crashed on the OS
   inotify watch limit (unraisable without root). Built with `next build --webpack` + `next start`.
3. **BGM query patch.** The stock "upbeat" mood mapped to a phrase Wikimedia Commons returns 0 hits
   for (BGM silently absent). Edited `src/lib/free-bgm.ts` so mood queries use phrases that actually
   return commercially-usable CC audio (`upbeat` → "upbeat music") + an "ambient background music"
   fallback, then rebuilt. Result: a genuinely upbeat CC-BY track is now included and ducked.
4. **Curated per-shot footage.** ClipForge's keyword auto-matcher produced literal collisions
   (Hurricane "Oscar" for the Oscar line; a mineral "deposit"; a leopard for "camera close-up") and
   left 2 shots empty (which were being silently dropped from the render, including the safety-
   disclaimer shot). Replaced/filled all 9 shots with on-theme, cleanly-licensed footage
   (apartment interiors, camera-on-tripod, video-call, checklist, Madrid skyline) via the free
   `/api/stock/search` endpoint, avoiding all ND/NC licences. All narration sentences now render.
5. **English AI disclosure.** Default disclosure label is Chinese; overrode with `disclosureText`.

## Limitations observed
- Duration is 40.1 s — the very top of the requested "~28–40 s" band; it cannot be shortened without
  cutting narration.
- The master keeps thin letterbox bars on landscape stills; the TikTok/Reels exports fill the frame
  with blur-pad, so the uploaded versions are edge-to-edge.
- Free stock is interpretive, not literal: e.g. the "Oscar/lens" shot is a photographer-and-tripod
  silhouette rather than a physical award statue. Meaning is preserved per the brief's guidance.
- Brand-safety guardrails respected: no "scam-proof"/"100% safe"/guarantee claims; the verifier is
  never shown entering without permission, secretly recording, confronting a landlord, or handling
  money/keys/contracts. No product card, cart CTA, QR code, fake testimonial, or watermark.
