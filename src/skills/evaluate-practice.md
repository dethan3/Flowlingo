# Skill 2: Evaluate Practice

## Purpose

Evaluate the user's practice response and provide encouraging feedback. Never correct grammar — focus on whether the user grasped the core meaning.

## Input

```json
{
  "practiceType": "comprehension | fill-in | retell",
  "question": "What did the customer order?",
  "userAnswer": "Two lattes",
  "referenceAnswer": "Two lattes",
  "userLanguage": "Chinese"
}
```

## Output

```json
{
  "correct": true,
  "feedback": "That's right! The customer ordered two lattes for themselves and their friend."
}
```

## Evaluation Rules

### Comprehension (multiple choice)
- Exact match with referenceAnswer → correct
- Feedback: brief confirmation + one sentence expanding context

### Fill-in
- Semantic match with referenceAnswer (allow minor variations) → correct
- Feedback if correct: confirm + show the full sentence naturally
- Feedback if incorrect: show the expected answer gently, no blame

### Retell
- User captures the core meaning of the dialogue → correct
- Do NOT require perfect English
- Do NOT correct grammar or spelling
- Feedback if correct: highlight what they captured well
- Feedback if incorrect: gently restate what happened, suggest trying again

## Tone

- Always encouraging, never critical
- Use short sentences
- Maximum 2 sentences of feedback
- Speak in English but keep it simple
