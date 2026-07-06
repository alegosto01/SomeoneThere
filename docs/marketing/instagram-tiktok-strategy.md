# Instagram & TikTok Strategy for HouseCheck

> Research + implementation plan for AI-assisted, partly-automated social media.
> Audience: international students / Erasmus / expats moving to Madrid.
> Principle: **helpful content first, promotion second.** HouseCheck's wedge is trust; spammy automation destroys trust.

---

## 1. What actually works for this audience

Madrid-bound students/expats don't follow "rental scam" accounts — they follow Madrid life, Erasmus tips, and relocation accounts. The content strategy is **adjacency**: be useful about the move, and the scam check is the natural next step.

**Content pillars (rotate these):**
1. **Neighbourhood spotlights** — "Malasaña: what €900 actually gets you" (high search volume, evergreen).
2. **Red-flag teardowns** — real (anonymised) scam patterns: "the 'pay deposit before viewing' trick."
3. **Move-in checklists** — "Documents you need to rent in Madrid as a non-resident."
4. **Behind-the-scenes** — "How we verify a listing (permission-first)."
5. **Student/expat voices** — quick interviews or quotes.

---

## 2. Recommended AI tooling (best-in-class, as of 2026)

### Content generation
| Tool | Use | Why | Cost |
|---|---|---|---|
| **Claude / GPT-4** | Scripts, captions, carousel text | Best long-form reasoning; follow HouseCheck language rules (no guarantees) | ~$20/mo |
| **ElevenLabs** | Voiceover (TTS) for faceless videos | Natural Spanish + English voices; consistent brand voice | ~$5–22/mo |
| **HeyGen / Synthesia** | AI avatar presenter | Good for "explainer" style without showing your face | ~$30–90/mo |

### Video creation / editing
| Tool | Use | Why | Cost |
|---|---|---|---|
| **CapCut** | Editing + auto-captions | Free, dominant on TikTok/Reels, great templates | Free / Pro ~$10/mo |
| **Opus Clip / Vizard** | Long → short clipping | Turn a 5-min YouTube explainer into 10 TikToks | ~$19/mo |
| **Runway / Pika** | B-roll generation | Generate Madrid street visuals without filming | ~$15/mo |
| **Descript** | Podcast/interview → social cuts | Edit by transcript; great for interview content | ~$12/mo |

### Scheduling & automation
| Tool | Use | Why | Cost |
|---|---|---|---|
| **Metricool / Buffer** | Cross-post IG + TikTok + schedule | Metricool is Spain-based; good EU compliance | Free / ~$18/mo |
| **ManyChat** | IG/WhatsApp auto-DM | "Comment 'MADRID' and get the checklist" → auto-DM the lead magnet | Free / ~$15/mo |
| **Make / n8n** | Backend automation | New form submission → notify → draft content pipeline | Free / ~$9/mo |
| **Zapier** | Simpler glue | Form → CRM → welcome email | ~$20/mo |

### Analytics & listening
| Tool | Use | Why |
|---|---|---|
| **TikTok Creative Center** | Trending sounds/topics (free) | Native; essential for timing |
| **Meta Business Suite** | IG scheduling + insights (free) | Native scheduling is now decent |
| **AnswerThePublic / Google Trends** | What students search | "rent Madrid without NIE," "Idealista scam" |

---

## 3. The realistic, low-cost automation stack (recommended for pilot)

**Don't over-automate.** For the pilot (first 1–3 months), run a **semi-automated loop** that still has a human approve every post. HouseCheck's whole wedge is trust — AI-generated slop will kill it.

### Stack (≈$50–80/mo total)
1. **Content generation:** Claude/GPT for scripts (house rules: hedged language, no guarantees).
2. **Voice/video:** ElevenLabs voiceover + CapCut editing + stock/Runway b-roll.
3. **Scheduling:** Metricool (cross-post IG + TikTok, Spain-based).
4. **Lead capture:** ManyChat (comment-trigger → auto-DM the "Madrid rental red flags" PDF → link to `web/landing.html`).
5. **Backend:** Make.com (form submission → Telegram/email alert → add to a Google Sheet "leads").
6. **Human gate:** Nothing publishes or DMs without a 30-second human review.

### Workflow (weekly, ~2–3h/week)
1. Pick 3 topics from the content pillars + trending TikTok sounds.
2. Claude drafts 3 scripts (60–90s each, hook in first 2s).
3. ElevenLabs generates voiceover; CapCut assembles with b-roll + captions (Spanish + English subtitles).
4. Schedule via Metricool: 3 Reels + 3 TikToks/week.
5. ManyChat auto-DMs anyone who comments the trigger word.
6. Review DMs + leads in the sheet; reply personally within 24h.

---

## 4. Compliance & safety rules for social

HouseCheck's product principles apply to marketing too:
- **No "guaranteed safe," "scam-proof," "verified," "legally verified," "certified."** Use "evidence and risk indicators."
- **No urgency cues** that mirror scam tactics ("act now!"). The fairness principle (R030) governs here.
- **Anonymise** any real listing/landlord in examples. Never show a real address or name.
- **Disclose AI** where required (some jurisdictions require labelling synthetic media; good practice always).
- **Privacy:** comments/DMs that include a listing URL = personal data. Do not auto-process into a report; route to the manual intake (`request-lifecycle.md`).

---

## 5. Account setup checklist

### Instagram
- [ ] Username: `@housecheck.madrid` (or `@housecheck_es`).
- [ ] Bio: one line of value ("Rental listing checks for Madrid · Evidence, not guarantees") + link to landing page.
- [ ] Link-in-bio: use the landing page URL (`web/landing.html` once hosted).
- [ ] Business account (for insights + ManyChat).
- [ ] Highlights: "Red flags," "Neighbourhoods," "How it works," "FAQ."

### TikTok
- [ ] Username: same as IG for consistency.
- [ ] Bio: short + link (TikTok allows links with a Business account ≥ 1000 followers; until then, point to IG bio).
- [ ] Switch to Business account for analytics + Commercial Music Library.
- [ ] Content language: Spanish primary (local discovery), English subtitles (expat reach).

---

## 6. Honest expectations

- **First 30 days:** low views. TikTok's algorithm needs data. Post 3x/week minimum; consistency beats quality at the start.
- **Realistic pilot KPIs:** not "followers" but **leads** (DMs/comments that become intake submissions). Target: 5–10 leads/week after month 2.
- **The wedge that works on social is not "scam detection" — it's "we help you not get ripped off in Madrid."** Lead with relocation value; the check is the monetisation.
- **Kill signal:** if after 8 weeks of consistent posting + ManyChat the cost-per-lead exceeds the Basic package margin, pause paid tools and go organic-only.

---

## 7. What I would build next (if you approve)

1. **Lead magnet PDF** — "Madrid Rental Red Flags: 10 things to check before paying a deposit" (lawyer-reviewed language). Host on the landing page.
2. **ManyChat flow** — comment trigger → auto-DM the PDF + landing link.
3. **3 sample scripts** (Claude-drafted, compliant) — one per pillar, ready to film.
4. **Weekly automation Make.com scenario** — schedule posts + collect leads into a sheet.

All of these respect the decision queue in `FOUNDER_DECISIONS.md` — I won't claim guarantees or use urgency cues.