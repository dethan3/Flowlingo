import type {
  Difficulty,
  Domain,
  Expression,
  PracticePrompt,
  Scenario,
  Sentence,
} from "@/types/domain";

let counter = 0;
function uid() {
  return `gen-${Date.now()}-${++counter}`;
}

interface GenerateScenarioInput {
  difficulty: Difficulty;
  domain: Domain;
  sentenceCount: number;
  existingExpressions?: string[];
}

interface RecommendScenarioInput {
  domains: Domain[];
  recentScenarios: string[];
  difficulty: Difficulty;
}

const SCENARIOS: Record<Domain, string[]> = {
  "daily-life": [
    "Ordering a drink at a cafe",
    "Buying groceries at a supermarket",
    "Chatting with a roommate about dinner",
    "Picking up a package from a delivery driver",
    "Making small talk with a neighbor",
    "Returning a shirt at a clothing store",
    "Calling to make a dentist appointment",
    "Asking a coworker about lunch plans",
  ],
  travel: [
    "Checking in at a hotel",
    "Asking for directions to a museum",
    "Ordering food at a restaurant abroad",
    "Taking a taxi to a tourist spot",
    "Buying a train ticket at the station",
    "Asking about luggage at the airport",
    "Booking a tour at the hotel lobby",
    "Exchanging currency at a bank",
  ],
  work: [
    "Giving a quick update in a standup meeting",
    "Writing a polite follow-up email",
    "Discussing a project timeline with a colleague",
    "Introducing yourself in a job interview",
    "Asking your manager for feedback",
    "Explaining a technical issue to a client",
    "Scheduling a meeting with a remote team",
    "Presenting a short proposal",
  ],
  social: [
    "Meeting someone new at a party",
    "Inviting a friend to see a movie",
    "Talking about hobbies with a new acquaintance",
    "Planning a weekend trip with friends",
    "Congratulating a friend on their new job",
    "Catching up with an old friend over coffee",
    "Recommending a restaurant to a friend",
    "Talking about a recent vacation",
  ],
  culture: [
    "Discussing a movie you just watched",
    "Talking about a trending news topic",
    "Sharing thoughts on a book",
    "Debating the best travel destinations",
    "Talking about food culture differences",
    "Discussing a popular TV series",
    "Sharing a funny story from your day",
    "Comparing holiday traditions",
  ],
};

interface MockDialogue {
  sentences: {
    text: string;
    translation: string;
    expressions: { text: string; meaning: string; example: string }[];
  }[];
  practice: PracticePrompt;
}

const MOCK_DIALOGUES: Record<Difficulty, Record<string, MockDialogue>> = {
  1: {
    default: {
      sentences: [
        {
          text: "Hi, can I get a small coffee, please?",
          translation: "你好，我可以要一杯小杯咖啡吗？",
          expressions: [
            {
              text: "Can I get ...?",
              meaning: "我可以要……吗？",
              example: "Can I get a glass of water?",
            },
          ],
        },
        {
          text: "Sure. Do you want milk in it?",
          translation: "当然。你要加牛奶吗？",
          expressions: [
            {
              text: "Do you want ... in it?",
              meaning: "你要在里面加……吗？",
              example: "Do you want sugar in it?",
            },
          ],
        },
        {
          text: "Yes, please. How much is it?",
          translation: "好的，谢谢。多少钱？",
          expressions: [
            {
              text: "How much is it?",
              meaning: "多少钱？",
              example: "How much is the sandwich?",
            },
          ],
        },
        {
          text: "That will be three dollars.",
          translation: "一共三美元。",
          expressions: [
            {
              text: "That will be ...",
              meaning: "一共是……",
              example: "That will be twelve dollars.",
            },
          ],
        },
      ],
      practice: {
        type: "comprehension",
        question: "What did the customer order?",
        options: [
          "A small coffee with milk",
          "A large coffee",
          "A tea with sugar",
          "A small coffee without milk",
        ],
        referenceAnswer: "A small coffee with milk",
      },
    },
  },
  2: {
    default: {
      sentences: [
        {
          text: "Hi, I have a reservation under Chen for two nights.",
          translation: "你好，我有一个姓 Chen 的预订，住两晚。",
          expressions: [
            {
              text: "I have a reservation under ...",
              meaning: "我有一个以……名字的预订",
              example: "I have a reservation under Smith.",
            },
          ],
        },
        {
          text: "Welcome! May I see your passport, please?",
          translation: "欢迎！请问可以看一下您的护照吗？",
          expressions: [
            {
              text: "May I see ...?",
              meaning: "我可以看一下……吗？",
              example: "May I see your ticket?",
            },
          ],
        },
        {
          text: "Of course. Is breakfast included in the room rate?",
          translation: "当然。房价里包含早餐吗？",
          expressions: [
            {
              text: "Is ... included in ...?",
              meaning: "……包含在……里面吗？",
              example: "Is parking included in the fee?",
            },
          ],
        },
        {
          text: "Yes, breakfast is served from seven to ten in the lobby.",
          translation: "是的，早餐在大堂供应，时间是早上七点到十点。",
          expressions: [
            {
              text: "is served from ... to ...",
              meaning: "供应时间从……到……",
              example: "Lunch is served from noon to two.",
            },
          ],
        },
        {
          text: "Great. Could I also get a late checkout on Sunday?",
          translation: "太好了。周日可以延迟退房吗？",
          expressions: [
            {
              text: "Could I also get ...?",
              meaning: "我还可以……吗？",
              example: "Could I also get an extra pillow?",
            },
          ],
        },
        {
          text: "Let me check — yes, we can extend it to one o'clock.",
          translation: "我查一下——可以的，我们可以延到一点。",
          expressions: [
            {
              text: "Let me check",
              meaning: "我查一下 / 我确认一下",
              example: "Let me check if we have any rooms available.",
            },
          ],
        },
      ],
      practice: {
        type: "fill-in",
        question:
          'Complete the sentence: "I have a ______ under Chen for two nights."',
        options: null,
        referenceAnswer: "reservation",
      },
    },
  },
  3: {
    default: {
      sentences: [
        {
          text: "Alright, let's do a quick round. Sarah, do you want to kick things off?",
          translation: "好，我们快速过一轮。Sarah，你先开始？",
          expressions: [
            {
              text: "kick things off",
              meaning: "开始、启动",
              example: "Let's kick things off with a demo.",
            },
          ],
        },
        {
          text: "Sure. Yesterday I wrapped up the landing page and sent it out for review.",
          translation: "好的。昨天我完成了落地页并发出去评审了。",
          expressions: [
            {
              text: "wrapped up",
              meaning: "完成了，收尾了",
              example: "We wrapped up the project last Friday.",
            },
          ],
        },
        {
          text: "Today I'm diving into the onboarding flow — I should have a first draft by end of day.",
          translation: "今天我会深入做引导流程——预计今天结束前出第一版。",
          expressions: [
            {
              text: "diving into",
              meaning: "深入开始做",
              example: "I'm diving into the data analysis this afternoon.",
            },
          ],
        },
        {
          text: "The only thing holding me up is that we still need final copy from marketing.",
          translation: "唯一卡住我的是市场部还没给最终文案。",
          expressions: [
            {
              text: "holding me up",
              meaning: "卡住我、耽误我",
              example: "A missing API key was holding us up.",
            },
          ],
        },
        {
          text: "Got it. I'll ping them after this call. If we get that sorted today, are we still on track for Friday?",
          translation: "明白了。开完会我就去催他们。如果今天搞定的话，周五还来得及吗？",
          expressions: [
            {
              text: "on track for",
              meaning: "按计划推进，来得及",
              example: "We're still on track for the launch date.",
            },
          ],
        },
        {
          text: "Yeah, I think so. As long as there are no surprises, we should be good.",
          translation: "应该可以。只要不出意外，问题不大。",
          expressions: [
            {
              text: "we should be good",
              meaning: "应该没问题",
              example: "If we leave by eight, we should be good.",
            },
          ],
        },
      ],
      practice: {
        type: "retell",
        question:
          "In 1-2 sentences, describe what happened in this standup meeting.",
        options: null,
        referenceAnswer:
          "Sarah finished the landing page and is starting the onboarding flow. She needs marketing to provide the final copy so the team can stay on track for Friday.",
      },
    },
  },
  4: {
    default: {
      sentences: [
        {
          text: "I've been meaning to ask — have you seen that documentary everyone's been talking about?",
          translation: "我一直想问你——你看了最近大家都在讨论的那部纪录片了吗？",
          expressions: [
            {
              text: "I've been meaning to ...",
              meaning: "我一直想要……（但还没做）",
              example: "I've been meaning to call you.",
            },
          ],
        },
        {
          text: "Not yet, but it's been on my list. I keep putting it off because it's three hours long.",
          translation: "还没有，但在我的待看清单里。我一直拖着没看，因为有三个小时。",
          expressions: [
            {
              text: "keep putting it off",
              meaning: "一直拖着不做",
              example: "I keep putting off cleaning my apartment.",
            },
          ],
        },
        {
          text: "I get that. But honestly, once you start, it's hard to look away. The pacing is really well done.",
          translation: "理解。但说真的，一旦开始看就停不下来。节奏把控得很好。",
          expressions: [
            {
              text: "hard to look away",
              meaning: "让人移不开视线",
              example: "The sunset was so beautiful, it was hard to look away.",
            },
          ],
        },
        {
          text: "What stood out to you the most? I've heard mixed things — some people found the second half a bit slow.",
          translation: "你印象最深的是什么？我听到的评价不太一样——有些人觉得后半部分有点慢。",
          expressions: [
            {
              text: "What stood out to you?",
              meaning: "你印象最深的是什么？",
              example: "What stood out to you about the presentation?",
            },
          ],
        },
        {
          text: "I can see where they're coming from, but I think the slow build pays off. The ending really ties everything together.",
          translation: "我能理解他们的看法，但我觉得慢节奏的铺垫是值得的。结尾把所有线索都收拢了。",
          expressions: [
            {
              text: "I can see where they're coming from",
              meaning: "我能理解他们的角度",
              example:
                "I can see where you're coming from, but I disagree.",
            },
            {
              text: "ties everything together",
              meaning: "把所有内容串起来了",
              example:
                "The final chapter really ties everything together.",
            },
          ],
        },
        {
          text: "Alright, you've convinced me. I'll give it a shot this weekend.",
          translation: "好吧，你说服我了。这周末我试试看。",
          expressions: [
            {
              text: "give it a shot",
              meaning: "试试看",
              example: "I've never tried sushi, but I'll give it a shot.",
            },
          ],
        },
      ],
      practice: {
        type: "retell",
        question:
          "Summarize this conversation in 2-3 sentences. What are the two people discussing and what decision was made?",
        options: null,
        referenceAnswer:
          "Two friends are discussing a popular three-hour documentary. One person recommends it highly, saying the slow pacing pays off with a great ending. The other person, who had been putting it off, decides to watch it this weekend.",
      },
    },
  },
};

function pickScenarioTitle(
  input: RecommendScenarioInput
): { scenario: string; domain: Domain } {
  const availableDomains = input.domains.length > 0 ? input.domains : (Object.keys(SCENARIOS) as Domain[]);
  const domain =
    availableDomains[Math.floor(Math.random() * availableDomains.length)];
  const pool = SCENARIOS[domain].filter(
    (s) => !input.recentScenarios.includes(s)
  );
  const title =
    pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : SCENARIOS[domain][Math.floor(Math.random() * SCENARIOS[domain].length)];
  return { scenario: title, domain };
}

export function mockRecommendScenario(
  input: RecommendScenarioInput
): { scenario: string; domain: Domain } {
  return pickScenarioTitle(input);
}

export function mockGenerateScenario(
  input: GenerateScenarioInput
): Scenario {
  const dialogueData =
    MOCK_DIALOGUES[input.difficulty]?.default ?? MOCK_DIALOGUES[2].default;

  const scenarioId = uid();
  const sentences: Sentence[] = dialogueData.sentences
    .slice(0, input.sentenceCount)
    .map((s, idx) => ({
      id: `${scenarioId}-s${idx + 1}`,
      text: s.text,
      translation: s.translation,
      expressions: s.expressions.map((e, eIdx) => ({
        id: `${scenarioId}-e${idx + 1}-${eIdx + 1}`,
        text: e.text,
        meaning: e.meaning,
        example: e.example,
        familiarity: "new" as const,
        savedAt: null,
        sourceScenarioId: scenarioId,
        sourceSentenceText: s.text,
      })),
    }));

  const rec = pickScenarioTitle({
    domains: [input.domain],
    recentScenarios: [],
    difficulty: input.difficulty,
  });

  return {
    id: scenarioId,
    title: rec.scenario,
    description: `A ${input.difficulty <= 2 ? "simple" : "realistic"} conversation about ${rec.scenario.toLowerCase()}.`,
    domain: input.domain,
    difficulty: input.difficulty,
    sentences,
    practicePrompt: dialogueData.practice,
    generatedAt: new Date().toISOString(),
  };
}

export function mockEvaluatePractice(input: {
  practiceType: string;
  userAnswer: string;
  referenceAnswer: string;
}): { correct: boolean; feedback: string } {
  const normalized = (s: string) => s.trim().toLowerCase();
  if (input.practiceType === "comprehension") {
    const correct =
      normalized(input.userAnswer) === normalized(input.referenceAnswer);
    return {
      correct,
      feedback: correct
        ? "That's right! Great understanding."
        : `Not quite — the answer is "${input.referenceAnswer}". Keep going!`,
    };
  }
  if (input.practiceType === "fill-in") {
    const correct = normalized(input.referenceAnswer).includes(
      normalized(input.userAnswer)
    );
    return {
      correct,
      feedback: correct
        ? "Well done! You got the key expression."
        : `The expected answer was "${input.referenceAnswer}". You'll get it next time!`,
    };
  }
  // retell — always encouraging
  const hasContent = input.userAnswer.trim().length > 10;
  return {
    correct: hasContent,
    feedback: hasContent
      ? "Nice retelling! You captured the key points."
      : "Try to write a bit more to capture what happened in the conversation.",
  };
}
