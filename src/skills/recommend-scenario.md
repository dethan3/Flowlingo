# Skill 3: Recommend Scenario

## Purpose

Recommend a specific, concrete scenario for the user's next learning session. Avoid repeating recent scenarios.

## Input

```json
{
  "domains": ["daily-life", "travel"],
  "recentScenarios": ["Ordering at a cafe", "Checking in at a hotel"],
  "difficulty": 2
}
```

## Output

```json
{
  "scenario": "Asking for directions to a museum",
  "domain": "travel"
}
```

## Rules

- The scenario must be a concrete, specific situation — not a broad topic
- Good: "Returning a shirt at a clothing store"
- Bad: "Shopping"
- Must belong to one of the user's selected domains
- Must not repeat any title from recentScenarios
- Should be appropriate for the difficulty level:
  - Level 1: simple everyday situations with predictable dialogue
  - Level 2: common life situations with some variety
  - Level 3: workplace, social, or moderately complex situations
  - Level 4: nuanced social, cultural, or professional situations
- Output only one scenario per call
