import { lessons } from "@/data/lessons";
import { DailyPlan, Lesson, Phrase, Topic, UserProfile } from "@/types/domain";

export function buildDailyPlan(profile: UserProfile): DailyPlan {
  const lesson = selectLessonForProfile(profile);

  return {
    date: new Date().toISOString().slice(0, 10),
    lessonId: lesson.id,
    reviewPhraseIds: lesson.sentences.flatMap((sentence) => sentence.phrases.map((phrase) => phrase.id)).slice(0, 3),
    practiceType: profile.level === "beginner" ? "comprehension" : "retell",
    completed: false
  };
}

export function selectLessonForProfile(profile: UserProfile): Lesson {
  const topicSet = new Set<Topic>(profile.topics);

  return (
    lessons.find((lesson) => lesson.difficulty === profile.level && topicSet.has(lesson.topic)) ??
    lessons.find((lesson) => topicSet.has(lesson.topic)) ??
    lessons[0]
  );
}

export function getReplayPhrases(lessonId: string, savedPhrases: Phrase[]): Phrase[] {
  const lesson = lessons.find((item) => item.id === lessonId);
  const lessonPhrases = lesson ? lesson.sentences.flatMap((sentence) => sentence.phrases) : [];
  const deduped = [...savedPhrases, ...lessonPhrases].filter(
    (phrase, index, all) => all.findIndex((item) => item.id === phrase.id) === index
  );

  return deduped.slice(0, 3);
}
