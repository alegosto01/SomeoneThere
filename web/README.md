# SomeoneThere website

Single-page landing site for validating the SomeoneThere MVP: a trusted local verifier attends a Madrid rental viewing while the client joins by live video call.

The page explains the service, what the verifier looks at, where the service stops, and links to an external pilot request form. It is a marketing page only — there is **no backend, database, account system, payment, analytics, or tracking**, and it stores nothing in the browser.

Stack: Vite + React + TypeScript + plain CSS. No UI library.

## Run it

```bash
cd web
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the built dist/ locally
```

Node 20.19+ or 22+ is recommended (Vite 6 also runs on earlier Node 20).

## Update the links

All external links live in [src/config.ts](src/config.ts):

| Constant | Current placeholder | Replace with |
| --- | --- | --- |
| `pilotFormUrl` | `https://forms.gle/REPLACE_ME` | The real pilot request form (Google Forms, Tally, etc.) |
| `contactEmail` | `hello@someonethere.example` | The real contact inbox |
| `whatsappUrl` | `https://wa.me/REPLACE_ME` | `https://wa.me/<number in international format>` |
| `privacyUrl` | `#privacy-placeholder` | Privacy notice URL |
| `termsUrl` | `#terms-placeholder` | Terms URL |

Page copy lives in [src/content.ts](src/content.ts), separate from layout, so wording can be reviewed against `docs/mvp-scope.md`, `docs/remote-viewing-checklist.md`, and `docs/product/landing-page-outline.md` without reading component code.

## Deploy on Vercel

1. Import the repository in Vercel.
2. Set **Root Directory** to `web`.
3. Framework preset: **Vite** (build command `npm run build`, output directory `dist`).
4. Deploy. No environment variables and no server-side runtime are needed.

Any static host works the same way — build and serve `web/dist`.

## Still placeholder / undecided

- Pilot form, contact email, WhatsApp number, privacy and terms pages (see table above).
- Favicon in `public/favicon.svg` is a plain placeholder mark, not final branding.
- No price is shown anywhere: pricing is not decided yet (`docs/mvp-scope.md` treats it as a hypothesis to test after dry runs).
- No availability dates, capacity numbers, testimonials, or statistics are claimed, because none are supported by the repo docs yet.
- No social preview image; Open Graph metadata is text-only for now.
- What happens when a viewing falls through is described in general terms only — the pilot refund/handling policy is still a draft (`docs/legal/refund-policy-draft.md`).
