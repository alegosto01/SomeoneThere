# Technical Architecture

## Recommendation

Do not start with a complex marketplace app. Start with a lightweight web product and manual operations.

## Phase 0 — No-code/manual validation

Tools:

- Landing page: Framer, Webflow, Carrd, or Next.js
- Intake form: Tally, Typeform, Google Forms, or custom form
- Database: Airtable, Notion, Google Sheets, or Supabase
- Communication: Email + WhatsApp
- Payment: Stripe Payment Links or manual transfer
- Reports: Google Docs / Notion / PDF template

Goal: validate demand and operations before building the full system.

## Phase 1 — Lightweight custom MVP

Suggested stack:

- Frontend: Next.js
- Backend: Next.js API routes or FastAPI
- Database: PostgreSQL / Supabase
- Auth: Supabase Auth / Clerk / NextAuth
- Storage: Supabase Storage / S3
- Payments: Stripe
- Maps: Google Maps API or Mapbox
- Notifications: Email + WhatsApp integration later

## Core data models

### User

- id
- name
- email
- phone
- role: customer / verifier / admin
- created_at

### VerificationRequest

- id
- user_id
- listing_url
- claimed_address
- city
- neighborhood
- package_type
- status
- urgency
- notes
- created_at

### VerificationJob

- id
- request_id
- verifier_id
- scheduled_at
- payout_amount
- status
- accepted_at
- completed_at

### VerificationReport

- id
- request_id
- verifier_id
- recommendation
- risk_score
- summary
- red_flags
- evidence_urls
- admin_review_status
- delivered_at

## Future marketplace features

Build only after demand is proven:

- Verifier matching
- Verifier ratings
- In-app chat
- Dynamic pricing
- Live tracking
- Automated payouts
- Dispute handling
- Fraud/risk scoring
- Mobile verifier app

