import { Lesson } from "@/types/domain";

export const lessons: Lesson[] = [
  {
    id: "daily-cafe-chat",
    title: "A Quick Cafe Conversation",
    topic: "daily-life",
    difficulty: "beginner",
    estimatedMinutes: 8,
    summary: "A short and friendly conversation about ordering a drink and settling into the day.",
    sentences: [
      {
        id: "cafe-1",
        text: "Hi, can I get a small latte, please?",
        translation: "你好，我可以要一杯小杯拿铁吗？",
        audioKey: "cafe-1",
        phrases: [
          {
            id: "p-latte-order",
            text: "Can I get ... ?",
            meaning: "我可以要……吗？",
            example: "Can I get a bottle of water?",
            familiarity: 1
          }
        ]
      },
      {
        id: "cafe-2",
        text: "Sure. Would you like it hot or iced?",
        translation: "当然。你想要热的还是冰的？",
        audioKey: "cafe-2",
        phrases: [
          {
            id: "p-would-you-like",
            text: "Would you like ... ?",
            meaning: "你想要……吗？",
            example: "Would you like a receipt?",
            familiarity: 1
          }
        ]
      },
      {
        id: "cafe-3",
        text: "Iced, please. I have a long morning ahead.",
        translation: "冰的，谢谢。我今天上午还有很多事要做。",
        audioKey: "cafe-3",
        phrases: [
          {
            id: "p-ahead",
            text: "I have a long ... ahead.",
            meaning: "我接下来还有很长的……",
            example: "I have a busy week ahead.",
            familiarity: 1
          }
        ]
      },
      {
        id: "cafe-4",
        text: "No problem. Your drink will be ready in a minute.",
        translation: "没问题。你的饮料一分钟后就好。",
        audioKey: "cafe-4",
        phrases: [
          {
            id: "p-ready-in",
            text: "will be ready in ...",
            meaning: "……后就会准备好",
            example: "Dinner will be ready in ten minutes.",
            familiarity: 1
          }
        ]
      }
    ]
  },
  {
    id: "travel-checkin",
    title: "Checking In at a Hotel",
    topic: "travel",
    difficulty: "lower-intermediate",
    estimatedMinutes: 10,
    summary: "A calm check-in exchange focused on arrival, booking, and practical travel English.",
    sentences: [
      {
        id: "hotel-1",
        text: "Hi, I have a reservation under Chen.",
        translation: "你好，我有一个姓 Chen 的预订。",
        audioKey: "hotel-1",
        phrases: [
          {
            id: "p-under-name",
            text: "under [name]",
            meaning: "以……名字预订",
            example: "The booking is under Wang.",
            familiarity: 1
          }
        ]
      },
      {
        id: "hotel-2",
        text: "Welcome. May I see your passport, please?",
        translation: "欢迎。可以给我看看你的护照吗？",
        audioKey: "hotel-2",
        phrases: [
          {
            id: "p-may-i-see",
            text: "May I see ... ?",
            meaning: "我可以看一下……吗？",
            example: "May I see your ticket?",
            familiarity: 1
          }
        ]
      },
      {
        id: "hotel-3",
        text: "Of course. Is breakfast included in the room rate?",
        translation: "当然。房价里包含早餐吗？",
        audioKey: "hotel-3",
        phrases: [
          {
            id: "p-included-in",
            text: "included in",
            meaning: "包含在……里面",
            example: "Tax is included in the price.",
            familiarity: 1
          }
        ]
      },
      {
        id: "hotel-4",
        text: "Yes, it is. Breakfast is served from seven to ten.",
        translation: "是的，包含。早餐供应时间是七点到十点。",
        audioKey: "hotel-4",
        phrases: [
          {
            id: "p-served-from",
            text: "is served from ... to ...",
            meaning: "供应时间从……到……",
            example: "Lunch is served from noon to two.",
            familiarity: 1
          }
        ]
      }
    ]
  },
  {
    id: "team-standup",
    title: "A Simple Team Standup",
    topic: "work",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    summary: "Short workplace updates that help learners get used to practical team communication.",
    sentences: [
      {
        id: "standup-1",
        text: "Yesterday I wrapped up the homepage draft and sent it for review.",
        translation: "昨天我完成了首页草稿，并发出去评审了。",
        audioKey: "standup-1",
        phrases: [
          {
            id: "p-wrap-up",
            text: "wrapped up",
            meaning: "完成了，收尾了",
            example: "We wrapped up the proposal yesterday.",
            familiarity: 1
          }
        ]
      },
      {
        id: "standup-2",
        text: "Today I am focusing on the lesson player interaction details.",
        translation: "今天我会专注在课程播放器的交互细节上。",
        audioKey: "standup-2",
        phrases: [
          {
            id: "p-focus-on",
            text: "focusing on",
            meaning: "专注于",
            example: "This week I am focusing on testing.",
            familiarity: 1
          }
        ]
      },
      {
        id: "standup-3",
        text: "The only blocker right now is that we still need final copy.",
        translation: "目前唯一的阻碍是我们还需要最终文案。",
        audioKey: "standup-3",
        phrases: [
          {
            id: "p-blocker-right-now",
            text: "The only blocker right now is ...",
            meaning: "目前唯一的阻碍是……",
            example: "The only blocker right now is the API key.",
            familiarity: 1
          }
        ]
      },
      {
        id: "standup-4",
        text: "If we get that today, we should still be on track for Friday.",
        translation: "如果我们今天拿到那个，周五前应该还能按计划推进。",
        audioKey: "standup-4",
        phrases: [
          {
            id: "p-on-track",
            text: "on track",
            meaning: "按计划进行中",
            example: "We are still on track for launch.",
            familiarity: 1
          }
        ]
      }
    ]
  }
];

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id) ?? null;
}
