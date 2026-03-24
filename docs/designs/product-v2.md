# Flowlingo Product Design v2

Status: Draft
Last Updated: 2026-03-24

## 产品是什么

Flowlingo 是一个 AI 驱动的英语日常吸收工具。

用户每天花 10 分钟，进入一个真实的英语情景对话，逐句理解、积累表达、轻量练习。所有内容由 AI 根据用户的水平和兴趣实时生成，每天都是新鲜的。

它不是课程平台、不是题库、不是 AI 聊天伙伴。它是一个有结构的、可完成的、每天都不同的英语吸收循环。

## 产品不是什么

- 不是 Duolingo — 不靠游戏化刷题
- 不是 AI 聊天伙伴 — 不是自由对话，而是有结构的内容
- 不是课程平台 — 没有课程目录、没有进度树
- 不是考试工具 — 不打分、不排名

## 核心体验循环

```text
选择情景 -> AI 生成对话 -> 逐句理解 -> 积累表达 -> 轻量练习 -> 复习旧表达 -> 完成
```

每天一个循环，10-15 分钟，完成即走。

## 目标用户

想提升英语但不喜欢传统学习方式的人：

- 有一定基础但缺乏日常接触英语的机会
- 不喜欢刷题、背单词、考试式学习
- 希望学到能用的英语而不是语法知识
- 能坚持每天 10 分钟，但不想每天 30 分钟

## 核心原则

1. 每天不一样 — AI 生成内容，用户永远不会重复同样的课
2. 用户掌控难度 — 随时可以调整，不需要系统替你判断
3. 输入为主、输出为辅 — 先理解，再轻量练习，不强迫开口
4. 完成感优先 — 每天有明确的开始和结束，不是无底洞
5. 表达积累可见 — 用户能看到自己积累了多少可用表达

---

## 功能模块

### 模块 1：首次设定 (Setup)

用户第一次打开时完成，之后可在设置中修改。

#### 1.1 难度选择

用户主动选择自己的英语水平：

| 难度 | 标签 | 内容特征 |
|------|------|----------|
| Level 1 | 入门 | 短句、基础词汇、日常简单场景 |
| Level 2 | 基础 | 完整对话、常见表达、生活场景 |
| Level 3 | 进阶 | 较长句子、职场和社交场景、习语和搭配 |
| Level 4 | 流利 | 复杂表达、抽象话题、接近母语者日常对话 |

难度直接影响 AI 生成内容的词汇范围、句子复杂度和情景深度。

#### 1.2 兴趣领域选择

用户选择感兴趣的生活领域（可多选）：

- 日常生活（买东西、吃饭、闲聊）
- 旅行（住宿、交通、问路、观光）
- 工作（会议、邮件、汇报、协作）
- 社交（交朋友、聊兴趣、约活动）
- 文化（电影、音乐、新闻、观点）

兴趣决定 AI 从哪些情景池中选取今天的内容。

#### 1.3 每日时长偏好

用户选择每天愿意花多少时间：

- 5 分钟（短对话加快速复习）
- 10 分钟（标准循环）
- 15 分钟（更长对话加更多练习）

时长影响对话长度和练习数量。

### 模块 2：Today 首页

用户每天打开 app 看到的第一个画面。

#### 2.1 今日情景卡片

显示今天的情景：

- 情景标题（如"在咖啡店帮朋友点单"）
- 难度标签
- 预计时长
- 开始按钮

用户可以刷新换一个不同的情景。

#### 2.2 今日复习提示

如果用户有未熟练的旧表达，显示：

- 你有 N 个表达等待复习
- 快速入口到复习流程

#### 2.3 完成状态

今天的循环完成后：

- 卡片变为完成状态
- 显示今天学到的内容摘要
- 鼓励明天继续

#### 2.4 连续天数

显示用户连续完成循环的天数，作为轻量的坚持激励。

### 模块 3：情景对话 (Scenario Dialogue)

这是产品的核心体验。

#### 3.1 情景生成

用户点击开始后，AI 基于以下信息生成一段对话：

- 用户的难度等级
- 用户的兴趣领域
- 今天选中的具体情景
- 用户已积累的表达（可选：在新对话中自然复现旧表达）

生成内容的结构：

```text
情景标题: Checking in at a hotel
情景描述: You just arrived at a small hotel in London after a long flight.

对话:
  句子 1: { 英文, 中文翻译, 可学表达[] }
  句子 2: { 英文, 中文翻译, 可学表达[] }
  句子 3: ...
  句子 4: ...
  (共 4-8 句，取决于难度和时长)

练习提示: 用自己的话复述这段对话的主要内容
```

#### 3.2 逐句阅读

对话以逐句展开的方式呈现：

- 用户看到第一句，理解后点击继续看下一句
- 每句显示英文原文
- 点击句子可展开中文翻译
- 聚焦当前句，已读句子收起或变淡

#### 3.3 表达标注与保存

每个句子中，AI 标注的可学表达以高亮显示：

- 点击高亮表达弹出释义卡片
- 卡片包含：表达原文、中文含义、一个复用例句
- 用户可点击保存将表达加入自己的表达库
- 已保存的表达有视觉标记

#### 3.4 音频播放（未来）

- 每句配有 AI 语音朗读
- 支持正常速度和慢速
- 这个功能暂不实现，但 UI 预留位置

### 模块 4：轻量练习 (Practice)

对话阅读完成后，进入一个简短的练习环节。

#### 4.1 练习类型

根据难度和内容，系统选择一种练习方式：

| 类型 | 说明 | 适用难度 |
|------|------|----------|
| 关键理解 | 这段对话中发生了什么？选择题 | Level 1-2 |
| 表达填空 | 给出句子框架，用户填入正确的表达 | Level 2-3 |
| 简短复述 | 用 1-2 句话描述这段对话发生了什么，文字输入 | Level 3-4 |

#### 4.2 练习反馈

- 选择题：直接告知对错加解释
- 填空题：对比用户答案和参考答案
- 复述题：AI 判断用户是否抓住了核心意思，给出鼓励性反馈（不纠语法）

#### 4.3 跳过选项

用户可以跳过练习。产品不惩罚跳过，但鼓励参与。

### 模块 5：表达复习 (Replay)

练习之后（或作为独立入口），复习之前保存的表达。

#### 5.1 复习卡片

每次复习 2-3 个表达：

- 正面：表达原文加原句上下文
- 翻转：中文含义加复用例句
- 用户标记：记住了或还不熟

#### 5.2 熟悉度追踪

每个表达有熟悉度状态：

- 新 — 刚保存，未复习
- 学习中 — 复习过但还不熟
- 已掌握 — 多次标记记住了

熟悉度影响复习频率：新的和学习中的表达更频繁出现。

#### 5.3 情景中复现

AI 生成新对话时，可以选择性地把用户学习中的旧表达自然地编入新对话，让用户在新语境中重新遇到它们。这比卡片复习更有效。

### 模块 6：完成反馈 (Completion)

每日循环结束时的反馈画面。

#### 6.1 今日总结

- 今天的情景标题
- 新保存了几个表达
- 练习是否完成
- 复习了几个旧表达

#### 6.2 表达进度

- 累计已保存表达总数
- 已掌握、学习中、新保存的分布

#### 6.3 连续天数更新

- 更新 streak 数字
- 简短鼓励文案

#### 6.4 明日预告（可选）

- 预告明天的情景领域
- 明天见

### 模块 7：表达库 (Expression Library)

用户保存的所有表达的集合。

#### 7.1 表达列表

- 按保存时间排列
- 每个表达显示：原文、含义、熟悉度状态
- 可筛选：全部、新、学习中、已掌握

#### 7.2 表达详情

点击单个表达查看：

- 原始出现的句子和情景
- 中文含义
- 复用例句
- 熟悉度状态

### 模块 8：个人设置 (Settings)

#### 8.1 难度调整

用户随时可以调高或调低难度，立即影响下一次生成的内容。

#### 8.2 兴趣领域调整

用户可以修改感兴趣的领域。

#### 8.3 每日时长调整

修改偏好时长。

#### 8.4 重置数据

清除所有本地数据重新开始（Demo 功能）。

---

## 情景系统设计

### 情景池

情景按领域组织，每个领域下有大量具体情景：

日常生活:
- 在超市买水果
- 在咖啡店点单
- 和室友讨论晚餐
- 在药店买感冒药
- 收快递和快递员交流

旅行:
- 酒店入住
- 在机场问登机口
- 在餐厅点菜
- 打车去景点
- 在火车站买票

工作:
- 团队站会汇报进度
- 写一封请假邮件
- 和同事讨论方案
- 面试自我介绍
- 给客户做简短说明

社交:
- 和新认识的人聊兴趣
- 约朋友周末出去玩
- 在派对上自我介绍
- 和朋友聊最近看的电影

文化:
- 讨论一部热门电影
- 聊一个新闻话题
- 谈论旅行见闻
- 分享一个有趣的故事

AI 每天从用户选择的领域中随机选取一个具体情景来生成对话。用户也可以在 Today 页面刷新换一个情景。

### 难度如何影响同一个情景

以在咖啡店点单为例：

Level 1 入门:
- Hi, can I get a coffee?
- Sure. Small or large?
- Small, please.

Level 3 进阶:
- Hi, I was wondering if you still have any of those oat milk lattes?
- We do. Would you like that iced or hot? And just so you know, we are running a bit low on the oat milk, so I would grab one now if you are interested.
- Iced would be great. Oh, and could I also get a blueberry muffin to go?

同一个场景，不同难度下的词汇量、句子复杂度、对话深度完全不同。

---

## 用户流程

### 首次使用

```text
打开 App
  -> 欢迎页（一句话介绍产品）
  -> 选择难度等级
  -> 选择兴趣领域（可多选）
  -> 选择每日时长
  -> 进入 Today 首页
  -> 开始第一个情景对话
```

### 每日使用

```text
打开 App
  -> Today 首页（看到今日情景）
  -> 点击开始 -> AI 生成对话
  -> 逐句阅读、保存表达
  -> 完成轻量练习
  -> 复习 2-3 个旧表达
  -> 看到完成总结
  -> 关闭 App
```

### 调整难度

```text
打开设置
  -> 修改难度等级
  -> 下次生成的内容立即按新难度
```

---

## 页面结构

```text
/                    入口路由（重定向到 /setup 或 /today）
/setup               首次设定（难度加兴趣加时长）
/today               Today 首页
/scenario/[id]       情景对话页（逐句阅读加表达保存）
/practice/[id]       轻量练习页
/replay              表达复习页
/complete            完成反馈页
/library             表达库
/settings            个人设置
```

底部导航：

```text
[ Today ] [ 表达库 ] [ 设置 ]
```

练习、复习、完成页面不在导航中，它们是每日循环的步骤页面，从 Today 页面线性进入。

---

## 核心数据模型

### UserSettings

```text
difficulty: 1 | 2 | 3 | 4
domains: string[]
dailyMinutes: 5 | 10 | 15
```

### Scenario

```text
id: string
title: string
description: string
domain: string
difficulty: number
sentences: Sentence[]
practicePrompt: PracticePrompt
generatedAt: string
```

### Sentence

```text
id: string
text: string
translation: string
expressions: Expression[]
```

### Expression

```text
id: string
text: string
meaning: string
example: string
familiarity: new | learning | mastered
savedAt: string | null
sourceScenarioId: string
sourceSentenceText: string
```

### PracticePrompt

```text
type: comprehension | fill-in | retell
question: string
options: string[] (for comprehension type)
referenceAnswer: string
```

### DailyRecord

```text
date: string
scenarioId: string
practiceCompleted: boolean
replayCompleted: boolean
expressionsSaved: number
streak: number
```

---

## 架构：Agent + Skills

Flowlingo 本质上是一个 Agent，由编排层和一组可复用的 Skills 构成。

### Agent（编排层）

Agent 是 Flowlingo 产品本身，负责：

- 管理每日循环的流程和状态
- 追踪用户的表达积累和熟悉度
- 根据用户设定调度合适的 Skill
- 持久化用户数据
- 呈现 UI

Agent 是不可移植的，它是产品的壳。

### Skills（可复用的能力单元）

每个 Skill 是一个独立的、结构化的 prompt 模板，接受输入、产出结构化输出。

#### Skill 1: 生成情景对话

```text
输入:
  difficulty: 1-4
  domain: string
  scenario: string
  existingExpressions: Expression[]  (可选，用于情景复现)
  sentenceCount: number

输出:
  title: string
  description: string
  sentences: { text, translation, expressions[] }[]
  practicePrompt: { type, question, options?, referenceAnswer }
```

#### Skill 2: 练习评估

```text
输入:
  practiceType: comprehension | fill-in | retell
  question: string
  userAnswer: string
  referenceAnswer: string

输出:
  correct: boolean
  feedback: string  (鼓励性反馈，不纠语法)
```

#### Skill 3: 情景推荐

```text
输入:
  domains: string[]
  recentScenarios: string[]  (避免重复)
  difficulty: number

输出:
  scenario: string  (具体情景标题)
  domain: string
```

### Skills 的可移植性

每个 Skill 的 prompt 模板是独立的，可以：

- 直接复制到 ChatGPT / Claude 中手动使用
- 接入任意 LLM provider（OpenAI、Anthropic、本地模型）
- 独立测试和迭代，不依赖产品 UI

Flowlingo 的产品价值不在于单个 Skill，而在于把 Skills 编排成一个有结构、有追踪、有积累的完整体验。这是用户直接用 ChatGPT 做不到的。

---

## AI 层设计

### 核心决策：用户不感知 AI 的存在

- 用户视角里没有 API Key、没有模型选择、没有 provider 概念
- 用户付费使用产品，AI 调用是服务端的实现细节
- 换模型供应商对用户完全透明

### 实现方式

- AI 调用通过服务端 API 路由代理（Next.js Route Handlers 或独立后端）
- API Key 作为服务端环境变量，永远不暴露给客户端
- 客户端只调用产品自己的 API，不直接调用 LLM provider

```text
用户操作 -> 客户端请求 /api/generate-scenario -> 服务端调用 LLM -> 返回结构化结果
```

### 成本与付费

- 用户付费模式待定（订阅制或按量），但 AI 成本由产品承担
- 需要控制每日生成次数，避免滥用
- 每个 Skill 调用的 token 消耗应可预估和控制

---

## 与旧版设计的主要变化

| 方面 | 旧版 (v1) | 新版 (v2) |
|------|-----------|-----------|
| 内容来源 | 手写静态课程 | AI 实时生成 |
| 核心单元 | Lesson（课程） | Scenario（情景） |
| 难度系统 | 三级自评 | 四级，用户随时可调 |
| 练习形式 | 仅完成按钮 | 选择题、填空、复述三种 |
| 表达复习 | 简单取最近 3 个 | 熟悉度追踪加情景复现 |
| 导航结构 | 四个 tab | 三个 tab，循环步骤线性推进 |
| 表达库 | 无独立页面 | 独立 tab |
| Onboarding | 四步设定 | 三步设定（去掉 goal，简化为难度加兴趣加时长） |

---

## 暂不实现（明确排除）

- 音频播放和语音输入
- 用户账户和云同步（demo 阶段）
- Service Worker 离线缓存
- 社交功能和排行榜
- 考试和评分系统
- 内容管理后台

## 已决定

1. AI 调用通过服务端 API 路由代理，用户不感知 AI 的存在
2. 情景由 AI 推荐（Skill 3），不需要维护静态情景池
3. 表达复现通过在 Skill 1 的输入中传入用户已学表达实现
4. 产品采用 Agent + Skills 架构，Skills 可独立移植和测试

## 开放问题

1. 练习反馈中 AI 评估的延迟和成本是否可接受？
2. 用户付费模式（订阅制还是按量）？
3. demo 阶段是否需要简单的用户认证来控制访问？
