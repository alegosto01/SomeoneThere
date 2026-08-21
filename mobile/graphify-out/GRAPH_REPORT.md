# Graph Report - mobile  (2026-08-21)

## Corpus Check
- 121 files · ~45,975 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 610 nodes · 1566 edges · 33 communities (25 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `400c0a5e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_id.tsx|[id].tsx]]
- [[_COMMUNITY_theme.ts|theme.ts]]
- [[_COMMUNITY_AuthProvider.tsx|AuthProvider.tsx]]
- [[_COMMUNITY_toUserFacingError|toUserFacingError]]
- [[_COMMUNITY_review.tsx|review.tsx]]
- [[_COMMUNITY_id.tsx|[id].tsx]]
- [[_COMMUNITY_models.ts|models.ts]]
- [[_COMMUNITY_expo|expo]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_SomeoneThere — mobile app|SomeoneThere — mobile app]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_api.ts|api.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_run.sh|run.sh]]
- [[_COMMUNITY_README|README.md]]
- [[_COMMUNITY_eslint.config.js|eslint.config.js]]
- [[_COMMUNITY_EMPTY_REQUEST_DRAFT|EMPTY_REQUEST_DRAFT]]
- [[_COMMUNITY_PermissionSummary.tsx|PermissionSummary.tsx]]
- [[_COMMUNITY_checklist-draft.ts|checklist-draft.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_payment-sheet.web.ts|payment-sheet.web.ts]]
- [[_COMMUNITY_UserRole|UserRole]]

## God Nodes (most connected - your core abstractions)
1. `Text()` - 43 edges
2. `spacing` - 39 edges
3. `useAuth()` - 32 edges
4. `toUserFacingError()` - 31 edges
5. `Screen()` - 27 edges
6. `colors` - 24 edges
7. `Button()` - 20 edges
8. `formatTime()` - 19 edges
9. `Card()` - 18 edges
10. `expo` - 16 edges

## Surprising Connections (you probably didn't know these)
- `AuthLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/_layout.tsx → src/features/auth/AuthProvider.tsx
- `CustomerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(customer)/_layout.tsx → src/features/auth/AuthProvider.tsx
- `CustomerHome()` --calls--> `useAuth()`  [EXTRACTED]
  app/(customer)/home.tsx → src/features/auth/AuthProvider.tsx
- `PreVisitScreen()` --calls--> `verifierDisplayName()`  [EXTRACTED]
  app/(customer)/previsit/[id].tsx → src/utils/format.ts
- `CustomerProfile()` --calls--> `useAuth()`  [EXTRACTED]
  app/(customer)/profile.tsx → src/features/auth/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (33 total, 8 thin omitted)

### Community 0 - "[id].tsx"
Cohesion: 0.07
Nodes (61): CustomerHome(), styles, PreVisitScreen(), styles, ReportsScreen(), styles, styles, VisitDetailScreen() (+53 more)

### Community 1 - "theme.ts"
Cohesion: 0.06
Nodes (57): styles, styles, ConfirmationScreen(), styles, RequestPreferencesStep(), RequestPrioritiesStep(), RequestPropertyStep(), styles (+49 more)

### Community 2 - "AuthProvider.tsx"
Cohesion: 0.07
Nodes (33): AuthLayout(), CustomerLayout(), CustomerProfile(), styles, Index(), queryClient, VerifierLayout(), styles (+25 more)

### Community 3 - "toUserFacingError"
Cohesion: 0.07
Nodes (47): PaymentScreen(), Phase, RequestReviewStep(), styles, VerifierEarningsScreen(), fetchPaymentForVisit(), fetchVerifierEarnings(), addReportMedia() (+39 more)

### Community 4 - "review.tsx"
Cohesion: 0.08
Nodes (28): CheckboxGroup(), TextArea(), PRIORITY_KEYS, PriorityKey, completeOAuthSession(), mapAuthError(), signIn(), signInWithGoogle() (+20 more)

### Community 5 - "[id].tsx"
Cohesion: 0.13
Nodes (20): RATINGS, styles, VerifierChecklistScreen(), MATCHES, SOURCES, styles, VerifierReportScreen(), CHECKLIST_SECTIONS (+12 more)

### Community 6 - "models.ts"
Cohesion: 0.13
Nodes (25): VisitCardProps, CreateVisitInput, EMPTY, RequestDraft, CancellationReason, LiveCallProvider, MediaType, PaymentStatus (+17 more)

### Community 7 - "expo"
Cohesion: 0.06
Nodes (34): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+26 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, date-fns, date-fns-tz, expo, expo-constants, expo-image-manipulator, expo-image-picker, expo-linking (+26 more)

### Community 9 - "SomeoneThere — mobile app"
Cohesion: 0.07
Nodes (28): 1. STOP: the working tree is mid-upgrade and does not build, 2. Why the upgrade is needed at all, 3. Environment (already set up, persists), 4. Where things stand otherwise, 5. Invariants — do not break these, 6. Traps already hit — do not rediscover these, 7. Known gaps, 8. House rules (+20 more)

### Community 10 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, android, build:android:preview, build:android:prod, ios, lint, prebuild, start (+5 more)

### Community 11 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, noImplicitOverride, noUncheckedIndexedAccess, paths, strict, types, exclude, extends (+2 more)

### Community 12 - "api.ts"
Cohesion: 0.13
Nodes (20): MATCH_TONE, ReportDetailScreen(), styles, ObservationRow(), RATING_SYMBOL, RATING_TONE, styles, Avatar() (+12 more)

### Community 13 - "index.ts"
Cohesion: 0.40
Nodes (3): admin, COPY, NOTIFIABLE

### Community 27 - "PermissionSummary.tsx"
Cohesion: 0.23
Nodes (9): GLYPH, PermissionState, PermissionSummary(), styles, TONE, canEditReport(), canVerifierCheckIn(), canVerifierCheckOut() (+1 more)

### Community 28 - "checklist-draft.ts"
Cohesion: 0.21
Nodes (9): ChecklistStore, ObservationDraft, QuestionDraft, ReportDraft, AnswerSource, ListingMatch, ObservationRating, ReportObservation (+1 more)

### Community 29 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-expo, jest, jest-expo, react-test-renderer, @testing-library/react-native, @types/jest (+2 more)

### Community 30 - "package.json"
Cohesion: 0.40
Nodes (4): main, name, private, version

### Community 32 - "UserRole"
Cohesion: 1.00
Nodes (3): AuthState, UserRole, Profile

## Knowledge Gaps
- **215 isolated node(s):** `name`, `slug`, `version`, `orientation`, `scheme` (+210 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `theme.ts` to `[id].tsx`, `AuthProvider.tsx`, `toUserFacingError`, `review.tsx`, `[id].tsx`, `api.ts`, `PermissionSummary.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `spacing` connect `theme.ts` to `[id].tsx`, `AuthProvider.tsx`, `toUserFacingError`, `[id].tsx`, `api.ts`, `PermissionSummary.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `AuthProvider.tsx` to `[id].tsx`, `theme.ts`, `toUserFacingError`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _215 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0725685034628124 - nodes in this community are weakly interconnected._
- **Should `theme.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060855639441775335 - nodes in this community are weakly interconnected._
- **Should `AuthProvider.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06676342525399129 - nodes in this community are weakly interconnected._