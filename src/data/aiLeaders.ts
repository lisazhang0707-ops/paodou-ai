// 2026 全球 AI 一线人物清单 —— 关注大佬，精进学习
// 更新日期：2026-09-18

export interface AiLeader {
  nameZh: string
  nameEn: string
  role: string
  focus: string
  why: string
  links: { label: string; url: string }[]
}

export interface LeaderTier {
  tier: string
  title: string
  subtitle: string
  leaders: AiLeader[]
}

export const leaderTiers: LeaderTier[] = [
  {
    tier: "第一层",
    title: "每天 / 每周看",
    subtitle: "一手信号最密集的 6 个人，值得放在信息流最前面",
    leaders: [
      {
        nameZh: "Andrej Karpathy",
        nameEn: "@karpathy",
        role: "Eureka Labs 创始人 · 前 OpenAI / Tesla AI 总监",
        focus: "AI Coding、LLM、Agent、AI 教育",
        why: "autoresearch、nanochat 等项目正是「AI + Coding + Agent 自己做研究」路线，和你正在做的 Claude Code → Skill → Agent → 自动化几乎同一条路",
        links: [
          { label: "X", url: "https://x.com/karpathy" },
          { label: "YouTube", url: "https://www.youtube.com/@AndrejKarpathy" },
        ],
      },
      {
        nameZh: "Sam Altman",
        nameEn: "@sama",
        role: "OpenAI CEO",
        focus: "AI 产业、模型、Agent、未来趋势",
        why: "AI 产业与产品方向的一手信号源，发布节奏和信息密度都很高",
        links: [{ label: "X", url: "https://x.com/sama" }],
      },
      {
        nameZh: "Dario Amodei",
        nameEn: "@DarioAmodei",
        role: "Anthropic CEO · 联合创始人",
        focus: "Claude、AGI、AI 安全",
        why: "个人网站长文质量极高：AI 未来、能力增长、可解释性、安全，你在重度使用 Claude，他的判断直接影响你的工具链",
        links: [
          { label: "X", url: "https://x.com/DarioAmodei" },
          { label: "个人网站", url: "https://darioamodei.com" },
        ],
      },
      {
        nameZh: "Demis Hassabis",
        nameEn: "@demishassabis",
        role: "Google DeepMind CEO · 联合创始人",
        focus: "Gemini、AGI、Agent、AI for Science",
        why: "经常直接发布 Gemini、Genie、AI for Science 等一手进展",
        links: [{ label: "X", url: "https://x.com/demishassabis" }],
      },
      {
        nameZh: "Aravind Srinivas",
        nameEn: "@AravSrinivas",
        role: "Perplexity CEO",
        focus: "AI Search、Agent、Computer",
        why: "Perplexity 正从搜索 → 答案引擎 → Agent → Computer 演进，是观察「AI 如何吃掉入口」的最佳样本",
        links: [{ label: "X", url: "https://x.com/AravSrinivas" }],
      },
      {
        nameZh: "Yann LeCun",
        nameEn: "@ylecun",
        role: "Meta 首席 AI 科学家 · 深度学习先驱",
        focus: "World Model、JEPA、AGI",
        why: "经常挑战主流 LLM 路线，提出另一套 AGI / World Model 理解，适合建立独立判断能力",
        links: [{ label: "X", url: "https://x.com/ylecun" }],
      },
    ],
  },
  {
    tier: "第二层",
    title: "技术能力提升",
    subtitle: "想往深里学，这 5 个人把技术讲得最透",
    leaders: [
      {
        nameZh: "Jeff Dean",
        nameEn: "@JeffDean",
        role: "Google 首席科学家 · DeepMind",
        focus: "AI 基础设施、模型、工程",
        why: "研究 AI Agent 背后基础设施如何支撑的最佳人选",
        links: [{ label: "X", url: "https://x.com/JeffDean" }],
      },
      {
        nameZh: "Sebastian Raschka",
        nameEn: "@rasbt",
        role: "Lightning AI · LLM 研究工程师",
        focus: "LLM 架构、模型工程",
        why: "把最新 LLM 架构（Qwen、Kimi、Mamba 等）拆解成易懂的文章和图示，技术学习性价比极高",
        links: [{ label: "X", url: "https://x.com/rasbt" }],
      },
      {
        nameZh: "Jim Fan",
        nameEn: "@DrJimFan",
        role: "NVIDIA GEAR 实验室负责人",
        focus: "Agent、机器人、Embodied AI",
        why: "2026 主线是 World Model 与 Physical Turing Test（ENPIRE、RoboTTT），机器人是下一个 AI 战场",
        links: [{ label: "X", url: "https://x.com/DrJimFan" }],
      },
      {
        nameZh: "李飞飞 Fei-Fei Li",
        nameEn: "@drfeifei",
        role: "斯坦福教授 · World Labs 联合创始人",
        focus: "Spatial Intelligence、Computer Vision",
        why: "空间智能是 LLM 之后被讨论最多的下一波方向，她是一手定义者",
        links: [{ label: "X", url: "https://x.com/drfeifei" }],
      },
      {
        nameZh: "Yoshua Bengio",
        nameEn: "@Yoshua_Bengio",
        role: "MILA 创始人 · 蒙特利尔大学教授",
        focus: "深度学习、AI 安全",
        why: "深度学习三巨头之一，近年重点转向 AI 安全与风险治理，提供研究圈的另一视角",
        links: [{ label: "X", url: "https://x.com/Yoshua_Bengio" }],
      },
    ],
  },
  {
    tier: "第三层",
    title: "中国 AI",
    subtitle: "国内一线大模型负责人不靠个人社交账号发声，追公开演讲、论文、访谈、技术博客、产品发布",
    leaders: [
      {
        nameZh: "梁文锋",
        nameEn: "DeepSeek 创始人",
        role: "DeepSeek",
        focus: "推理模型、AI 研发、模型效率",
        why: "DeepSeek 的每次发布都改变行业成本曲线，最值得追的是官方 GitHub 和论文，而不是个人账号",
        links: [
          { label: "官网", url: "https://www.deepseek.com" },
          { label: "GitHub", url: "https://github.com/deepseek-ai" },
        ],
      },
      {
        nameZh: "杨植麟",
        nameEn: "Moonshot 创始人",
        role: "月之暗面 Kimi · 创始人兼 CEO",
        focus: "长上下文、模型、Agent",
        why: "Kimi 是国内 Agent 路线走得最激进的一家，产品发布节奏值得持续盯",
        links: [{ label: "官网", url: "https://www.moonshot.ai" }],
      },
      {
        nameZh: "唐杰",
        nameEn: "智谱 · 清华大学教授",
        role: "智谱AI · 清华大学教授",
        focus: "大模型、Agent、AI 科研",
        why: "GLM 开源体系 + 学术圈双线输出，追智谱技术博客和产品发布",
        links: [{ label: "官网", url: "https://www.zhipuai.cn" }],
      },
      {
        nameZh: "贾扬清",
        nameEn: "@jiayq",
        role: "Intent Lab 创始人兼 CEO · 前 Lepton AI 创始人",
        focus: "AI 基础设施、自主 AI 团队",
        why: "2026 年 7 月官宣新创业 Intent Lab，做「把意图变成生产软件」的自主 AI 团队，是华人里少数持续在 X 高频发声的一线技术人",
        links: [{ label: "X", url: "https://x.com/jiayq" }],
      },
    ],
  },
]

export const platformGuide = [
  {
    platform: "X",
    role: "一手观点",
    desc: "Karpathy、Altman、Hassabis、Amodei 的第一现场。信息最快，也最需要自己过滤。",
    sample: "适合每天刷",
  },
  {
    platform: "YouTube",
    role: "深度访谈",
    desc: "官方频道 + 长访谈：OpenAI、Google DeepMind、Karpathy 频道，一次 1 小时的深聊比 100 条推文信息量大。",
    sample: "适合每周抽时间看",
  },
  {
    platform: "公众号",
    role: "中文解读",
    desc: "DeepSeek、Qwen、Kimi 等国内大模型官方账号 + 中文技术解读，消化成本最低。",
    sample: "适合碎片时间",
  },
]

export const dailyRoutine = [
  {
    time: "10 分钟",
    title: "刷 X · 第一层 6 人",
    desc: "按顺序看 Karpathy、Altman、Amodei、Hassabis、Srinivas、LeCun，值得深读的存进收藏。",
  },
  {
    time: "3 分钟",
    title: "扫国内动态",
    desc: "DeepSeek、Kimi、智谱官方公众号或官网，看有没有新发布、新论文。",
  },
  {
    time: "2 分钟",
    title: "沉淀进知识库",
    desc: "把今天最值得记的一条写进跑豆 AI 知识库：一句话结论 + 原文链接，周末再消化。",
  },
]
