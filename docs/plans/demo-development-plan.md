# Flowlingo Initial Demo Development Plan

Status: Draft
Last Updated: 2026-03-22
Product Name: Flowlingo
Source Plan: `docs/designs/english-acquisition-app-plan.md`

## Goal

Build an initial mobile demo that proves the core acquisition loop:

```text
Onboarding -> Today -> Lesson -> Sentence Support -> Light Practice -> Replay -> Completion
```

The demo should feel coherent, clickable, and believable to a user, even if some data and scoring are mocked.

## Demo Success Criteria

The demo is successful if it can clearly show:

- a first-time user can complete onboarding
- the app generates a simple daily task
- the user can study one lesson sentence by sentence
- the user can save an expression
- the user can complete one low-pressure practice step
- the user can review 2-3 expressions and finish the loop

For the demo, clarity and flow matter more than full production depth.

## Assumptions

To keep the first demo small and shippable, this plan assumes:

- mobile-first product
- single-user local demo
- no real auth in v1 demo
- no backend service in v1 demo
- local mock lesson data
- no real AI evaluation for speaking in the demo

## Recommended Stack

Use boring, fast tools for the first demo:

- Expo
- React Native
- TypeScript
- Expo Router
- Zustand for lightweight state
- AsyncStorage for local persistence
- local JSON or TypeScript mock data for lessons and expressions

Why this stack:

- fastest path to a believable mobile demo
- minimal infrastructure overhead
- easy to evolve into a real app later

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

## Demo Scope

### Included Screens

1. Welcome / onboarding
2. Goal and topic selection
3. Level self-assessment
4. Today screen
5. Lesson player
6. Sentence detail sheet
7. Light practice screen
8. Expression replay screen
9. Completion screen
10. Basic profile screen

### Included Behaviors

- create a local user profile
- generate a local daily plan from mock data
- play through one lesson
- inspect sentence-level support
- save expressions
- complete practice task
- replay saved expressions
- mark daily session complete

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
App Shell
  -> Navigation Layer
  -> Screen Layer
  -> Domain State Layer
  -> Mock Content Layer
  -> Local Persistence Layer
```

### Architecture Notes

- Screens should stay mostly presentational.
- Domain logic should live in small state modules or services.
- Mock content should be isolated so real backend integration can replace it later.
- Persistence should be limited to profile, saved expressions, and progress state.

## Proposed Folder Structure

```text
app/
  (routes and screens)

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
  types/
  utils/
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
- persist only what must survive app reload
- derive UI state when possible

## Screen Plan

### 1. Onboarding

Purpose:

- capture goal, topics, level, daily time

Outputs:

- local `UserProfile`
- initial `DailyPlan`

### 2. Today

Purpose:

- give the user one obvious next action

Shows:

- lesson card
- review card
- progress indicator

### 3. Lesson Player

Purpose:

- deliver comprehensible input clearly

Needs:

- lesson header
- sentence list
- sentence active state
- replay audio action
- save phrase action

### 4. Sentence Detail

Purpose:

- reduce confusion at the exact sentence level

Shows:

- translation
- phrase explanation
- slow replay entry

### 5. Light Practice

Purpose:

- reinforce learning without pressure

Demo scope:

- one retell prompt or one short comprehension prompt
- mark completion locally

### 6. Replay

Purpose:

- resurface 2-3 expressions from the lesson

### 7. Completion

Purpose:

- end the session with momentum

Shows:

- completed lesson
- expressions saved today
- short encouragement

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
- user exits mid-lesson and returns
- user completes practice before saving any phrase

## Delivery Phases

### Phase 0: Scaffold

- initialize Expo + TypeScript app
- add router and base layout
- add theme tokens
- add feature folders

### Phase 1: Domain and Mock Data

- define core types
- add local lesson data
- add profile and daily plan state
- add AsyncStorage persistence

### Phase 2: Onboarding and Today

- build onboarding flow
- save profile locally
- generate today's lesson
- render Today screen

### Phase 3: Lesson Experience

- build lesson player
- build sentence detail sheet
- add save phrase action
- support lesson progress tracking

### Phase 4: Practice and Replay

- build lightweight practice screen
- build replay screen
- mark daily loop complete

### Phase 5: Completion and Polish

- completion screen
- basic profile screen
- empty states
- loading states
- navigation polish

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
10. polish

## Test Plan

For the demo, test the product loop before optimizing details.

### Manual Test Flows

- new user completes onboarding
- returning user lands on Today
- user opens lesson and reads all sentences
- user saves a phrase
- user completes practice
- user finishes replay
- user sees completion state after app restart

### Lightweight Automated Coverage

- state initialization
- daily plan generation
- phrase save / duplicate save handling
- completion state persistence

## Risks and Mitigations

### Risk: We overbuild the demo

Mitigation:

- no backend
- no auth
- no real AI scoring
- no content management system

### Risk: The demo feels fake

Mitigation:

- invest in strong lesson data
- make sentence interactions feel real
- make completion flow polished

### Risk: The state model gets messy

Mitigation:

- keep domain stores separated
- isolate mock content from UI code

## Definition of Done

The initial demo is done when:

- the app can be opened and navigated end-to-end
- onboarding creates a user profile
- one full learning loop is completable
- local state persists across reload
- the demo does not break on common edge cases

## Immediate Next Tasks

- [ ] choose the exact Expo app structure
- [ ] scaffold the project
- [ ] define TypeScript domain types
- [ ] write the first 3 demo lessons
- [ ] build onboarding
- [ ] build Today and lesson player
- [ ] wire phrase saving and replay
- [ ] add completion flow

## Open Decisions

These do not block scaffolding, but should be resolved before polishing:

1. Should the demo include real audio playback or placeholder audio controls?
2. Should practice use voice input, typed input, or completion buttons only?
3. Should the first demo target beginner or lower-intermediate learners?
4. Should the visual design be warm and calm, or more modern and editorial?
