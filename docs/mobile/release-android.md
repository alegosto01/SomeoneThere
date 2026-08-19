# SomeoneThere mobile — Android release

## Configuration

Set in `mobile/app.json` before a release build:

- `expo.version` — user-visible version
- `expo.android.versionCode` — increment for every Play upload
- `expo.android.package` — `com.someonethere.app`
- `expo.extra.eas.projectId` — the real EAS project id (the checked-in value is
  a placeholder)

Permissions are deliberately narrow: `CAMERA`, `READ_MEDIA_IMAGES`, and
`POST_NOTIFICATIONS`. `ACCESS_FINE_LOCATION` and `RECORD_AUDIO` are explicitly
blocked — the MVP does not track a verifier's location and does not record
audio, and the manifest should say so.

## Icons and splash

`mobile/assets/` holds **placeholder** artwork — a plain map-pin mark in the
brand green, generated so builds have the files `app.json` references. Replace
`icon.png`, `adaptive-icon.png` and `splash.png` with real artwork before any
store submission. Sizes and constraints are in `mobile/assets/README.md`.

## Build

```bash
cd mobile
eas login
eas build:configure

# Internal APK for testers
eas build --platform android --profile preview

# Play Store bundle
eas build --platform android --profile production
```

Or locally:

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

## Environment per profile

`eas.json` sets `EXPO_PUBLIC_ENV` per profile. The Supabase and Stripe values
come from EAS secrets:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value https://<ref>.supabase.co
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <anon key>
eas secret:create --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value pk_live_...
eas secret:create --name EXPO_PUBLIC_SENTRY_DSN --value <dsn>
```

Only publishable values go here. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
and `SUPABASE_SERVICE_ROLE_KEY` are Supabase Edge Function secrets and must
never enter the mobile bundle.

## Before uploading

- [ ] Points at production Supabase and **live** Stripe keys
- [ ] `versionCode` incremented
- [ ] `npm run typecheck`, `npm test`, `npm run lint` all pass
- [ ] Customer journey works end to end on a real device (spec §65)
- [ ] Verifier journey works end to end on a real device (spec §66)
- [ ] Payment success confirmed by the webhook, not just by the client
- [ ] A customer cannot open another customer's visit
- [ ] A verifier cannot open an unassigned visit
- [ ] Report photos are not reachable without a signed URL
- [ ] Report-ready push notification arrives
- [ ] Nothing records by default anywhere in the app
- [ ] English and Spanish both render with no missing keys

## Play Store data safety

Declare honestly:

- **Collected**: name, email, phone (optional), photos taken during a viewing,
  approximate booking address, payment status (Stripe holds card data; this app
  never sees or stores it).
- **Not collected**: precise location, contacts, audio recordings, background
  activity.
- **Deletion**: in-app, Profile → Delete account. Everything cascades from the
  auth user.

## Submit

```bash
eas submit --platform android --latest
```
