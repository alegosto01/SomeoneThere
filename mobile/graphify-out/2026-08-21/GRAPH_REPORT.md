# Graph Report - mobile  (2026-08-20)

## Corpus Check
- 119 files · ~44,658 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 593 nodes · 1547 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `607617a3`
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
- `CustomerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(customer)/_layout.tsx → src/features/auth/AuthProvider.tsx
- `CustomerProfile()` --calls--> `useAuth()`  [EXTRACTED]
  app/(customer)/profile.tsx → src/features/auth/AuthProvider.tsx
- `VerifierLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(verifier)/_layout.tsx → src/features/auth/AuthProvider.tsx
- `AuthLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/(auth)/_layout.tsx → src/features/auth/AuthProvider.tsx
- `PreVisitScreen()` --calls--> `useVisit()`  [EXTRACTED]
  app/(customer)/previsit/[id].tsx → src/features/visits/queries.ts

## Import Cycles
- None detected.

## Communities (27 total, 7 thin omitted)

### Community 0 - "[id].tsx"
Cohesion: 0.07
Nodes (71): AuthLayout(), CustomerHome(), styles, PreVisitScreen(), styles, MATCH_TONE, ReportDetailScreen(), styles (+63 more)

### Community 1 - "theme.ts"
Cohesion: 0.06
Nodes (50): styles, styles, CustomerLayout(), styles, styles, VerifierLayout(), styles, ReportDisclaimer() (+42 more)

### Community 2 - "AuthProvider.tsx"
Cohesion: 0.07
Nodes (34): CustomerProfile(), styles, ConfirmationScreen(), styles, PaymentScreen(), Phase, queryClient, styles (+26 more)

### Community 3 - "toUserFacingError"
Cohesion: 0.08
Nodes (42): fetchPaymentForVisit(), fetchVerifierEarnings(), requestAccountDeletion(), updateProfile(), updateVerifierProfile(), addReportMedia(), fetchCustomerReports(), fetchReport() (+34 more)

### Community 4 - "review.tsx"
Cohesion: 0.08
Nodes (35): RequestPreferencesStep(), RequestPrioritiesStep(), RequestPropertyStep(), RequestReviewStep(), styles, RequestViewingStep(), styles, Notice() (+27 more)

### Community 5 - "[id].tsx"
Cohesion: 0.09
Nodes (33): RATINGS, styles, VerifierChecklistScreen(), MATCHES, SOURCES, styles, VerifierReportScreen(), styles (+25 more)

### Community 6 - "models.ts"
Cohesion: 0.09
Nodes (36): VisitCardProps, AuthState, CreateVisitInput, ChecklistStore, ObservationDraft, QuestionDraft, ReportDraft, useChecklistDraft (+28 more)

### Community 7 - "expo"
Cohesion: 0.06
Nodes (34): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+26 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, date-fns, date-fns-tz, expo, expo-constants, expo-image-manipulator, expo-image-picker, expo-linking (+23 more)

### Community 9 - "SomeoneThere — mobile app"
Cohesion: 0.07
Nodes (27): 1. Read this first: there is no Node on this machine, 2. Where things stand, 3.1 Get one end-to-end journey working on a device, 3.2 Wire the operator gaps (see §5 — several flows have no UI at all), 3. Do this next, in this order, 4. Invariants — do not break these, 5. Known gaps and deliberate omissions, 6. Traps already hit — do not rediscover these (+19 more)

### Community 10 - "scripts"
Cohesion: 0.07
Nodes (27): devDependencies, eslint, eslint-config-expo, jest, jest-expo, react-test-renderer, @testing-library/react-native, @types/jest (+19 more)

### Community 11 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, noImplicitOverride, noUncheckedIndexedAccess, paths, strict, exclude, extends, include (+1 more)

### Community 12 - "api.ts"
Cohesion: 0.39
Nodes (7): completeOAuthSession(), mapAuthError(), signIn(), signInWithGoogle(), signUp(), LoginInput, RegisterInput

### Community 13 - "index.ts"
Cohesion: 0.40
Nodes (3): admin, COPY, NOTIFIABLE

## Knowledge Gaps
- **209 isolated node(s):** `name`, `slug`, `version`, `orientation`, `scheme` (+204 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text()` connect `theme.ts` to `[id].tsx`, `AuthProvider.tsx`, `review.tsx`, `[id].tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `spacing` connect `theme.ts` to `[id].tsx`, `AuthProvider.tsx`, `review.tsx`, `[id].tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `[id].tsx` to `theme.ts`, `AuthProvider.tsx`, `review.tsx`, `[id].tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _209 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06741573033707865 - nodes in this community are weakly interconnected._
- **Should `theme.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05554035567715458 - nodes in this community are weakly interconnected._
- **Should `AuthProvider.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06988120195667366 - nodes in this community are weakly interconnected._