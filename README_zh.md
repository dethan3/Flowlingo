# Flowlingo

AI 驱动的英语日常吸收工具，通过真实情景对话自然习得英语。

> [English README →](./README.md)

## 产品简介

Flowlingo 是一个 AI 驱动的英语日常吸收工具。用户每天花 10 分钟，进入一个真实的英语情景对话，逐句理解、积累表达、轻量练习。所有内容由 AI 根据用户的水平和兴趣实时生成，每天都是新鲜的。

它**不是**课程平台、题库、或 AI 聊天伙伴。它是一个有结构的、可完成的、每天都不同的英语吸收循环。

## 核心循环

```
选择情景 → AI 生成对话 → 逐句理解 → 积累表达 → 轻量练习 → 复习旧表达 → 完成
```

每天一个循环，10–15 分钟，完成即走。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| 语言 | TypeScript (strict) |
| 状态管理 | Zustand (localStorage 持久化) |
| 包管理 | pnpm |

## 项目结构

```
src/
├── app/                        # Next.js App Router 页面
│   ├── page.tsx                # 入口 — 重定向到 /setup 或 /today
│   ├── layout.tsx              # 根布局，包含 AppShell
│   ├── setup/                  # 首次设定（难度、领域、时长）
│   ├── today/                  # 每日首页 — 情景卡片、统计、复习提示
│   ├── scenario/[id]/          # 逐句阅读对话
│   ├── practice/[id]/          # 轻量练习（理解题/填空/复述）
│   ├── replay/                 # 表达卡片复习
│   ├── complete/               # 每日循环完成总结
│   ├── library/                # 表达库（带筛选）
│   ├── settings/               # 设置（偏好、重置）
│   └── globals.css             # 设计 token（Tailwind @theme）
├── components/
│   └── app-shell.tsx           # 移动端优先的外壳 + 底部导航
├── types/
│   └── domain.ts               # 核心数据模型
├── state/
│   └── use-flowlingo-store.ts  # Zustand store + 持久化
├── services/
│   └── mock-ai.ts              # Mock AI 服务（情景生成、评估）
├── skills/                     # 可移植的 LLM prompt 模板
│   ├── generate-scenario.md    # Skill 1: 生成情景对话
│   ├── evaluate-practice.md    # Skill 2: 练习评估
│   └── recommend-scenario.md   # Skill 3: 情景推荐
└── data/                       # （预留，暂为空）

docs/
├── designs/
│   ├── product-v2.md                   # 完整产品设计 v2
│   └── english-acquisition-app-plan.md # 初始概念方案
└── plans/
    └── demo-development-plan.md        # 开发计划与阶段状态
```

## 架构：Agent + Skills

- **Agent**（编排层）：管理每日循环流程和状态、追踪用户表达积累和熟悉度、调度 Skills、持久化数据、呈现 UI。Agent 是产品本身，不可移植。
- **Skills**（能力单元）：独立的结构化 prompt 模板，可移植到 ChatGPT / Claude / 任意 LLM。

| Skill | 输入 | 输出 |
|-------|------|------|
| 生成情景对话 | difficulty, domain, scenario, existingExpressions | dialogue + expressions + practicePrompt |
| 练习评估 | practiceType, userAnswer, referenceAnswer | correct + feedback |
| 情景推荐 | domains, recentScenarios, difficulty | scenario title + domain |

Skill prompt 模板位于 `src/skills/`，可独立使用和测试。

## 数据模型

- **UserSettings** — 难度 (1–4)、兴趣领域[]、每日时长 (5/10/15 分钟)
- **Scenario** — AI 生成的情景对话，包含 sentences 和 practicePrompt
- **Sentence** — 英文原文 + 中文翻译 + 可学表达
- **Expression** — 可复用的英语表达，带熟悉度追踪 (new → learning → mastered)
- **PracticePrompt** — 练习题 (comprehension / fill-in / retell)
- **DailyRecord** — 每日完成记录 + 连续天数

所有数据通过 Zustand 持久化到 localStorage。

## 页面与导航

```
/              → 重定向到 /setup 或 /today
/setup         → 首次设定：难度 → 兴趣领域 → 每日时长
/today         → 每日首页（情景卡片、统计、复习提示）
/scenario/[id] → 逐句阅读对话
/practice/[id] → 轻量练习
/replay        → 表达卡片复习
/complete      → 每日完成总结
/library       → 表达库（tab）
/settings      → 设置（tab）
```

底部导航：**Today** · **表达库** · **设置**

循环步骤页面（scenario → practice → replay → complete）不在导航中，从 Today 页面线性进入。

## 当前进度

### ✅ 已实现

- **项目脚手架** — Next.js 15 + App Router + TypeScript + Tailwind CSS 4
- **移动端优先外壳** — 480px 最大宽度、浮动底部导航、自定义设计 token
- **首次设定** — 3 步引导流程（难度 → 兴趣 → 时长）
- **Today 页面** — 情景卡片（生成/换一个）、连续天数、统计、复习提示
- **情景对话** — 逐句推进、翻译切换、表达详情 + 保存
- **练习** — 3 种类型（选择题、填空、复述），反馈 + 跳过
- **复习** — 翻牌卡片，"还不熟" / "记住了" 标记
- **完成页** — 每日总结、表达进度条、连续天数
- **表达库** — 完整列表 + 熟悉度筛选 + 可展开详情
- **设置** — 难度/领域/时长调整、统计、重置数据
- **状态管理** — Zustand + localStorage 持久化、连续天数计算、派生 hooks
- **Mock AI 服务** — 4 个难度等级的模拟对话、情景推荐、练习评估
- **Skill prompt 模板** — 3 个可移植的 markdown prompt 文件

### 🔲 尚未实现

- 真实 AI 集成（通过服务端 Route Handlers 调用 LLM API）
- 音频播放 / TTS
- Service Worker / 离线 PWA 缓存
- 用户认证 & 云同步
- 付费 / 订阅
- 数据分析

---

## 已知短板

以下是对当前代码库的深入分析，按严重程度排列。

> **已修复的问题**（不再列出）：
> - ~~响应式 Bug~~ — `useStore.getState()` 已改为响应式 selector
> - ~~零错误处理~~ — 已添加 Error Boundary、global-error、try/catch + 错误 UI
>
> **有意为之（MVP 阶段）**：
> - Mock 数据局限性 — 当前每个难度只有一套固定对话，这是 MVP 阶段的有意选择，后续接入 LLM 后自然解决

### 🟡 架构与工程问题

#### 1. 无组件抽取 — 页面文件臃肿

全部 UI 直接写在 9 个 page 文件中，没有可复用组件。`components/` 目录下只有一个 `app-shell.tsx`。

按钮、卡片、进度条、筛选标签等样式通过长串 `className` 重复定义，例如 `rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors` 在多个页面中出现。

**影响**：维护成本高，UI 一致性全靠手动复制粘贴。

#### 2. 常量重复定义

`DIFFICULTY_OPTIONS`、`DOMAIN_OPTIONS`、`TIME_OPTIONS` 在 `setup/page.tsx` 和 `settings/page.tsx` 中各定义一遍，内容略有不同（settings 的标签带了 "Level 1 — Beginner" 格式）。

**影响**：修改选项时容易遗漏一处，产生不一致。

#### 3. 路由守卫分散 — 无统一中间件

每个需要保护的页面都独立写 `useEffect` + `router.replace`：

- `today/page.tsx`: `if (!settings) router.replace("/setup")`
- `scenario/[id]/page.tsx`: `if (!scenario) router.replace("/today")`
- `practice/[id]/page.tsx`: `if (!scenario) router.replace("/today")`
- `settings/page.tsx`: `if (!settings) router.replace("/setup")`

没有使用 Next.js middleware 或统一的 guard wrapper。

#### 4. 无 Loading 状态

Mock AI 是同步的所以看不出问题，但一旦接入真实 AI（网络请求），以下场景没有加载态：
- 情景生成（Today 页面）
- 练习评估（Practice 页面）
- 页面切换过程

没有 skeleton、spinner 或 loading placeholder。

#### 5. 无测试

整个项目没有任何测试文件。关键的 store 逻辑（streak 计算、表达保存去重、每日记录更新）没有单元测试。

### 🟢 体验与细节问题

#### 6. 字体未加载

`globals.css` 声明了 `--font-sans: "Inter", ...`，但项目中没有通过 `next/font` 或外部 CDN 加载 Inter 字体。实际显示会回退到系统字体，与设计意图不符。

#### 7. 无障碍性差

整个应用只有 1 个 `aria-` 属性（`app-shell.tsx` 中的 `aria-label="Primary navigation"`）。存在以下问题：
- 按钮没有 `aria-label`（emoji 图标按钮）
- 没有 focus 管理（逐句推进时焦点不跟随）
- 翻牌交互没有 `aria-live` 通知
- 没有 skip navigation 链接

#### 8. 无页面级 metadata

只有根 `layout.tsx` 定义了 `<title>Flowlingo</title>`。所有子页面（Setup、Today、Library 等）都没有独立的 `<title>` 或 `description`，对 SEO 和浏览器标签页辨识不利。

#### 9. 无动画与微交互

- 页面切换没有过渡动画
- 复习翻牌没有翻转动画（直接切换内容）
- 表达保存没有微动画反馈
- 进度条变化是硬切（虽然有 `transition-all`，但用户感知不强）

#### 10. PWA 不完整

`public/` 下有 `icon.svg` 和 `maskable-icon.svg`，但：
- 没有 `manifest.json`（或 Next.js metadata 中的 manifest 配置）
- 没有 Service Worker
- 没有离线回退页面
- 无法安装为 PWA

#### 11. 无国际化基础设施

应用 UI 文本硬编码为英文。虽然对话内容包含中英双语，但界面本身（按钮文字、提示语、标签）没有任何 i18n 抽象。如果要支持中文界面或其他语言，需要大量改造。

#### 12. 无暗色模式

`globals.css` 只定义了浅色主题的设计 token。没有 `@media (prefers-color-scheme: dark)` 支持，也没有手动主题切换功能。

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建
pnpm build
pnpm start
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)，建议使用移动端宽度查看。

## AI 集成计划

当前使用 `src/services/mock-ai.ts` 提供模拟数据。生产环境将：

1. 通过 Next.js Route Handlers (`/api/generate-scenario` 等) 代理 AI 调用
2. API Key 作为服务端环境变量，永不暴露给客户端
3. 用户不感知 AI 的存在，不需要填写 API Key 或选择 provider

## 设计文档

- [`docs/designs/product-v2.md`](docs/designs/product-v2.md) — 完整产品设计 v2（含 Agent+Skills 架构和 AI 层设计）
- [`docs/plans/demo-development-plan.md`](docs/plans/demo-development-plan.md) — 开发计划与阶段状态

## License

Private project.
