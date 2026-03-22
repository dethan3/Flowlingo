# Flowlingo Product Plan

Status: Draft
Last Updated: 2026-03-22

Product Name: Flowlingo

## Product Framing

This product is not just an "English learning app."

It is a daily language acquisition system that helps users:

- enter understandable English every day
- build intuition through repeated exposure
- practice output with low pressure
- feel steady progress without exam-style stress

The core loop is:

```text
Input -> Understand -> Light Output -> Replay Old Expressions -> Completion
```

## Product Goal

Help users build real English intuition through comprehensible input and light, repeatable output.

## Core Principles

1. Input is the main path; output reinforces learning.
2. Daily completion matters more than session length.
3. The product should feel low-pressure, clear, and rewarding.
4. Progress should be measured by understanding and usable expressions, not by question volume.

## Chosen Product Direction

We choose the "Acquisition Loop App" direction.

Why this direction:

- lighter than a full AI immersion coach
- more effective than a content-only reader
- strong enough to create retention and visible progress

## MVP Scope

### 1. Onboarding and Initial Diagnosis

The user sets:

- learning goal
- interest topics
- self-assessed level
- preferred daily study time

The system uses this to produce an initial difficulty level and content mix.

### 2. Daily Task Home

Each day should feel simple and guided.

The home screen shows:

- today's lesson
- today's review expressions
- completion progress
- streak / recent momentum

### 3. Comprehensible Input Lessons

Each lesson is a short piece of English content:

- dialogue
- short story
- real-life scenario
- audio plus text

Content should stay in the user's learning zone:

- mostly understandable
- slightly challenging
- never overwhelming

### 4. Sentence-Level Learning Support

Every sentence supports:

- tap for meaning
- phrase breakdown
- replay audio
- slow audio
- save expression

This is a key trust feature. Users should never feel lost inside a lesson.

### 5. Low-Pressure Output

Output must stay light in v1.

Allowed output types:

- shadow one sentence
- retell one sentence
- answer one short prompt

Do not force open-ended speaking too early.

### 6. Expression Acquisition Library

This is not a classic vocabulary notebook.

It stores "expressions in progress," including:

- original sentence
- meaning
- audio
- short reusable example
- familiarity state

### 7. Intelligent Replay

The system should naturally replay expressions the user has seen but not fully absorbed.

Replay surfaces:

- after today's lesson
- in later lessons
- in short review prompts

### 8. Progress Feedback

Keep progress feedback simple:

- listening / reading comprehension trend
- number of reusable expressions
- streak or consistency

Avoid noisy dashboards in v1.

## Information Architecture

The first release should use four primary tabs.

### Tab 1: Today

- Today's task card
- Resume current lesson
- Today's review expressions
- Completion summary

### Tab 2: Learn

- Topic-based lesson feed
- Difficulty filter
- Saved lessons
- Continue later

### Tab 3: Practice

- Shadowing
- Retelling
- Simple question practice
- Weak-expression review

### Tab 4: Me

- Learning profile
- Weekly progress
- Difficulty preference
- Daily goal settings

## Key Screens

### Onboarding

- Welcome
- Goal selection
- Topic selection
- Level self-assessment
- First-week plan preview

### Today Screen

- today's lesson
- estimated time
- two or three review expressions
- progress state

### Lesson Player

- audio controls
- sentence list
- tap-to-explain
- save expression
- lightweight practice entry

### Practice Screen

- shadow one line
- retell one line
- answer one short question

### Completion Screen

- today's progress
- expressions strengthened today
- tomorrow preview

## Core User Flow

```text
[First Open]
  -> [Set goal, topics, level]
  -> [Generate first daily plan]
  -> [Start today's lesson]
  -> [Understand sentence by sentence]
  -> [Do one light output task]
  -> [Replay 2-3 old expressions]
  -> [Finish with progress feedback]
  -> [Come back tomorrow]
```

## Screen Flow

```text
Today
  -> Lesson Player
  -> Sentence Detail
  -> Light Practice
  -> Expression Replay
  -> Completion Card
```

## Experience Rules

1. The user should always know what to do next.
2. Every lesson should be completable in about 10-15 minutes.
3. If the content is too hard, the user must be able to reduce difficulty immediately.
4. If the user does not want to speak yet, the app should allow lower-pressure alternatives first.

## Functional Requirements

### Lesson System

- serve lessons by topic and difficulty
- support text plus audio
- support sentence-level segmentation
- support per-sentence metadata

### Learning Support

- phrase explanation
- translation / meaning display
- slow replay
- save expression

### Practice System

- shadow mode
- retell mode
- simple comprehension prompt mode

### Memory and Replay

- store saved expressions
- track familiarity state
- surface expressions for later replay

### Progress System

- lesson completion tracking
- daily streak / consistency
- expression familiarity updates
- lightweight progress summaries

## Out of Scope for v1

- community features
- leaderboard
- exam prep system
- full grammar course tree
- free-form unlimited AI conversation
- teacher marketplace
- heavy gamification
- UGC lesson platform

## Risks

### Risk 1: Becoming a Content App

If we only offer reading/listening content, users may consume but not internalize.

Mitigation:

- require one light output step
- replay old expressions systematically

### Risk 2: Becoming a Stressful Practice App

If output is too heavy, beginners may stop returning.

Mitigation:

- start with shadowing and short retell
- allow lower-pressure alternatives

### Risk 3: Poor Difficulty Matching

If lessons are too hard or too easy, retention will fall.

Mitigation:

- difficulty controls in the lesson flow
- adaptive content selection over time

## Success Metrics

Early signs that the product direction is working:

- users complete the daily loop multiple days in a row
- users report "this feels easier than traditional study"
- users feel they are beginning to understand and reuse expressions
- daily session completion stays high for a 10-15 minute lesson

## Phase Plan

### Phase 1: MVP

- onboarding
- today screen
- lesson player
- sentence support
- light practice
- expression save and replay
- basic progress feedback

### Phase 2: Strengthen Retention

- smarter replay scheduling
- better weekly summaries
- stronger lesson personalization

### Phase 3: Expand Delight

- scenario-based packs
- more adaptive speaking progression
- richer "you can use this now" feedback

## Implementation Notes for Next Review

The next planning step should define:

- data model for lessons, sentences, expressions, and replay state
- how difficulty adaptation works
- how speaking / retell practice is scored or tracked
- content ingestion and authoring workflow
- v1 mobile UI layout and state handling

## Open Questions

1. Is the first target user beginner, lower-intermediate, or intermediate?
2. Will v1 use curated content, generated content, or a hybrid?
3. Is speaking evaluation required in v1, or is completion enough?
4. Should replay happen only inside lessons, or also as a separate review mode?
