# SomeoneThere Mobile App — Build Specification

**Version:** 0.1  
**Date:** 2026-08-19  
**Platform:** Android first, iOS-ready  
**Project:** SomeoneThere  
**Previous project name:** HouseCheck  

---

# 1. Objective

Build the first mobile application for **SomeoneThere**.

SomeoneThere is a Madrid-first service that allows a customer who cannot physically attend a rental-property viewing to send a trusted local verifier in their place.

The customer:

1. Finds a rental listing independently.
2. Submits the listing to SomeoneThere.
3. Requests a viewing.
4. Selects what they want checked.
5. Pays for the service.
6. Gets matched with a local verifier.
7. Joins the viewing remotely through a live video call.
8. Receives a structured post-visit report.

The core promise is:

> **See the place before you send the deposit.**

Secondary brand line:

> **When you can't be there, SomeoneThere can.**

This application is **not** a rental marketplace.

Users bring their own listings from sources such as Idealista, Facebook, WhatsApp, real-estate agencies, or other websites.

---

# 2. Product principles

The app must feel:

- simple;
- trustworthy;
- human;
- calm;
- structured;
- modern;
- transparent.

The product should feel closer to a combination of:

- Airbnb;
- Uber;
- Revolut;

than to an industrial property-inspection tool.

The application should make the customer feel:

> “A real person is physically there for me, and I have a structured record of what they observed.”

Do not make the MVP feel like a complicated anti-fraud platform.

The core job is:

> **Remote viewing + structured observations.**

---

# 3. Recommended technical approach

Use a **cross-platform mobile architecture** even though Android launches first.

Recommended stack:

- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **Supabase**
  - Authentication
  - PostgreSQL
  - Storage
  - Realtime where useful
- **Stripe** for payments
- **Expo Notifications** for push notifications
- **Sentry** for crash/error monitoring

The same codebase should later support iOS.

Do not create Android-only business logic unless strictly necessary.

The backend should be the source of truth for:

- users;
- visits;
- verifier assignments;
- reports;
- booking status;
- payments;
- consent;
- uploaded media.

---

# 4. User roles

The application supports two main roles.

## 4.1 Customer

A person requesting a rental-property viewing.

Typical customers:

- Erasmus students;
- international students;
- expats;
- young professionals;
- remote workers;
- parents helping a child relocate;
- Spanish domestic movers who cannot attend a Madrid viewing.

## 4.2 Verifier

A trusted local person who attends the viewing physically.

Verifier responsibilities:

- review visit details;
- attend the property;
- confirm permissions;
- start the remote viewing;
- follow the viewing checklist;
- record structured observations;
- upload permitted photos;
- submit the final visit report.

## 4.3 Admin

No full admin mobile UI is required in v1.

Admin functions should initially be handled through:

- Supabase dashboard;
- simple internal web/admin tools later;
- direct database/admin operations during testing.

---

# 5. Authentication

Support:

- email + password;
- Google sign-in.

Optional later:

- Apple sign-in;
- phone authentication.

Each user record must contain a role:

```ts
type UserRole = "customer" | "verifier" | "admin";
```

After login, route the user to the appropriate experience based on role.

---

# 6. Customer navigation

Use four bottom navigation tabs:

1. **Home**
2. **Visits**
3. **Reports**
4. **Profile**

Example:

```text
Home      Visits      Reports      Profile
```

Do not add more tabs in the MVP.

---

# 7. Customer Home screen

The Home screen should immediately communicate the value proposition.

## Header

Display:

```text
SomeoneThere
Madrid
```

## Hero

Title:

> **See the place before you send the deposit.**

Subtitle:

> A trusted local attends your Madrid rental viewing while you join remotely.

Primary CTA:

> **Request a viewing**

## Active visit card

If the customer has an upcoming visit, display the nearest one.

Example:

```text
YOUR NEXT VISIT

Calle de Fuencarral 123
Tomorrow · 17:30

Verifier assigned ✓

View booking →
```

If there is no active visit:

```text
No upcoming visits.

Found a rental you want checked?
Request a viewing.
```

## Secondary action

Provide:

> How SomeoneThere works

This can open a simple informational page.

---

# 8. Request-a-viewing flow

This is the most important flow in the entire application.

Implement it as a multi-step wizard.

Use a progress indicator.

Example:

```text
1 Property
2 Viewing
3 Priorities
4 Preferences
5 Review
```

---

# 9. Step 1 — Property

Title:

> **Which property should we visit?**

Fields:

### Listing URL

```text
Paste the listing link
```

Optional.

Supported user behavior includes listings from:

- Idealista;
- Facebook;
- agency websites;
- WhatsApp;
- private listings;
- any other source.

Provide:

> I don't have a listing URL

### Address

Required when known.

Fields:

- street/address;
- city;
- postal code;
- neighborhood optional.

For v1:

- default city = Madrid;
- allow manual entry;
- no automatic address extraction required.

### Property type

Options:

- Room
- Studio
- Apartment
- Other

### Advertised monthly rent

Optional numeric field.

### Listing screenshots

Optional later.

Do not block the booking if listing parsing fails.

---

# 10. Step 2 — Viewing details

Title:

> **When is the viewing?**

Fields:

- date;
- time;
- expected duration;
- property contact name;
- property contact phone;
- property contact email;
- contact type.

Contact type:

- Landlord
- Agent
- Current tenant
- Other

Question:

> Has the property contact agreed that someone can attend on your behalf?

Options:

- Yes
- Not yet

If "Not yet":

Display informational message:

> SomeoneThere may need confirmation before the visit can proceed.

Do not claim that the booking is confirmed until access has been confirmed.

---

# 11. Step 3 — Customer priorities

Title:

> **What matters most to you?**

Allow customers to select multiple items.

Recommended checklist:

- Natural light
- Street noise
- Neighbor noise
- Bedroom size
- Storage space
- Signs of damp or mould
- Water pressure
- Drainage
- Heating
- Air conditioning
- Kitchen condition
- Bathroom condition
- Furniture
- Windows
- Mobile signal
- Building entrance
- Common areas
- Elevator
- Neighborhood surroundings
- Listing accuracy

Then provide:

```text
Anything else you want checked?
```

Free-text field.

Example:

> Please check whether the bedroom window faces the street and ask whether utilities are included.

Save these priorities to the visit.

---

# 12. Step 4 — Viewing preferences and privacy

Title:

> **How should the visit work?**

## Live call

Default:

```text
Live video call
✓ Yes
```

For the MVP, the actual live video should use an external service.

Supported initial options:

- Google Meet;
- WhatsApp;
- Zoom.

Do not build proprietary video infrastructure for v1.

The app should store a `live_call_url`.

CTA at visit time:

> Join live viewing

## Recording

Default:

```text
Save video recording
○ No — recommended
○ Yes, if the property contact explicitly consents
```

No recording should happen by default.

## Photos

Option:

```text
Take property photos
✓ If permitted during the viewing
```

## Privacy message

Display:

> SomeoneThere will never ask a verifier to secretly record a property. Photos or recordings may only be taken where permission has been obtained.

---

# 13. Step 5 — Review and payment

Show a complete booking summary.

Sections:

- Property
- Date and time
- Customer priorities
- Visit preferences
- Current service price
- Cancellation policy

Primary CTA:

> **Pay and request viewing**

Important:

Payment does not necessarily mean access is confirmed.

Possible state after payment:

> **Request received — confirming access**

---

# 14. Visit status model

Every visit must use a controlled status enum.

Recommended:

```ts
type VisitStatus =
  | "draft"
  | "payment_pending"
  | "request_received"
  | "access_pending"
  | "access_confirmed"
  | "verifier_pending"
  | "verifier_assigned"
  | "verifier_en_route"
  | "verifier_arrived"
  | "live"
  | "visit_completed"
  | "report_pending"
  | "report_ready"
  | "cancelled"
  | "access_failed"
  | "refunded";
```

Do not use arbitrary free-text status values.

---

# 15. Visit detail screen

The customer should see a clear status timeline.

Example:

```text
YOUR VIEWING

Calle de Fuencarral 123
Thursday · 17:30

✓ Booking received
✓ Access confirmed
✓ Verifier assigned
○ Verifier on the way
○ Viewing started
○ Report ready
```

Statuses that are not yet reached should be visually inactive.

---

# 16. Verifier profile card

Once assigned, show the customer the verifier.

Example:

```text
YOUR LOCAL VERIFIER

[Photo]

Lucía M.
Verified identity ✓
23 completed visits
4.9 ★

Languages
Spanish · English
```

MVP fields:

- first name;
- last-name initial;
- profile photo;
- verified identity boolean;
- languages;
- short biography;
- total completed visits;
- average rating.

Rating functionality can be added after the first pilot if needed.

Do not expose unnecessary personal verifier information.

---

# 17. Pre-visit screen

On the day of the viewing, provide a dedicated screen.

Example:

```text
Your viewing is today

17:30
Calle de Fuencarral 123

Lucía will attend for you.

YOUR PRIORITIES
✓ Natural light
✓ Noise
✓ Bedroom size
✓ Damp / mould

QUESTIONS
1. Are utilities included?
2. Who else lives here?
3. Is there a minimum stay?

[ Join live viewing ]
```

The join button should be disabled until the verifier/admin marks the live session ready.

---

# 18. Live call MVP

Do not implement in-app WebRTC for v1.

Instead:

1. Store a live call URL.
2. Show button:

```text
Join live viewing
```

3. Open the appropriate external application or browser.

The application should remain usable before and after the call.

Possible later version:

- embedded WebRTC;
- in-app checklist;
- live questions;
- recording with consent;
- real-time verifier/customer chat.

---

# 19. Customer Visits tab

Use two sections:

- Upcoming
- Completed

## Upcoming card example

```text
Calle de Toledo 44
22 Aug · 11:00

Access confirmed ✓
Verifier assigned ✓

View booking →
```

## Completed card example

```text
Calle de Atocha 81
16 Aug · Completed

Report ready ✓

Open report →
```

No advanced filtering is required in MVP.

---

# 20. Reports tab

Display all reports belonging to the customer.

Card fields:

- property address;
- visit date;
- report status;
- verifier;
- key result summary.

Example:

```text
Calle de Atocha 81
16 Aug 2026

Report ready ✓

No major listing discrepancies observed

Open report →
```

Do not summarize the property as "safe" or "verified safe".

Use neutral language.

---

# 21. Viewing report structure

The report is a core product feature.

Every report should contain:

## 21.1 Header

- address;
- date;
- start time;
- end time;
- verifier;
- visit ID;
- visit completion status.

Example:

```text
VIEWING REPORT

Calle de Fuencarral 123
19 August 2026 · 17:32

Verified visit ✓
```

"Verified visit" means the verifier completed the SomeoneThere workflow.

It does **not** mean the property itself is legally or financially verified.

---

# 22. Property-match section

Show whether the observed property appeared consistent with the submitted listing.

Allowed values:

```ts
type ListingMatch =
  | "consistent"
  | "minor_differences"
  | "major_differences"
  | "unable_to_determine";
```

UI labels:

- Appeared consistent
- Minor differences observed
- Major differences observed
- Unable to determine

Avoid:

- Scam
- Safe
- Certified
- Guaranteed legitimate

---

# 23. Observation categories

Each observation should support:

```ts
type ObservationRating =
  | "good"
  | "acceptable"
  | "concern"
  | "not_checked"
  | "not_applicable";
```

Possible categories:

- Natural light
- Street noise
- Internal noise
- Visible damp
- Visible mould
- Water pressure
- Drainage
- Storage
- Heating
- Air conditioning
- Windows
- Furniture
- Kitchen
- Bathroom
- Building entrance
- Common areas
- Elevator
- Mobile signal
- General cleanliness

Each field may contain:

- rating;
- optional verifier note;
- optional image.

---

# 24. Listing differences

Display structured differences.

Example:

```text
LISTING DIFFERENCES

• Bedroom appears smaller than photos suggest.
• Desk shown in the listing was not present.
• Living-room window faces an internal courtyard.
```

Verifier should enter factual observations.

Do not encourage legal conclusions.

---

# 25. Questions and answers

The verifier can record questions asked during the visit.

Example:

```text
QUESTIONS ANSWERED

Utilities included?
No.

Minimum stay?
12 months.

Current flatmates?
2.
```

Each answer should optionally include source:

```ts
type AnswerSource =
  | "landlord"
  | "agent"
  | "tenant"
  | "other";
```

Display:

> Reported by agent

where useful.

---

# 26. Areas not checked

Every report should explicitly show what could not be verified.

Example:

```text
AREAS NOT VERIFIED

• Storage room
• Roof terrace
• Heating system operation
```

This reduces ambiguity and false confidence.

---

# 27. Photos

Verifier may upload property photos only when permitted.

Display them inside the report.

Requirements:

- compress images before upload;
- strip unnecessary EXIF metadata if practical;
- secure storage;
- signed URLs;
- customer can only access media linked to their own visit.

Do not make stored media publicly accessible.

---

# 28. Report disclaimer

Every report must end with:

> **SomeoneThere provides observations made during the visit. This is not a certified property inspection, legal opinion, valuation, fraud guarantee, or recommendation to enter into a rental agreement.**

Also include:

> Conditions may change after the visit.

---

# 29. Verifier navigation

Verifier bottom navigation:

1. **Jobs**
2. **Visits**
3. **Earnings**
4. **Profile**

---

# 30. Verifier Jobs screen

Show:

- available assignments;
- assigned upcoming visits.

Initial MVP may skip open-market job bidding.

Admin may assign verifiers manually.

If assignments are manual, the Jobs tab can simply show:

```text
YOUR ASSIGNMENTS
```

Example:

```text
Today · 17:30

Calle de Fuencarral
Madrid

Estimated visit: 30 min
Payout: €XX

View visit →
```

---

# 31. Verifier visit preparation

Before attending, verifier sees:

- listing URL;
- address;
- date/time;
- property contact;
- customer priorities;
- customer questions;
- allowed media;
- live-call information;
- safety instructions.

---

# 32. Permission confirmation

Before the verifier starts the visit, show:

```text
READY TO START?

PROPERTY
Calle de Fuencarral 123

PROPERTY CONTACT
Carlos · Agent

CUSTOMER
Marco

PERMISSION
✓ Third-party attendance confirmed
✓ Live video allowed
○ Photos allowed
✕ Video recording

SAFETY
✓ Visit status shared with SomeoneThere

[ Check in at property ]
```

The verifier must not proceed with recording where permission is missing.

---

# 33. Verifier check-in

When verifier selects:

> Check in at property

Store:

- timestamp;
- visit ID;
- verifier ID.

Optional later:

- coarse GPS confirmation.

Do not require precise continuous location tracking in MVP.

Possible event:

```json
{
  "type": "verifier_arrived",
  "timestamp": "2026-08-19T17:28:00+02:00"
}
```

Customer status updates to:

> Verifier arrived

---

# 34. Verifier live-viewing workflow

During the visit, verifier should see:

- customer priorities;
- standard checklist;
- questions;
- live call button;
- note fields.

Suggested workflow:

```text
1. Confirm permission
2. Check in
3. Start live call
4. Walk through property
5. Complete checklist
6. Ask customer questions
7. Capture permitted photos
8. Finish live call
9. Check out
10. Submit report
```

---

# 35. Verifier checklist

The checklist should be structured but quick.

Categories:

## Bedroom / room

- size impression;
- window;
- natural light;
- storage;
- furniture;
- plugs;
- visible damp;
- visible mould;
- noise.

## Bathroom

- condition;
- water pressure;
- drainage;
- ventilation;
- visible moisture.

## Kitchen

- appliances;
- storage;
- visible cleanliness;
- general condition.

## Property

- heating;
- air conditioning;
- windows;
- common areas;
- number of rooms where relevant.

## Building

- entrance;
- elevator;
- hallway;
- visible building condition.

## Surroundings

- street noise;
- street environment;
- nearby transport observation where relevant.

Do not make verifier guess technical conditions they cannot inspect.

---

# 36. Verifier check-out

Button:

> Finish visit

Store:

- timestamp;
- visit duration.

Status becomes:

```text
visit_completed
```

Then verifier is taken to:

> Complete report

---

# 37. Report submission

Verifier cannot submit an empty report.

Minimum required:

- listing match status;
- observations for required checklist items;
- areas not checked;
- verifier summary.

After submission:

Status becomes:

```text
report_ready
```

Customer receives a push notification.

---

# 38. Customer notification events

Implement push notifications for:

- booking received;
- access confirmed;
- verifier assigned;
- verifier on the way;
- verifier arrived;
- live viewing ready;
- viewing completed;
- report ready;
- visit cancelled;
- access failed;
- refund issued.

Example:

```text
Your SomeoneThere report is ready

The viewing at Calle de Atocha 81 has been completed.
```

---

# 39. Cancellation and failed access

Support:

```ts
type CancellationReason =
  | "customer_cancelled"
  | "property_contact_cancelled"
  | "verifier_cancelled"
  | "access_denied"
  | "no_show"
  | "other";
```

Do not hardcode commercial refund rules into the UI architecture.

Refund logic should be configurable from the backend/admin side.

Customer screen should clearly distinguish:

- cancelled;
- failed access;
- refunded;
- partially refunded if implemented later.

---

# 40. Profile screen — Customer

Sections:

## Account

- name;
- email;
- phone;
- preferred language.

## Payments

- payment method management through Stripe.

## Notifications

- push notification settings.

## Support

- Contact SomeoneThere
- FAQ

## Legal

- Privacy Policy
- Terms
- Service limitations

## Account

- Sign out
- Delete account

---

# 41. Profile screen — Verifier

Sections:

- profile photo;
- name;
- languages;
- short bio;
- identity verified status;
- completed visits;
- rating;
- payout details;
- support;
- safety information;
- sign out.

---

# 42. Data model

Recommended primary tables.

---

## 42.1 `profiles`

```sql
id uuid primary key
role text
first_name text
last_name text
email text
phone text
avatar_url text
preferred_language text
created_at timestamptz
updated_at timestamptz
```

---

## 42.2 `verifier_profiles`

```sql
user_id uuid primary key
bio text
identity_verified boolean
languages text[]
completed_visits integer
average_rating numeric
active boolean
created_at timestamptz
updated_at timestamptz
```

---

## 42.3 `properties`

```sql
id uuid primary key
customer_id uuid
listing_url text
address_line text
city text
postal_code text
neighborhood text
property_type text
advertised_rent numeric
created_at timestamptz
updated_at timestamptz
```

---

## 42.4 `visits`

```sql
id uuid primary key
customer_id uuid
property_id uuid
verifier_id uuid null
scheduled_at timestamptz
expected_duration_minutes integer
status text
live_call_url text null
live_call_provider text null
recording_requested boolean
recording_allowed boolean
photos_requested boolean
photos_allowed boolean
access_confirmed boolean
customer_notes text
created_at timestamptz
updated_at timestamptz
```

---

## 42.5 `property_contacts`

```sql
id uuid primary key
visit_id uuid
name text
contact_type text
phone text
email text
created_at timestamptz
```

---

## 42.6 `visit_priorities`

```sql
id uuid primary key
visit_id uuid
priority_key text
selected boolean
customer_note text null
```

---

## 42.7 `visit_events`

Used to build the timeline.

```sql
id uuid primary key
visit_id uuid
event_type text
actor_id uuid null
metadata jsonb
created_at timestamptz
```

Example events:

```text
booking_received
access_confirmed
verifier_assigned
verifier_en_route
verifier_arrived
live_started
live_ended
visit_completed
report_ready
```

---

## 42.8 `reports`

```sql
id uuid primary key
visit_id uuid unique
listing_match text
verifier_summary text
submitted_at timestamptz
created_at timestamptz
updated_at timestamptz
```

---

## 42.9 `report_observations`

```sql
id uuid primary key
report_id uuid
category text
rating text
note text null
sort_order integer
```

---

## 42.10 `report_differences`

```sql
id uuid primary key
report_id uuid
description text
severity text null
```

---

## 42.11 `report_questions`

```sql
id uuid primary key
report_id uuid
question text
answer text
answer_source text
```

---

## 42.12 `report_unchecked_areas`

```sql
id uuid primary key
report_id uuid
description text
```

---

## 42.13 `report_media`

```sql
id uuid primary key
report_id uuid
storage_path text
media_type text
caption text null
created_at timestamptz
```

---

## 42.14 `payments`

```sql
id uuid primary key
visit_id uuid
customer_id uuid
stripe_payment_intent_id text
amount numeric
currency text
status text
created_at timestamptz
updated_at timestamptz
```

---

# 43. Database security

Use Supabase Row Level Security.

Rules:

## Customer

Customer may:

- read/update own profile;
- read own properties;
- read own visits;
- read reports belonging to own visits;
- read report media belonging to own visits.

Customer must not:

- access other customers;
- access unrelated verifier data;
- modify submitted verifier reports.

## Verifier

Verifier may:

- read assigned visits;
- read required customer priorities for assigned visits;
- edit reports for assigned visits until submission;
- upload permitted media;
- update visit workflow status for assigned visits.

Verifier must not:

- access unrelated customer visits;
- access customer payment details.

## Admin

Admin role can access all required operational records.

---

# 44. Media storage

Use private Supabase Storage buckets.

Recommended buckets:

```text
avatars
visit-media
```

Never make visit-media bucket public.

Use signed URLs.

Restrict media access based on visit permissions.

---

# 45. Payments

Use Stripe.

MVP flow:

```text
Customer creates visit draft
↓
Backend creates PaymentIntent
↓
Customer completes payment
↓
Payment webhook confirms success
↓
Visit status = request_received
```

Do not trust payment success only from the mobile client.

Use server/webhook confirmation.

---

# 46. App states and error handling

Every important screen must have:

- loading state;
- empty state;
- error state;
- retry action.

Examples:

```text
We couldn't load your visits.

[ Try again ]
```

Never leave a blank screen.

---

# 47. Offline and poor-network behavior

The verifier may have poor connection inside buildings.

Minimum requirements:

- preserve unfinished checklist locally;
- retry report sync;
- queue image uploads where practical;
- never lose verifier notes because the connection dropped.

The live call itself may fail.

If live call quality is poor, verifier should still be able to complete a structured report.

---

# 48. Design system

Use a small reusable design system.

Components:

- Button
- SecondaryButton
- TextButton
- Card
- VisitCard
- StatusBadge
- Timeline
- Avatar
- Input
- TextArea
- Checkbox
- RadioGroup
- SectionHeader
- ObservationRow
- EmptyState
- ErrorState
- LoadingSkeleton
- BottomSheet
- Modal
- ConfirmationDialog

Avoid one-off styling.

---

# 49. Visual direction

Use:

- light backgrounds;
- generous whitespace;
- rounded cards;
- large readable headings;
- soft shadows sparingly;
- very clear hierarchy;
- restrained use of color;
- obvious primary CTA;
- clear green check/status indicators where appropriate.

Brand should communicate:

- trust;
- warmth;
- local presence;
- professionalism.

Avoid:

- fear-based red-heavy design;
- police/security aesthetics;
- overly technical property-inspection visual language.

---

# 50. Accessibility

Minimum requirements:

- proper semantic labels;
- touch targets at least platform-recommended size;
- sufficient contrast;
- scalable text;
- do not rely on color alone for status;
- screen-reader-friendly buttons and form fields.

---

# 51. Internationalization

Build with i18n from the beginning.

Initial languages:

- English
- Spanish

Italian can be added soon after.

Do not hardcode user-facing strings directly throughout components.

Use translation files.

Example:

```text
/locales
  en.json
  es.json
```

---

# 52. Time zone

Initial market:

```text
Europe/Madrid
```

Store timestamps in UTC.

Render dates/times in the visit's local timezone.

Do not store user-facing time as free text.

---

# 53. Analytics events

Implement basic analytics abstraction.

Track:

```text
signup_completed
viewing_request_started
property_added
viewing_details_completed
priorities_completed
payment_started
payment_completed
visit_opened
live_call_joined
report_opened
booking_cancelled
support_opened
```

Do not collect unnecessary sensitive property data in analytics.

---

# 54. Core MVP screens

The coding agent should build these screens.

## Customer

1. Splash
2. Login
3. Register
4. Home
5. Request Viewing — Property
6. Request Viewing — Viewing Details
7. Request Viewing — Priorities
8. Request Viewing — Preferences
9. Request Viewing — Review
10. Payment
11. Booking Confirmation
12. Visit Detail
13. Pre-Visit
14. Visits List
15. Reports List
16. Report Detail
17. Customer Profile
18. Settings / Legal / Support

## Verifier

19. Verifier Home / Jobs
20. Verifier Visit Detail
21. Permission Confirmation
22. Check-In
23. Live Visit Checklist
24. Report Builder
25. Report Review
26. Report Submitted
27. Earnings
28. Verifier Profile

---

# 55. MVP out of scope

Do **not** build the following unless explicitly requested later:

- property marketplace;
- property search;
- listing recommendations;
- AI scam detection;
- legal contract review;
- escrow;
- deposit holding;
- automatic landlord verification;
- certified home inspection;
- proprietary video infrastructure;
- real-time verifier marketplace bidding;
- verifier route optimization;
- dynamic pricing;
- subscriptions;
- bundles;
- investor mode;
- agency dashboard;
- automatic listing scraping;
- automated property valuation;
- neighborhood scoring;
- public social feed;
- customer-to-customer messaging;
- owner self-capture mode.

These may be added later.

---

# 56. Future features to keep architecture ready for

Do not build now, but avoid architecture that makes these difficult later:

## Owner Guided / Self Capture

Property owner receives a temporary secure link and follows a guided capture workflow.

## In-app video

WebRTC or provider SDK.

## Automatic listing extraction

Extract:

- property title;
- price;
- photos;
- advertised features.

## AI-assisted comparison

Compare report observations with listing claims.

AI must not claim legal or fraud certainty.

## Verifier levels

Possible future tiers:

```text
Verified
Experienced
Pro
```

## Bundles

Example:

```text
1 viewing
3-viewing package
```

## Agency accounts

Agencies or relocation partners manage multiple customer visits.

---

# 57. Trust and legal product language

Use neutral wording.

Good:

- Observed
- Appeared
- Reported by landlord
- Reported by agent
- Not checked
- Unable to determine
- Listing difference observed

Avoid:

- Safe property
- Scam-free
- Certified
- Guaranteed
- Approved rental
- Legally verified
- Fraud-proof

SomeoneThere is not:

- a real-estate agency;
- a broker;
- a legal advisor;
- a contract-review provider;
- an escrow service;
- a certified property inspector;
- a guarantee against scams.

---

# 58. Security requirements

Implement:

- secure auth;
- Row Level Security;
- private storage;
- signed media URLs;
- payment processing through Stripe;
- no card storage in own database;
- validation for all write operations;
- rate limits for sensitive APIs where practical;
- sanitized text inputs;
- error monitoring without exposing sensitive report content.

---

# 59. Privacy requirements

Privacy must be part of the product UX.

Required principles:

- no recording by default;
- no secret recording;
- explicit recording permission;
- explicit photo permission;
- minimal data collection;
- private report/media access;
- ability to delete account;
- future retention policy configurable.

Verifier should avoid capturing:

- personal documents;
- people unless necessary/permitted;
- sensitive possessions;
- unrelated private information.

---

# 60. Suggested project structure

Example:

```text
src/
  app/
  components/
  features/
    auth/
    customer/
    visits/
    reports/
    verifier/
    payments/
  lib/
    supabase/
    stripe/
    notifications/
    analytics/
  hooks/
  services/
  store/
  types/
  utils/
  i18n/
  constants/
```

Use feature-based organization.

Avoid putting the entire application inside generic `screens/` and `utils/` folders.

---

# 61. TypeScript types

Create shared types for:

```ts
UserRole
VisitStatus
PropertyType
PropertyContactType
ListingMatch
ObservationRating
AnswerSource
CancellationReason
PaymentStatus
MediaType
```

Avoid repeated string literals.

---

# 62. State management

Use:

- React Query / TanStack Query for server state;
- lightweight local state for UI state.

Do not duplicate Supabase records into a large global store without need.

Forms can use:

- React Hook Form;
- Zod validation.

---

# 63. Validation examples

## Listing URL

Optional.

If entered, must be valid URL.

## Address

Required before payment.

## Scheduled time

Must be future date/time.

## Customer priorities

At least one priority OR one custom note.

## Recording

If requested:

```text
recording_requested = true
recording_allowed = false
```

until explicit permission is recorded.

Do not assume request equals consent.

---

# 64. Push-notification architecture

Store notification tokens per device.

Example table:

```sql
device_tokens

id uuid
user_id uuid
platform text
token text
created_at timestamptz
updated_at timestamptz
```

Trigger notifications from backend events, not only from mobile state changes.

---

# 65. Basic customer journey acceptance test

The MVP is considered functional when a brand-new customer can:

1. install the app;
2. create an account;
3. paste a property listing;
4. enter viewing date/time;
5. enter landlord/agent details;
6. choose priorities;
7. choose privacy preferences;
8. pay;
9. see the booking;
10. receive verifier assignment;
11. see verifier profile;
12. receive visit-status updates;
13. open the live-call link;
14. receive notification when report is ready;
15. open the structured report;
16. see permitted photos;
17. log out.

---

# 66. Basic verifier journey acceptance test

The MVP is considered functional when a verifier can:

1. log in;
2. see assigned visit;
3. open property/listing details;
4. see customer priorities;
5. see permitted media rules;
6. confirm permission;
7. check in;
8. open/start the live-call link;
9. complete checklist;
10. add notes;
11. upload permitted photos;
12. check out;
13. complete report;
14. submit report;
15. see visit marked complete.

---

# 67. Development phases

## Phase 1 — Foundation

Build:

- Expo project;
- navigation;
- design system;
- Supabase;
- auth;
- roles;
- database;
- RLS;
- environment configuration.

## Phase 2 — Customer booking

Build:

- Home;
- request-viewing wizard;
- property creation;
- visit creation;
- priorities;
- preferences;
- booking status.

## Phase 3 — Payment

Build:

- Stripe PaymentIntent;
- checkout;
- webhook;
- payment status.

## Phase 4 — Verifier workflow

Build:

- verifier assignment views;
- check-in;
- checklist;
- check-out;
- report creation.

## Phase 5 — Customer report

Build:

- reports list;
- report detail;
- private media;
- notifications.

## Phase 6 — Hardening

Add:

- validation;
- error states;
- loading states;
- offline protection;
- analytics;
- Sentry;
- security review;
- UX polish;
- Android release build.

---

# 68. Seed/demo data

Create demo accounts.

## Customer

```text
customer@example.com
```

## Verifier

```text
verifier@example.com
```

Create at least:

- one upcoming visit;
- one verifier-assigned visit;
- one completed visit with report.

This allows the UI to be reviewed without manually creating all records.

Do not commit real credentials.

---

# 69. Environment configuration

Use environment variables.

Example:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SENTRY_DSN=
```

Server-only secrets must never be included in the mobile bundle.

---

# 70. Required documentation

The agent should create:

```text
README.md
docs/architecture.md
docs/database.md
docs/setup.md
docs/release-android.md
```

README should explain:

- project purpose;
- stack;
- setup;
- environment variables;
- how to run;
- how to build Android.

---

# 71. Testing

Minimum:

- unit tests for important domain helpers;
- form validation tests;
- visit-status mapping tests;
- permission logic tests;
- basic end-to-end smoke flow if practical.

Prioritize testing:

- auth;
- payment confirmation;
- RLS;
- visit ownership;
- report ownership;
- verifier assignment permissions.

---

# 72. Definition of Done

The first Android MVP is done when:

- Android build installs successfully;
- customer journey works end-to-end;
- verifier journey works end-to-end;
- payment success is confirmed server-side;
- customer cannot access other customers' visits;
- verifier cannot access unrelated visits;
- visit photos are private;
- report displays correctly;
- push notification for report-ready works;
- no recording is enabled by default;
- all critical forms validate;
- all important screens have loading/error/empty states;
- English and Spanish strings are structured for i18n;
- README/setup docs are complete.

---

# 73. First release UX priority

The highest priority user loop is:

```text
Paste listing
      ↓
Request viewing
      ↓
Choose what matters
      ↓
Pay
      ↓
See verifier + status
      ↓
Join live viewing
      ↓
Receive structured report
```

If a feature does not improve this loop, it is probably not needed in v1.

---

# 74. Final build instruction

Build SomeoneThere as a **small, high-trust operational product**, not as a broad prop-tech platform.

The first release should prove one thing well:

> A customer who cannot be physically present can send a trusted local verifier to a Madrid rental viewing, participate remotely, and receive a clear structured record of what was observed.

Prioritize:

1. trust;
2. booking simplicity;
3. verifier workflow;
4. clear status;
5. privacy;
6. structured reports;
7. reliability.

Do not prioritize feature count.

