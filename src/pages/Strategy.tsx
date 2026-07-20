import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import { useChat } from "../hooks/useChat";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { API_PROVIDERS, type ApiProvider } from "../data/providers";
import { buildSystemPrompt, buildUserPrompt, type AnalysisDepth, type AnalysisType } from "../data/strategyPrompts";
import ApiKeyModal from "../components/ApiKeyModal";
import { searchWeb, getTavilyKey, setTavilyKey } from "../utils/search";
import { conductResearch, compileResearchContext } from "../utils/research";
import { ReportChartBlock, type ChartType } from "../components/charts/ReportCharts";

mermaid.initialize({ startOnLoad: false, theme: "base" });

// ---------------------------------------------------------------------------
// Mermaid & Image rendering (from ChatMessage)
// ---------------------------------------------------------------------------

function MermaidBlock({ chart }: { chart: string }) {
  const ref = { current: null as HTMLDivElement | null };
  const id = `mermaid-${Math.random().toString(36).slice(2, 8)}`;
  const elRef = (node: HTMLDivElement | null) => {
    if (!node || ref.current === node) return;
    ref.current = node;
    mermaid
      .render(id, chart)
      .then(({ svg }) => { node.innerHTML = svg; })
      .catch(() => { node.innerHTML = `<p class="text-red-500 text-xs">图表语法错误</p>`; });
  };
  return (
    <div className="my-4 p-4 bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
      <div ref={elRef} className="flex justify-center" />
      <details className="mt-2">
        <summary className="text-xs text-slate-400 cursor-pointer">查看源码</summary>
        <pre className="mt-1 text-xs text-slate-400 whitespace-pre-wrap">{chart}</pre>
      </details>
    </div>
  );
}

function ImagePlaceholder({ query }: { query: string }) {
  const url = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700">
      <img src={url} alt={query} className="w-full h-48 object-cover" loading="lazy" />
      <p className="text-xs text-slate-400 text-center py-1 bg-slate-800">配图：{query}</p>
    </div>
  );
}

const isNumeric = (val: string) => /^\s*-?[\d,]+(\.\d+)?\s*%?\s*$/.test(val);

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-black text-slate-100 mt-8 mb-4 tracking-tight">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-bold text-slate-100 mt-8 mb-4 pl-4 border-l-4 border-blue-500">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-slate-300 leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-slate-300">{children}</li>
  ),
  code: ({
    className, children, ...rest
  }: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    const inline = (rest as { inline?: boolean }).inline ?? /inline/.test(className ?? "");
    const content = String(children ?? "").replace(/\n$/, "");
    const lang = /language-(\w+)/.exec(className ?? "")?.[1];
    if (lang === "mermaid") return <MermaidBlock chart={content} />;
    if (lang?.startsWith("recharts:")) {
      const chartType = lang.replace("recharts:", "") as ChartType;
      return <ReportChartBlock type={chartType} content={content} />;
    }
    return inline ? (
      <code className="bg-slate-700 text-amber-400 px-1.5 py-0.5 rounded text-sm font-mono">{content}</code>
    ) : (
      <pre className="bg-slate-800 p-4 rounded-xl overflow-x-auto text-sm"><code>{content}</code></pre>
    );
  },
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-slate-100">{children}</strong>
  ),
  small: ({ children }: { children?: React.ReactNode }) => (
    <small className="text-xs text-slate-400">{children}</small>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-5 rounded-xl border border-slate-700 shadow-sm">
      <table className="min-w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-slate-800 border-b border-slate-700">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3 py-2.5 text-left font-semibold text-slate-300 border-r border-slate-700 last:border-r-0">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => {
    const text = typeof children === "string" ? children : (Array.isArray(children) ? children.filter((c) => typeof c === "string").join("") : "");
    return (
      <td className={`px-3 py-2.5 text-slate-300 border-r border-slate-700 last:border-r-0 border-b border-slate-800 ${isNumeric(text) ? "text-right font-mono tabular-nums" : ""}`}>
        {children}
      </td>
    );
  },
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (src?.startsWith("image:")) return <ImagePlaceholder query={alt || src.replace("image:", "")} />;
    return <img src={src} alt={alt} className="my-3 rounded-xl max-w-full" loading="lazy" />;
  },
};

function preprocessContent(content: string): string {
  return content.replace(/\[IMAGE:\s*(.+?)\]/g, (_: string, query: string) =>
    `![${query.trim()}](image:${encodeURIComponent(query.trim())})`
  );
}

function extractSources(content: string): { label: string; url: string }[] {
  const seen = new Set<string>();
  const sources: { label: string; url: string }[] = [];
  const re = /\[来源:\s*(.+?)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const url = m[1].trim();
    if (!seen.has(url)) {
      seen.add(url);
      sources.push({ label: `来源 ${sources.length + 1}`, url });
    }
  }
  return sources;
}

function extractConfidence(content: string): string | null {
  const m = content.match(/置信度[：:]\s*(.{1,4})/);
  return m ? m[1].trim() : null;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function Strategy() {
  // ---- form state ----
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [depth, setDepth] = useState<AnalysisDepth>("L2");
  const [type, setType] = useState<AnalysisType>("company");
  const [competitor, setCompetitor] = useState("");
  const [geographic, setGeographic] = useState("中国");

  // ---- URL param pre-fill ----
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const nameParam = searchParams.get("name");
    const marketParam = searchParams.get("market");
    if (nameParam) {
      setName(nameParam.trim());
      // Auto-detect geographic from market: US/EU/JP/KR/TW → global, CN/HK → 中国
      if (marketParam) {
        const globalMarkets = ["us", "eu", "jp", "kr", "tw", "ipo"];
        setGeographic(globalMarkets.includes(marketParam.toLowerCase()) ? "全球" : "中国");
      }
    }
  }, []); // run once on mount

  // ---- API config ----
  const [providerId, setProviderId] = useLocalStorage("ai_provider_strategy", "deepseek");
  const provider = useMemo(
    () => API_PROVIDERS.find((p: ApiProvider) => p.id === providerId) ?? API_PROVIDERS[0],
    [providerId]
  );
  const keyName = `api_key_${providerId}`;
  const [apiKey, setApiKey, clearApiKey] = useLocalStorage(keyName, "");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [model, setModel] = useLocalStorage(`ai_model_strategy_${providerId}`, provider.defaultModel);
  const [customEndpoint, setCustomEndpoint] = useLocalStorage("api_endpoint_custom", "");
  const [customModels] = useLocalStorage("api_models_custom", "");

  const isCustom = providerId === "custom";
  const endpoint = isCustom ? customEndpoint : provider.endpoint;
  const models = isCustom
    ? customModels.split(",").map((s: string) => s.trim()).filter(Boolean)
    : provider.models;

  // ---- web search ----
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [tavilyKey, setTavilyKeyState] = useState(() => getTavilyKey());
  const [searching, setSearching] = useState(false);
  const [researchPhase, setResearchPhase] = useState<"idle" | "searching" | "deepReading" | "generating" | "done">("idle");
  const handleTavilyKeyChange = (key: string) => {
    setTavilyKeyState(key);
    setTavilyKey(key);
  };

  // ---- system prompt ----
  const systemPrompt = useMemo(() => buildSystemPrompt(depth, type), [depth, type]);

  // ---- analysis engine ----
  const { messages, isLoading, error, sendMessage, abortStream, clearMessages } =
    useChat(apiKey, systemPrompt, endpoint, model);

  // ---- derived state ----
  const reportContent = messages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content)
    .join("\n\n");
  const processed = preprocessContent(reportContent);
  const hasContent = reportContent.length > 0;
  const isBusy = isLoading || searching || (researchPhase !== "idle" && researchPhase !== "done");

  // ---- send wrapper (handles web search prepend) ----
  const handleSend = useCallback(async (content: string) => {
    if (searchEnabled && tavilyKey) {
      setSearching(true);
      try {
        const results = await searchWeb(content);
        sendMessage(`[联网搜索结果]\n\n${results}\n\n---\n请基于以上最新信息，结合你的战略分析方法论，回答用户问题。\n\n${content}`);
      } catch (err) {
        sendMessage(`[联网搜索失败：${err instanceof Error ? err.message : "未知错误"}] 请用你的知识回答。\n\n${content}`);
      } finally {
        setSearching(false);
      }
    } else {
      sendMessage(content);
    }
  }, [searchEnabled, tavilyKey, sendMessage]);

  // ---- new analysis (research pipeline → structured prompt → send) ----
  const handleNewAnalysis = useCallback(async () => {
    if (!name.trim() || isBusy) return;
    if (hasContent) clearMessages();

    const doResearch = searchEnabled && tavilyKey;
    if (doResearch) {
      setResearchPhase("searching");
      try {
        const results = await conductResearch({
          name: name.trim(),
          industry: industry.trim() || undefined,
          type,
          competitor: competitor.trim() || undefined,
          deepRead: true,
        });
        setResearchPhase("deepReading");
        const context = compileResearchContext(results);
        setResearchPhase("generating");
        sendMessage(buildUserPrompt({
          name: name.trim(),
          industry: industry.trim() || undefined,
          depth, type,
          competitor: competitor.trim() || undefined,
          geographic,
          researchContext: context || undefined,
        }));
      } catch {
        sendMessage(buildUserPrompt({
          name: name.trim(),
          industry: industry.trim() || undefined,
          depth, type,
          competitor: competitor.trim() || undefined,
          geographic,
        }));
      } finally {
        setResearchPhase("done");
      }
    } else {
      setResearchPhase("generating");
      sendMessage(buildUserPrompt({
        name: name.trim(),
        industry: industry.trim() || undefined,
        depth, type,
        competitor: competitor.trim() || undefined,
        geographic,
      }));
      setResearchPhase("done");
    }
  }, [name, industry, depth, type, competitor, geographic, searchEnabled, tavilyKey, isBusy, hasContent, clearMessages, sendMessage]);

  // ---- follow-up question (keeps context, sends plain text) ----
  const [followUp, setFollowUp] = useState("");
  const followUpRef = useRef<HTMLInputElement>(null);
  const handleFollowUp = useCallback(() => {
    const text = followUp.trim();
    if (!text || isLoading) return;
    setFollowUp("");
    handleSend(text);
  }, [followUp, isLoading, handleSend]);

  // ---- download ----
  const downloadMarkdown = useCallback(() => {
    const allContent = messages.map((m) =>
      m.role === "user" ? `**Q:** ${m.content}` : m.content
    ).join("\n\n---\n\n");
    const blob = new Blob([allContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "战略分析"}_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages, name]);

  const printReport = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Print & report styles */}
      <style>{`
        @media print {
          nav, .no-print, footer { display: none !important; }
          body { font-size: 11pt; color: #1e293b; }
          article { max-width: 100% !important; }
          .chart-container, table, .recharts-wrapper { break-inside: avoid; }
          h2 { break-after: avoid; }
          pre { white-space: pre-wrap; }
          @page { margin: 1.5cm; }
        }
        /* Alternating row colors (non-print) */
        @media screen {
          tbody tr:nth-child(even) td { background: #0f172a; }
          tbody tr:hover td { background: #1e293b; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-10 no-print">
        <h1 className="text-3xl font-black text-slate-100 mb-2">战略分析</h1>
        <p className="text-slate-400">
          基于 Kaplan-Norton 战略管理系统，整合波特五力、VRIO、SWOT、PESTEL、BCG、蓝海战略等经典分析工具
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8 no-print">
        <h2 className="text-lg font-bold text-slate-100 mb-4">分析参数</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              分析对象 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "industry" ? "如：新能源汽车" : "如：比亚迪"}
              className="w-full px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">行业（可选）</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="如：新能源汽车、互联网平台"
              className="w-full px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">分析深度</label>
            <div className="flex gap-2">
              {(["L1", "L2", "L3"] as AnalysisDepth[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    depth === d
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {d === "L1" ? "快速" : d === "L2" ? "标准" : "深度"}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {depth === "L1" ? "2-3个框架，~15分钟" : depth === "L2" ? "5-7个框架，~45分钟" : "全框架+战略地图，~2小时"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">分析类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AnalysisType)}
              className="w-full px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="company">公司战略分析</option>
              <option value="industry">行业吸引力分析</option>
              <option value="benchmark">竞争对手对标</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {type === "benchmark" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                对标公司 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="如：理想汽车"
                className="w-full px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">地理范围</label>
            <select
              value={geographic}
              onChange={(e) => setGeographic(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="中国">中国</option>
              <option value="全球">全球</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleNewAnalysis}
            disabled={isBusy || !name.trim()}
            className="px-8 py-2.5 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            {isBusy ? "分析中..." : hasContent ? "新分析" : "开始分析"}
          </button>
          {isBusy && (
            <button
              onClick={abortStream}
              className="px-6 py-2.5 border border-slate-700 text-slate-400 rounded-full font-medium hover:bg-slate-800 transition-all text-sm"
            >
              中止生成
            </button>
          )}
          {hasContent && !isBusy && (
            <>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reportContent).catch(() => {});
                }}
                className="px-6 py-2.5 border border-slate-700 text-slate-400 rounded-full font-medium hover:bg-slate-800 transition-all text-sm"
              >
                复制全文
              </button>
              <button
                onClick={downloadMarkdown}
                className="px-6 py-2.5 border border-slate-700 text-slate-400 rounded-full font-medium hover:bg-slate-800 transition-all text-sm"
              >
                下载 MD
              </button>
              <button
                onClick={printReport}
                className="px-6 py-2.5 border border-slate-700 text-slate-400 rounded-full font-medium hover:bg-slate-800 transition-all text-sm"
              >
                打印 / PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* API Config (collapsible) */}
      <details className="mb-8 no-print">
        <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-200 transition-colors select-none">
          API 配置 {apiKey ? "(已配置)" : "(未配置)"} {searchEnabled ? "| 联网搜索: 开" : ""}
        </summary>
        <div className="mt-3 p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">服务商</label>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {API_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            {isCustom ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Endpoint</label>
                  <input
                    type="text" value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1/chat/completions"
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Model</label>
                  <input
                    type="text" value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="gpt-4o"
                    className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {models.map((m: string) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setShowKeyModal(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  apiKey
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                }`}
              >
                {apiKey ? `Key: sk-...${apiKey.slice(-4)}` : "设置 API Key"}
              </button>
            </div>
          </div>

          {/* Web search toggle */}
          <div className="border-t border-slate-700 pt-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={searchEnabled}
                  onChange={(e) => setSearchEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                />
                <span className="text-sm text-slate-300">联网搜索 (Tavily)</span>
              </label>
              {searchEnabled && (
                <input
                  type="password"
                  value={tavilyKey}
                  onChange={(e) => handleTavilyKeyChange(e.target.value)}
                  placeholder={tavilyKey ? "Tavily Key 已配置" : "输入 Tavily API Key"}
                  className="flex-1 min-w-[200px] px-3 py-1.5 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              )}
              {searchEnabled && (
                <span className={`text-xs ${tavilyKey ? "text-emerald-400" : "text-amber-400"}`}>
                  {tavilyKey ? "已配置" : "需要 Key → tavily.com 免费注册"}
                </span>
              )}
            </div>
          </div>
        </div>
      </details>

      {/* Report Area */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 min-h-[400px]">
        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-600 font-medium mb-2">分析出错</p>
            <p className="text-sm text-slate-500 mb-4">{error}</p>
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-2 bg-white text-slate-900 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && !isBusy && !hasContent && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">开始你的战略分析</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              输入公司名称或行业，选择分析深度和类型，点击"开始分析"。
              系统将调用 AI 模型，按照 Kaplan-Norton 战略管理框架生成结构化分析报告。
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["比亚迪", "字节跳动", "新能源汽车", "拼多多 vs 京东"].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    if (example.includes("vs")) {
                      const [n, c] = example.split(" vs ");
                      setName(n.trim()); setCompetitor(c.trim()); setType("benchmark");
                    } else if (["新能源汽车", "人工智能", "生物医药"].includes(example)) {
                      setName(example); setType("industry");
                    } else {
                      setName(example); setType("company");
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Research progress indicator */}
        {!error && researchPhase !== "idle" && researchPhase !== "done" && !hasContent && (
          <div className="py-20">
            <div className="max-w-sm mx-auto">
              <div className="flex items-center gap-3 mb-6 p-4 bg-blue-500/10 rounded-xl">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-blue-400 font-medium">
                  {researchPhase === "searching" && "正在多角度搜索..."}
                  {researchPhase === "deepReading" && "正在深度阅读关键页面..."}
                  {researchPhase === "generating" && "正在生成战略分析报告..."}
                </span>
              </div>
              {/* Progress steps */}
              <div className="space-y-2">
                {[
                  { phase: "searching", label: "多角度搜索", desc: "公司概况 / 财务 / 竞争 / 行业趋势" },
                  { phase: "deepReading", label: "深度阅读", desc: "提取关键页面全文内容" },
                  { phase: "generating", label: "生成报告", desc: "AI 整合数据，输出结构化分析" },
                ].map((step) => {
                  const status = researchPhase === step.phase ? "active" :
                    (researchPhase === "deepReading" && step.phase === "searching") ||
                    (researchPhase === "generating" && (step.phase === "searching" || step.phase === "deepReading")) ?
                    "done" : "pending";
                  return (
                    <div key={step.phase} className="flex items-center gap-3 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        status === "done" ? "bg-emerald-500/20 text-emerald-400" :
                        status === "active" ? "bg-blue-500/20 text-blue-400" :
                        "bg-slate-800 text-slate-500"
                      }`}>
                        {status === "done" ? "✓" : (status === "active" ? "·" : "")}
                      </div>
                      <div>
                        <p className={`font-medium ${status === "active" ? "text-blue-400" : status === "done" ? "text-emerald-400" : "text-slate-400"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Streaming indicator (has some content already) */}
        {isBusy && hasContent && (
          <div className="flex items-center gap-3 mb-6 p-3 bg-blue-500/5 rounded-xl">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-blue-400">
              {searching ? "搜索中..." : "生成中..."}
            </span>
          </div>
        )}

        {/* Report document */}
        {hasContent && (
          <div>
            {/* Report Cover */}
            <div className="mb-8 pb-6 border-b-2 border-slate-700">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-100 tracking-tight">{name || "战略分析报告"}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500">{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                      {type === "company" ? "公司分析" : type === "industry" ? "行业分析" : "竞争对手对标"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      depth === "L1" ? "bg-slate-800 text-slate-400" :
                      depth === "L2" ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-purple-500/10 text-purple-400"
                    }`}>
                      {depth === "L1" ? "快速扫描" : depth === "L2" ? "标准分析" : "深度战略"}
                    </span>
                    {extractConfidence(reportContent) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
                        置信度：{extractConfidence(reportContent)}
                      </span>
                    )}
                  </div>
                  {industry && <p className="text-sm text-slate-400 mt-1">行业：{industry} | 地理范围：{geographic}</p>}
                  {type === "benchmark" && competitor && (
                    <p className="text-sm text-slate-500 mt-1">对标：{competitor}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Report body */}
            <article className="prose prose-slate max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {processed}
              </ReactMarkdown>
              {isBusy && !searching && (
                <span className="inline-block w-2.5 h-5 bg-blue-600 animate-pulse rounded-sm ml-0.5 align-text-bottom" />
              )}
            </article>

            {/* Source citations */}
            {(() => {
              const sources = extractSources(reportContent);
              if (!sources.length) return null;
              return (
                <details className="mt-10 pt-6 border-t border-slate-700 no-print">
                  <summary className="text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-200">
                    数据来源（{sources.length} 条引用）
                  </summary>
                  <ol className="mt-3 space-y-1 text-xs text-slate-500 list-decimal pl-5">
                    {sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                          {s.url}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              );
            })()}
          </div>
        )}

        {/* Done + follow-up */}
        {hasContent && !isBusy && (
          <div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between no-print">
              <span className="text-xs text-slate-400">
                报告生成完成 — 下方可继续追问，AI 会基于上下文回答
              </span>
            </div>

            {/* Follow-up input */}
            <div className="mt-4 flex gap-2 no-print">
              <input
                ref={followUpRef}
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleFollowUp(); }}
                placeholder={'追问：如「请详细展开五力分析」「这家公司最大的风险是什么？」'}
                className="flex-1 px-4 py-2.5 border border-slate-700 bg-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                onClick={handleFollowUp}
                disabled={!followUp.trim()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
              >
                发送
              </button>
            </div>
          </div>
        )}
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
        onClear={clearApiKey}
        providerLabel={provider.label}
      />
    </div>
  );
}
