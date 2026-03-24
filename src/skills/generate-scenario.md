# Skill 1: Generate Scenario Dialogue

## Purpose

Generate a complete English learning scenario with dialogue, expressions, and a practice prompt based on the user's difficulty level and interest domain.

## Input

```json
{
  "difficulty": 1-4,
  "domain": "daily-life | travel | work | social | culture",
  "scenario": "specific scenario title, e.g. Ordering at a cafe",
  "existingExpressions": ["expression text 1", "expression text 2"],
  "sentenceCount": 4-8,
  "userLanguage": "Chinese"
}
```

- `existingExpressions` is optional. When provided, try to naturally weave 1-2 of them into the dialogue so the user re-encounters them in a new context.
- `sentenceCount` is determined by the user's daily time preference: 5min → 4 sentences, 10min → 6 sentences, 15min → 8 sentences.

## Output

```json
{
  "title": "Ordering a coffee for a friend",
  "description": "You walk into a busy cafe with a friend who can't decide what to order.",
  "sentences": [
    {
      "id": "s1",
      "text": "Hi, can I get two lattes, please?",
      "translation": "你好，我可以要两杯拿铁吗？",
      "expressions": [
        {
          "id": "e1",
          "text": "Can I get ...?",
          "meaning": "我可以要……吗？",
          "example": "Can I get a glass of water?"
        }
      ]
    }
  ],
  "practicePrompt": {
    "type": "comprehension",
    "question": "What did the customer order for their friend?",
    "options": ["Two lattes", "One latte and one tea", "Two teas", "A latte and a muffin"],
    "referenceAnswer": "Two lattes"
  }
}
```

## Difficulty Guidelines

### Level 1 (入门)
- Short, simple sentences (5-8 words)
- Basic vocabulary only
- Simple present tense, can/could
- Everyday concrete scenarios
- 1 expression per sentence max

### Level 2 (基础)
- Full sentences (8-12 words)
- Common expressions and collocations
- Past tense, future tense, would/could
- Broader daily scenarios
- 1-2 expressions per sentence

### Level 3 (进阶)
- Longer sentences (12-18 words)
- Idiomatic expressions, phrasal verbs
- Complex tenses, conditionals
- Workplace and social scenarios
- 1-2 expressions per sentence

### Level 4 (流利)
- Natural-length sentences (15-25 words)
- Nuanced expressions, humor, indirectness
- All tenses, subjunctive, complex clauses
- Abstract topics, opinions, cultural discussion
- 1-2 expressions per sentence

## Practice Prompt Rules

- Level 1-2: generate `comprehension` type (multiple choice, 4 options)
- Level 2-3: generate `fill-in` type (sentence with blank, referenceAnswer is the missing expression)
- Level 3-4: generate `retell` type (open question, referenceAnswer is a model answer)

## Constraints

- Always generate a complete dialogue between 2 or more speakers
- Translations must be natural Chinese, not word-for-word
- Expressions should be reusable patterns, not single words
- Each expression's example sentence must be different from the dialogue sentence
- The dialogue should feel like a real situation, not a textbook exercise
- Sentence IDs should be sequential: s1, s2, s3...
- Expression IDs should be sequential: e1, e2, e3...
