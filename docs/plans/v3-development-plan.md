# Flowlingo v3 Development Plan

Status: Confirmed
Date: 2026-03-27
Source: Product discussion on onboarding redesign & learning path architecture

---

## Overview

This plan covers two major feature additions and a set of architectural improvements to bring Flowlingo from a mock demo to a structurally sound, extensible product.

### New Features

1. **Adaptive Vocabulary Test** — Replace manual level selection with a real assessment
2. **Dual Learning Paths** — Guided curriculum (Path A) + Custom AI-parsed input (Path B), modular and switchable

### Architectural Improvements

3. **Component extraction** — Build a shared UI component library
4. **Shared constants** — Deduplicate options and config
5. **Unified route guards** — Centralized auth/guard logic
6. **Loading states** — Skeleton/spinner infrastructure for async operations
7. **Testing foundation** — Unit tests for core store logic and key flows

---

## Phase 0: Architectural Foundation

> Resolve existing tech debt before building new features. This makes the new feature work cleaner and avoids compounding the problems.

### 0.1 Component Extraction

Create reusable UI components in `src/components/ui/`:

| Component | Replaces | Used In |
|-----------|----------|---------|
| `Button` | Repeated `<button className="...">` patterns | All pages |
| `Card` | `rounded-2xl border border-border bg-surface p-5` blocks | today, scenario, practice, library |
| `OptionButton` | Selectable option pattern (difficulty, domain, time) | setup, settings |
| `Badge` | Familiarity/status tags | library, replay, complete |
| `ErrorBanner` | Inline error display | today, practice |
| `Spinner` | Loading indicator (new) | today, practice, vocab-test |
| `Skeleton` | Content placeholder (new) | scenario, today |
| `ProgressBar` | Progress indicators | complete, vocab-test, learning-path |
| `TextInput` / `TextArea` | Input fields | practice, custom-input |

Rules:
- Each component is a single file in `src/components/ui/`
- Export via `src/components/ui/index.ts` barrel
- Accept className prop for one-off overrides
- No business logic in UI components

### 0.2 Shared Constants

Create `src/constants/options.ts`:

```ts
// Difficulty options, domain options, time options
// Single source of truth — used by setup, settings, vocab-test result mapping
```

Create `src/constants/routes.ts`:

```ts
// Route path constants
// e.g. ROUTES.SETUP, ROUTES.TODAY, ROUTES.SCENARIO(id)
```

### 0.3 Unified Route Guards

Create `src/components/require-settings.tsx`:

```
A wrapper component (or custom hook) that checks if settings exist.
If not, redirects to /setup.
Used by: today, scenario, practice, replay, complete, library, settings
```

Replaces the ad-hoc `useEffect(() => { if (!settings) router.replace("/setup") })` in every page.

Similarly, create `src/components/require-scenario.tsx` for pages that need an active scenario.

### 0.4 Loading State Infrastructure

- Add `Spinner` and `Skeleton` to the component library
- Create Next.js `loading.tsx` files for key route segments:
  - `src/app/today/loading.tsx`
  - `src/app/scenario/[id]/loading.tsx`
  - `src/app/practice/[id]/loading.tsx`
  - `src/app/vocab-test/loading.tsx`

### 0.5 Testing Foundation

Setup:
- Add `vitest` + `@testing-library/react` as dev dependencies
- Add `"test"` script to `package.json`

Initial test coverage targets:
- `src/state/use-flowlingo-store.ts` — streak calculation, expression save/dedup, daily record update, settings persistence
- `src/services/mock-ai.ts` — scenario generation returns valid structure
- Vocab test scoring logic (once built)

---

## Phase 1: Adaptive Vocabulary Test

### 1.1 Product Design

**Goal**: Determine the user's English level through a short adaptive vocabulary test (~20 words, ~2 minutes). Replaces manual "Choose your level" step.

**Flow**:

```
User opens app for first time
  → Welcome screen
  → "Let's find your level" (start vocab test)
  → Adaptive word test (20–30 words)
  → Result screen: "Your level is Level 3 — Intermediate"
  → Continue to learning mode selection (Phase 2)
```

**Test Mechanics**:

1. Word bank: ~200 words graded by difficulty (4 tiers matching Level 1–4)
   - Level 1 words: apple, happy, morning, school, friend...
   - Level 2 words: schedule, recommend, disappointed, opportunity...
   - Level 3 words: negotiate, compromise, implement, substantial...
   - Level 4 words: nuance, eloquent, ubiquitous, paradigm...
2. Adaptive algorithm:
   - Start at Level 2 (middle)
   - Show a word → user taps "I know this" or "I don't know"
   - For ~30% of "I know" answers, follow up with a meaning check (4 options, pick the correct meaning) to prevent over-reporting
   - If user gets most right at current level → move up; if wrong → move down
   - Converge after ~20 words
3. Scoring: Simple threshold-based mapping to Level 1–4
4. Result is saved to `UserSettings.difficulty` (same field, same type)

**UI Screens**:

- `/vocab-test` — Test page with word card + buttons
- Test progress bar at the top
- Result screen with level + short description
- "Retake test" option available in Settings

### 1.2 Data Model Changes

```ts
// New file: src/data/word-bank.ts
interface TestWord {
  word: string;
  level: Difficulty;          // 1–4
  meaningOptions?: string[];  // 4 options for meaning check
  correctMeaning?: string;    // correct option
}
```

No changes to `UserSettings` type — `difficulty` field remains `Difficulty` (1–4).

Add to store:
```ts
// In FlowlingoStore
vocabTestCompleted: boolean;
// Persisted — so we know if user has taken the test
```

### 1.3 New Files

| File | Purpose |
|------|---------|
| `src/data/word-bank.ts` | Graded word list (~200 words) with meaning options |
| `src/app/vocab-test/page.tsx` | Test UI: word card, progress, "I know" / "I don't know" buttons |
| `src/lib/vocab-test-engine.ts` | Adaptive test algorithm: word selection, scoring, level determination |
| `src/app/vocab-test/loading.tsx` | Loading state |

### 1.4 Route Changes

Current setup flow:
```
/ → /setup (difficulty → domains → time) → /today
```

New flow:
```
/ → /vocab-test → /setup (learning mode → [path config] → time) → /today
```

The `/setup` page no longer includes difficulty selection — that comes from the vocab test.

### 1.5 New Skill (Future)

For now, the word bank is a static local dataset. When real AI is integrated, this could become:

```
Skill 4: Generate Level Test
Input: { previousAnswers, currentEstimatedLevel }
Output: { nextWord, meaningOptions }
```

This is out of scope for the current phase — static word bank is sufficient.

---

## Phase 2: Dual Learning Paths

### 2.1 Product Design

After the vocab test, users choose how they want to learn:

```
Vocab test complete → "How do you want to learn?"
  ├── 📚 "Follow a plan" (Path A: Guided)
  │     → Pick a learning path (e.g. "Daily Life Basics", "Workplace English")
  │     → System schedules scenarios in order
  │
  └── ✏️ "I'll decide each day" (Path B: Custom)
        → Each day, user types what they want to practice
        → AI parses intent → generates scenario
```

**Key principle: Modular & switchable**
- Users can switch mode at any time from Settings or Today page
- In guided mode, user can still do a one-off custom scenario
- In custom mode, user can switch to a guided path whenever they want

### 2.2 Path A: Guided Learning

**Concept: Learning Path**

A learning path is an ordered sequence of scenario prompts with a progression theme.

```ts
interface LearningPath {
  id: string;
  title: string;          // "Daily Life Basics"
  description: string;    // "30 scenarios covering everyday situations"
  difficulty: Difficulty;
  totalScenarios: number;
  scenarios: LearningPathScenario[];
}

interface LearningPathScenario {
  day: number;            // 1-indexed position in the path
  title: string;          // "Ordering coffee at a café"
  description: string;    // Brief context
  domain: string;         // Flexible string, not limited to 5 options
  completed: boolean;
}
```

**MVP approach**: Predefine 2–3 mock learning paths with 5–10 scenarios each. No AI generation of paths yet.

**Today page (guided mode)**:
- Shows current path progress (e.g. "Day 5 of 30 — Workplace English")
- Today's scenario card (next uncompleted scenario in the path)
- "Start today's scenario" button
- Scenario generation still uses `generate-scenario` skill, but with the path's predefined title/domain as input

### 2.3 Path B: Custom Input

**Concept: User describes what they want to practice**

```
Today page (custom mode):
  ├── Text input: "What do you want to practice today?"
  │   placeholder: "e.g. ordering food at a restaurant, job interview..."
  ├── Recent requests (history, quick re-select)
  └── [Generate] button → AI parses → generates scenario
```

**Input**: Free text, Chinese or English

**New Skill**: `parse-user-intent`

```
Skill 5: Parse User Intent
Input: {
  userInput: string,       // free text in any language
  difficulty: Difficulty,
  existingExpressions: string[]
}
Output: {
  scenarioTitle: string,
  scenarioDescription: string,
  domain: string,          // AI-inferred, free-form
}
```

For MVP, this skill is mocked — the mock extracts keywords from the input and returns a plausible scenario title. Real AI integration comes later.

After parsing, the flow proceeds normally: `generate-scenario` skill takes the parsed title/domain and generates the dialogue.

### 2.4 Data Model Changes

```ts
// Updated UserSettings
interface UserSettings {
  difficulty: Difficulty;
  dailyMinutes: DailyMinutes;
  learningMode: "guided" | "custom";
  // domains[] removed — replaced by learningMode + path/intent
}

// New: Learning path tracking
interface LearningPathProgress {
  pathId: string;
  currentDay: number;
  completedDays: number[];
  startedAt: string;
}

// New: Custom mode history
interface CustomRequest {
  id: string;
  input: string;           // user's original text
  parsedTitle: string;     // AI-parsed scenario title
  parsedDomain: string;    // AI-inferred domain
  usedAt: string;          // timestamp
}
```

Store additions:
```ts
// In FlowlingoStore
learningPathProgress: LearningPathProgress | null;
customRequestHistory: CustomRequest[];
setLearningMode: (mode: "guided" | "custom") => void;
selectLearningPath: (pathId: string) => void;
addCustomRequest: (request: CustomRequest) => void;
```

### 2.5 Domain Type Evolution

Current: `Domain = "daily-life" | "travel" | "work" | "social" | "culture"`

New approach:
- `Domain` type becomes `string` (free-form)
- The 5 predefined domains remain as suggestions / defaults for guided paths
- Custom mode allows AI to generate any domain string
- Scenario type's `domain` field becomes `string`

### 2.6 New / Modified Files

| File | Type | Purpose |
|------|------|---------|
| `src/data/learning-paths.ts` | New | Mock learning path data (2–3 paths) |
| `src/data/word-bank.ts` | New | Graded word list for vocab test |
| `src/app/setup/page.tsx` | Modified | Remove difficulty step, add learning mode selection + path picker |
| `src/app/today/page.tsx` | Modified | Show different UI based on learning mode |
| `src/components/custom-input.tsx` | New | Free-text input component for custom mode |
| `src/components/path-progress.tsx` | New | Learning path progress display |
| `src/components/mode-switcher.tsx` | New | Toggle between guided/custom modes |
| `src/services/mock-ai.ts` | Modified | Add `mockParseUserIntent()` |
| `src/skills/parse-user-intent.md` | New | Skill 5 prompt template |
| `src/types/domain.ts` | Modified | Add new types, change Domain to string |
| `src/state/use-flowlingo-store.ts` | Modified | Add new state fields and actions |

### 2.7 Route Changes

Final onboarding flow:
```
/ → /vocab-test → /setup (mode → [path picker | skip] → time) → /today
```

Setup steps become:
1. Choose learning mode (guided / custom)
2. If guided: pick a learning path
3. Set daily time
4. Start learning

### 2.8 Today Page Variants

**Guided mode**:
```
┌─────────────────────────────┐
│ 📚 Workplace English        │
│ Day 5 of 30                 │
│ ████████░░░░░░░░  17%       │
│                             │
│ Today's Scenario:           │
│ "Presenting to your team"   │
│ Workplace · Level 3         │
│                             │
│ [Start Scenario]            │
│ [Switch to custom ✏️]        │
└─────────────────────────────┘
```

**Custom mode**:
```
┌─────────────────────────────┐
│ ✏️ What do you want to       │
│    practice today?          │
│                             │
│ ┌─────────────────────────┐ │
│ │ e.g. "job interview"... │ │
│ └─────────────────────────┘ │
│ [Generate Scenario]         │
│                             │
│ Recent:                     │
│ · Ordering at a café        │
│ · Airport check-in          │
│ [Switch to guided 📚]       │
└─────────────────────────────┘
```

---

## Phase 3: Integration & Polish

### 3.1 Settings Page Update

Add to settings:
- **Retake vocab test** button
- **Learning mode** switch (guided ↔ custom)
- **Change learning path** (if in guided mode)
- Remove old domain selection (replaced by learning mode)

### 3.2 Scenario Flow Adaptation

The scenario → practice → replay → complete loop stays the same regardless of learning mode. The only difference is **how the scenario is selected/generated**:

- **Guided**: Scenario title and domain come from the learning path's next item
- **Custom**: Scenario title and domain come from AI parsing of user input
- **Generation**: Both feed into the same `generate-scenario` skill

### 3.3 Migration

For existing users (with data in localStorage):
- If `UserSettings` has `domains[]` but no `learningMode`, default to `learningMode: "custom"`
- Map old `domains[]` to a default learning path suggestion
- Set `vocabTestCompleted: false` — prompt to take the test on next visit

---

## Execution Order

Build in this order so the app stays functional at every step:

### Step 1: Architectural foundation (Phase 0)
1. Extract UI components (`Button`, `Card`, `OptionButton`, `Badge`, `Spinner`, `Skeleton`, `ProgressBar`, `TextInput`)
2. Create shared constants (`options.ts`, `routes.ts`)
3. Create route guard wrappers (`RequireSettings`, `RequireScenario`)
4. Add `loading.tsx` files for key routes
5. Setup vitest + initial store tests

### Step 2: Vocabulary test (Phase 1)
6. Create word bank data (`word-bank.ts`)
7. Build vocab test engine (`vocab-test-engine.ts`)
8. Build vocab test page + result screen
9. Update entry redirect logic (`/` → `/vocab-test` for new users)
10. Add "Retake test" to settings

### Step 3: Data model evolution (Phase 2 prep)
11. Update `domain.ts` types (`Domain` → `string`, add `LearningPath`, `CustomRequest`, etc.)
12. Create mock learning path data
13. Update Zustand store with new fields and actions
14. Add mock `parseUserIntent` to `mock-ai.ts`
15. Write `parse-user-intent.md` skill prompt

### Step 4: Setup flow redesign (Phase 2)
16. Redesign `/setup` — mode selection + path picker + time
17. Remove old difficulty selection step from setup

### Step 5: Today page + mode switching (Phase 2)
18. Build `custom-input` component
19. Build `path-progress` component
20. Build `mode-switcher` component
21. Update Today page to render based on learning mode
22. Wire custom input → mock parse → generate scenario flow
23. Wire guided path → next scenario → generate scenario flow

### Step 6: Settings + migration (Phase 3)
24. Update settings page (retake test, mode switch, path change)
25. Add localStorage migration logic for existing users

### Step 7: Tests (Phase 3)
26. Store tests (new fields, mode switching, path progress)
27. Vocab test engine tests (adaptive algorithm, scoring)
28. Integration smoke tests (full onboarding flow)

---

## Out of Scope

- Real AI integration (LLM API calls) — stays on mock
- AI-generated learning paths — paths are predefinted mock data
- Pronunciation / accent testing
- Audio playback / TTS
- Dark mode
- i18n
- PWA offline support

---

## Open Questions (Deferred)

1. When AI is integrated, should guided paths be fully AI-generated per user, or remain curated?
2. Should custom mode remember and resurface past scenarios for review?
3. Should the vocab test include listening comprehension in the future?
4. How many learning paths should exist at launch?
