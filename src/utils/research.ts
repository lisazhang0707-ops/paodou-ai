/**
 * Multi-source research data collection for strategy analysis.
 * Uses Tavily search (parallel queries) + Jina Reader (deep page reading).
 */

import { searchWeb } from "./search";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
}

export interface ResearchResult {
  aspect: string;
  source: "tavily" | "jina";
  url?: string;
  title?: string;
  content: string;
}

export interface ResearchOpts {
  name: string;
  industry?: string;
  type: "company" | "industry" | "benchmark";
  competitor?: string;
  deepRead: boolean;
}

// ---------------------------------------------------------------------------
// Jina Reader
// ---------------------------------------------------------------------------

async function fetchJinaContent(url: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const encoded = encodeURIComponent(url);
    const res = await fetch(`/api/jina/${encoded}`, {
      signal: controller.signal,
      headers: { Accept: "text/markdown" },
    });
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 3000); // per-url cap
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Raw Tavily search (returns structured results for URL extraction)
// ---------------------------------------------------------------------------

async function searchWebRaw(query: string): Promise<TavilyResult[]> {
  const apiKey = localStorage.getItem("tavily_api_key") ?? "";
  if (!apiKey) return [];

  try {
    const res = await fetch("/api/tavily/search", {
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
    if (!res.ok) return [];
    const data: TavilyResponse = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Query templates
// ---------------------------------------------------------------------------

function companyQueries(name: string, industry?: string): string[] {
  const base = [
    `${name} 公司 业务概况 核心业务 竞争优势`,
    `${name} 营收 利润 财务数据 年报 2026`,
    `${name} 竞争对手 市场份额 行业地位${industry ? ` ${industry}` : ""}`,
  ];
  if (industry) {
    base.push(`${industry} 行业趋势 市场规模 增长前景 2026`);
  }
  base.push(`${name} 战略 最新动态 发展方向 2026`);
  return base;
}

function industryQueries(name: string): string[] {
  return [
    `${name} 行业 市场规模 增速 2026`,
    `${name} 竞争格局 主要企业 市场份额`,
    `${name} 行业政策 监管 发展趋势 2026`,
    `${name} 行业 波特五力 进入壁垒 盈利水平`,
  ];
}

function benchmarkQueries(name: string, competitor: string, industry?: string): string[] {
  return [
    `${name} 公司 业务概况 核心优势`,
    `${competitor} 公司 业务概况 核心优势`,
    `${name} vs ${competitor} 对比 竞争${industry ? ` ${industry}` : ""}`,
    `${name} ${competitor} 市场份额 营收对比`,
  ];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function conductResearch(opts: ResearchOpts): Promise<ResearchResult[]> {
  const queries = (() => {
    switch (opts.type) {
      case "industry":
        return industryQueries(opts.name);
      case "benchmark":
        return benchmarkQueries(opts.name, opts.competitor ?? "", opts.industry);
      default:
        return companyQueries(opts.name, opts.industry);
    }
  })();

  // Phase 1: parallel Tavily searches
  const settled = await Promise.allSettled(
    queries.map(async (q, i) => {
      // 200ms stagger to reduce burst pressure
      await new Promise((r) => setTimeout(r, i * 200));
      const text = await searchWeb(q);
      return { aspect: `search_${i}`, source: "tavily" as const, content: text };
    })
  );

  const results: ResearchResult[] = [];
  for (const s of settled) {
    if (s.status === "fulfilled" && s.value.content) {
      results.push(s.value);
    }
  }

  // Phase 2: Jina deep-read top URLs (if enabled)
  if (opts.deepRead) {
    const rawResults = await Promise.allSettled(
      queries.map(async (q, i) => {
        await new Promise((r) => setTimeout(r, i * 200));
        return searchWebRaw(q);
      })
    );

    const allUrls: { url: string; title: string; score: number }[] = [];
    for (const r of rawResults) {
      if (r.status === "fulfilled") {
        for (const item of r.value) {
          allUrls.push({ url: item.url, title: item.title, score: item.score });
        }
      }
    }

    // Deduplicate and take top 3 by score
    const seen = new Set<string>();
    const topUrls = allUrls
      .sort((a, b) => b.score - a.score)
      .filter((u) => {
        if (seen.has(u.url)) return false;
        seen.add(u.url);
        return true;
      })
      .slice(0, 3);

    const deepReads = await Promise.allSettled(
      topUrls.map(async (u) => {
        const content = await fetchJinaContent(u.url);
        return { aspect: "deep_read", source: "jina" as const, url: u.url, title: u.title, content };
      })
    );

    for (const dr of deepReads) {
      if (dr.status === "fulfilled" && dr.value.content) {
        results.push(dr.value);
      }
    }
  }

  return results;
}

export function compileResearchContext(results: ResearchResult[]): string {
  if (!results.length) return "";

  const parts: string[] = ["## 研究资料", ""];

  // Group by source
  const tavily = results.filter((r) => r.source === "tavily");
  const jina = results.filter((r) => r.source === "jina");

  if (tavily.length) {
    parts.push("### 搜索结果");
    for (const r of tavily) {
      parts.push(r.content, "");
    }
  }

  if (jina.length) {
    parts.push("### 深度页面阅读");
    for (const r of jina) {
      parts.push(`**${r.title || r.url}**`, "");
      parts.push(r.content, "");
      parts.push(`[原文链接](${r.url})`, "");
    }
  }

  parts.push("---", "请基于以上研究资料进行战略分析。所有具体数据必须标注来源 URL。", "");
  return parts.join("\n");
}
