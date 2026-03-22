# Flowlingo Initial Demo Development Plan

Status: Draft
Last Updated: 2026-03-23
Product Name: Flowlingo
Source Plan: `docs/designs/english-acquisition-app-plan.md`

## Current Implementation Status

As of 2026-03-23, the project has moved from planning into an initial runnable scaffold.

Implemented:

- `Next.js` app scaffold with App Router and `pnpm`
- mobile-first app shell and bottom navigation
- onboarding flow
- Today screen
- lesson screen with sentence detail and phrase save actions
- practice, replay, completion, and profile screens
- local mock lesson data
- local persisted demo state with `Zustand`
- PWA manifest route and base app icons
- clean production build via `pnpm build`

Not implemented yet:

- real audio playback
- service worker based offline caching
- polished visual design system
- richer practice interactions
- analytics or backend integration

## Delivery Decision

The first implementation should be:

- web-first
- installable as a PWA
- mobile-first in layout and interaction
- built with `Next.js` and `pnpm`

This keeps the first version much lighter than a native app while still behaving like an app for users who add it to their home screen.

## Goal

Build an initial web demo that proves the core acquisition loop:

```text
Onboarding -> Today -> Lesson -> Sentence Support -> Light Practice -> Replay -> Completion
```

The demo should feel coherent, clickable, and trustworthy, even if some data and evaluation are mocked.

## Why Web-First Is the Right Move

- faster to build than a native app
- easier to iterate on copy, layout, and learning flow
- simpler deployment and sharing
- PWA install support gets us close to an app experience
- still leaves room to move to native later if the product proves itself

## Demo Success Criteria

The demo is successful if it can clearly show:

- a first-time user can complete onboarding
- the app generates a simple daily task
- the user can study one lesson sentence by sentence
- the user can save an expression
- the user can complete one low-pressure practice step
- the user can review 2-3 expressions and finish the loop
- the app works well on mobile browser widths
- the app can be installed as a PWA

For the demo, clarity and flow matter more than full production depth.

## Assumptions

To keep the first demo small and shippable, this plan assumes:

- single-user local demo
- no real auth in v1 demo
- no backend service in v1 demo
- local mock lesson data
- no real AI evaluation for speaking in the demo
- no server-side personalization in v1

## Recommended Stack

Use boring, fast tools for the first demo:

- `Next.js` with App Router
- `React`
- `TypeScript`
- `pnpm`
- `Zustand` for lightweight client state
- `localStorage` or IndexedDB wrapper for local persistence
- local JSON or TypeScript mock data for lessons and expressions
- `next-pwa` or an equivalent PWA integration

Why this stack:

- fast path to a production-shaped web app
- easy routing and page composition
- good fit for PWA support
- simple local-first state model
- low infrastructure overhead

## Out of Scope for Demo v1

- account system
- cloud sync
- payment
- full CMS
- dynamic AI lesson generation
- advanced speech scoring
- social features
- leaderboard
- complex analytics backend
- offline audio caching beyond basic browser behavior

## Product Slice for the Demo

The demo should implement one complete vertical slice, not many partial features.

That slice is:

```text
first open
  -> onboarding
  -> daily lesson
  -> phrase save
  -> light practice
  -> replay
  -> completion feedback
```

Anything outside this loop is secondary.

## Technical Architecture

```text
Next.js App
  -> Route Layer
  -> Screen / UI Layer
  -> Domain State Layer
  -> Mock Content Layer
  -> Local Persistence Layer
  -> PWA Shell Layer
```

### Architecture Notes

- route files should stay thin
- domain logic should live in feature modules and small services
- mock content should be isolated so a real backend can replace it later
- persistence should be limited to profile, saved expressions, and progress state
- PWA concerns should be kept separate from domain logic

## Proposed Folder Structure

```text
app/
  layout.tsx
  page.tsx
  onboarding/
  today/
  lesson/[lessonId]/
  practice/
  replay/
  complete/
  profile/

src/
  components/
  features/
    onboarding/
    today/
    lesson/
    practice/
    replay/
    progress/
  data/
  state/
  services/
  styles/
  types/
  utils/

public/
  icons/
  manifest.json
```

## Core Data Model

### UserProfile

- id
- goal
- topics[]
- level
- dailyMinutes

### Lesson

- id
- title
- topic
- difficulty
- estimatedMinutes
- sentences[]

### Sentence

- id
- text
- translation
- audioKey
- phrases[]

### Phrase

- id
- text
- meaning
- example
- familiarity

### DailyPlan

- date
- lessonId
- reviewPhraseIds[]
- practiceType
- completed

### PracticeAttempt

- id
- lessonId
- type
- sentenceId
- completedAt

## State Design

Keep state simple and explicit.

### App State Areas

- `profileState`
- `lessonState`
- `dailyPlanState`
- `phraseState`
- `progressState`

### Rules

- one store per domain area
- avoid global dumping ground state
- persist only what must survive refresh
- derive UI state when possible

## Route Plan

### `/`

Purpose:

- landing redirect
- decide whether to send the user to onboarding or Today

### `/onboarding`

Purpose:

- capture goal, topics, level, daily time

Outputs:

- local `UserProfile`
- initial `DailyPlan`

### `/today`

Purpose:

- give the user one obvious next action

Shows:

- lesson card
- review card
- progress indicator

### `/lesson/[lessonId]`

Purpose:

- deliver comprehensible input clearly

Needs:

- lesson header
- sentence list
- sentence active state
- replay audio action
- save phrase action

### `/practice`

Purpose:

- reinforce learning without pressure

Demo scope:

- one retell prompt or one short comprehension prompt
- mark completion locally

### `/replay`

Purpose:

- resurface 2-3 expressions from the lesson

### `/complete`

Purpose:

- end the session with momentum

Shows:

- completed lesson
- expressions saved today
- short encouragement

### `/profile`

Purpose:

- show the current learning profile and settings

## UI Plan

The first version should behave like a phone app inside the browser:

- constrained content width on desktop
- mobile-first spacing and controls
- sticky bottom navigation
- strong hierarchy with one primary action per screen
- clear empty, loading, and completion states

## PWA Requirements

The demo should include:

- installable manifest
- app icons
- theme color and standalone display mode
- basic service worker setup
- offline support for shell pages if practical

The PWA does not need full offline learning in v1.

## Demo Data Strategy

Use hand-authored local lessons.

Initial content set:

- 3 topics
- 2 lessons per topic
- 5-8 sentences per lesson
- 2-3 reusable phrases per lesson

This is enough content for a believable walkthrough without building a CMS.

## Edge Cases to Handle in Demo

Even a demo should not feel fragile.

- empty profile on first launch
- no lesson generated yet
- lesson data missing a sentence field
- phrase already saved
- user refreshes mid-lesson and returns
- user completes practice before saving any phrase
- browser storage unavailable or blocked
- PWA install not supported on the current browser

## Delivery Phases

### Phase 0: Scaffold

- initialize `Next.js` app with `pnpm`
- configure TypeScript, linting, and base layout
- add route structure
- add design tokens and global styles

### Phase 1: Domain and Mock Data

- define core types
- add local lesson data
- add profile and daily plan state
- add local persistence

### Phase 2: Onboarding and Today

- build onboarding flow
- save profile locally
- generate today's lesson
- render Today screen

### Phase 3: Lesson Experience

- build lesson player
- build sentence detail UI
- add save phrase action
- support lesson progress tracking

### Phase 4: Practice and Replay

- build lightweight practice screen
- build replay screen
- mark daily loop complete

### Phase 5: Completion and PWA

- completion screen
- basic profile screen
- manifest and icons
- service worker / PWA integration
- empty states
- loading states
- mobile polish

## Suggested Build Order

Build in this order to keep the app runnable at every step:

1. app shell
2. onboarding
3. Today screen
4. lesson player
5. sentence detail
6. phrase saving
7. practice
8. replay
9. completion
10. PWA shell
11. polish

## Test Plan

For the demo, test the product loop before optimizing details.

### Manual Test Flows

- new user completes onboarding
- returning user lands on Today
- user opens lesson and reads all sentences
- user saves a phrase
- user completes practice
- user finishes replay
- user sees completion state after page refresh
- app layout works on mobile viewport
- PWA manifest is valid and install prompt is available where supported

### Lightweight Automated Coverage

- state initialization
- daily plan generation
- phrase save / duplicate save handling
- completion state persistence
- route guard logic for onboarding vs Today

## Risks and Mitigations

### Risk: We accidentally build a full platform

Mitigation:

- no backend
- no auth
- no real AI scoring
- no CMS

### Risk: The web demo feels like a website, not an app

Mitigation:

- mobile-first layout
- clear app shell
- sticky nav
- strong completion flow
- PWA install support

### Risk: PWA work distracts from core learning flow

Mitigation:

- build the learning loop first
- add PWA shell near the end
- keep offline support intentionally shallow in v1

### Risk: Client state becomes messy

Mitigation:

- keep domain stores separated
- isolate mock content from UI code

## Definition of Done

The initial demo is done when:

- the app can be opened and navigated end-to-end
- onboarding creates a user profile
- one full learning loop is completable
- local state persists across refresh
- the UI is usable on mobile widths
- the app can be installed as a PWA
- the demo does not break on common edge cases

## Immediate Next Tasks

- [x] scaffold the `Next.js` project with `pnpm`
- [x] define TypeScript domain types
- [x] write the first 3 demo lessons
- [x] build onboarding
- [x] build Today and lesson player
- [x] wire phrase saving and replay
- [x] add completion flow
- [x] add PWA manifest and icons
- [ ] add real audio playback
- [ ] add service worker based PWA caching
- [ ] refine lesson interaction and mobile layout
- [ ] strengthen practice and replay UX
- [ ] prepare a deployable demo build

## Next Development Plan

The next phase should focus on making the current scaffold feel like a believable product, not just extending feature count.

### Phase 6: Lesson Experience Polish

- replace placeholder audio actions with real browser audio playback
- improve sentence focus behavior and progression through a lesson
- make phrase save feedback clearer and more satisfying
- strengthen the hierarchy of the lesson screen for small mobile widths

### Phase 7: Practice and Replay Depth

- make practice prompts feel more intentional and less placeholder-like
- support both typed response and tap-through comprehension paths
- improve replay so it feels like reinforcement instead of a static list
- connect completion feedback more clearly to what was learned today

### Phase 8: PWA Completion

- add service worker based shell caching
- verify installability on supported mobile browsers
- add splash-safe icons and metadata refinements
- define graceful behavior for unsupported install flows

### Phase 9: Design and Trust Pass

- establish a stronger visual identity for Flowlingo
- improve motion, spacing, and content hierarchy
- add empty, loading, and error states that still feel calm
- make the app feel more like a focused product and less like a generic dashboard

### Phase 10: Demo Hardening

- add lightweight automated tests for core state logic
- verify persistence and refresh behavior across the full flow
- audit edge cases like missing lesson data and repeated phrase saves
- prepare the app for a shareable demo deployment

## Pause / Handoff Note

Development is intentionally paused at this point after the initial scaffold.

When work resumes, the recommended order is:

1. lesson experience polish
2. richer practice and replay
3. full PWA support
4. visual refinement
5. demo hardening and deployment preparation

## Open Decisions

These do not block scaffolding, but should be resolved before polishing:

1. Should the demo include real audio playback or placeholder audio controls?
2. Should practice use voice input, typed input, or completion buttons only?
3. Should the first demo target beginner or lower-intermediate learners?
4. Should the visual design be warm and calm, or more modern and editorial?
