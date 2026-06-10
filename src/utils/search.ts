/**
 * Tavily Search API wrapper
 * API Key stored in localStorage key: "tavily_api_key"
 * Docs: https://docs.tavily.com/api-reference/endpoint/search
 */

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
  query: string;
}

// Dev: proxied through Vite to avoid CORS. Prod: direct (won't work on static hosting without a proxy/function).
const TAVILY_ENDPOINT = "/api/tavily/search";

export function getTavilyKey(): string {
  return localStorage.getItem("tavily_api_key") ?? "";
}

export function setTavilyKey(key: string): void {
  localStorage.setItem("tavily_api_key", key);
}

export async function searchWeb(query: string): Promise<string> {
  const apiKey = getTavilyKey();
  if (!apiKey) throw new Error("请先配置 Tavily Search API Key");

  const res = await fetch(TAVILY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      topic: "news",
      max_results: 5,
      include_answer: "basic",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string })?.message ?? `搜索请求失败 (${res.status})`);
  }

  const data: TavilyResponse = await res.json();
  return formatResults(data);
}

function formatResults(data: TavilyResponse): string {
  const parts: string[] = [];

  if (data.answer) {
    parts.push(`### AI 搜索摘要\n${data.answer}\n`);
  }

  if (data.results?.length) {
    parts.push("### 搜索结果");
    data.results.forEach((r, i) => {
      parts.push(
        `**${i + 1}. [${r.title}](${r.url})**${r.published_date ? ` (${r.published_date})` : ""}\n> ${r.content.slice(0, 300)}`
      );
    });
  }

  return parts.join("\n\n");
}
