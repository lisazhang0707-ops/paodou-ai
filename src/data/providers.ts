export interface ApiProvider {
  id: string;
  label: string;
  endpoint: string;
  defaultModel: string;
  models: string[];
}

export const API_PROVIDERS: ApiProvider[] = [
  {
    id: "deepseek",
    label: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  {
    id: "doubao",
    label: "豆包 (字节)",
    endpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    defaultModel: "doubao-pro-32k",
    models: ["doubao-pro-32k", "doubao-pro-128k", "doubao-lite-32k"],
  },
  {
    id: "minimax",
    label: "MiniMax",
    endpoint: "https://api.minimax.chat/v1/text/chatcompletion_v2",
    defaultModel: "abab6.5s-chat",
    models: ["abab6.5s-chat", "abab6.5t-chat", "abab5.5s-chat"],
  },
  {
    id: "moonshot",
    label: "Moonshot (月之暗面)",
    endpoint: "https://api.moonshot.cn/v1/chat/completions",
    defaultModel: "moonshot-v1-8k",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
  },
  {
    id: "qwen",
    label: "通义千问 (阿里)",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    defaultModel: "qwen-plus",
    models: ["qwen-plus", "qwen-max", "qwen-turbo"],
  },
  {
    id: "zhipu",
    label: "智谱 GLM",
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    defaultModel: "glm-4",
    models: ["glm-4", "glm-4-flash", "glm-4-plus"],
  },
  {
    id: "custom",
    label: "自定义 (OpenAI 兼容)",
    endpoint: "",
    defaultModel: "",
    models: [],
  },
];
