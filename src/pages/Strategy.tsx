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
import { parseFile } from "../utils/parseFile";

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
    <div className="my-4 p-4 bg-[#f5f0ea] rounded-xl border border-[#e8e3dc] overflow-x-auto">
      <div ref={elRef} className="flex justify-center" />
      <details className="mt-2">
        <summary className="text-xs text-[#8a827c] cursor-pointer">查看源码</summary>
        <pre className="mt-1 text-xs text-[#8a827c] whitespace-pre-wrap">{chart}</pre>
      </details>
    </div>
  );
}

function ImagePlaceholder({ query }: { query: string }) {
  const url = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#e8e3dc]">
      <img src={url} alt={query} className="w-full h-48 object-cover" loading="lazy" />
      <p className="text-xs text-[#8a827c] text-center py-1 bg-[#f5f0ea]">配图：{query}</p>
    </div>
  );
}

const isNumeric = (val: string) => /^\s*-?[\d,]+(\.\d+)?\s*%?\s*$/.test(val);

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-black text-[#3d3835] mt-8 mb-4 tracking-tight">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-bold text-[#3d3835] mt-8 mb-4 pl-4 border-l-4 border-blue-500">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-[#3d3835] mt-6 mb-3">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-base font-semibold text-[#3d3835] mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[#6b6560] leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[#6b6560]">{children}</li>
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
      <code className="bg-[#f5f0ea] text-amber-600 px-1.5 py-0.5 rounded text-sm font-mono">{content}</code>
    ) : (
      <pre className="bg-[#f5f0ea] p-4 rounded-xl overflow-x-auto text-sm"><code>{content}</code></pre>
    );
  },
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[#3d3835]">{children}</strong>
  ),
  small: ({ children }: { children?: React.ReactNode }) => (
    <small className="text-xs text-[#8a827c]">{children}</small>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-5 rounded-xl border border-[#e8e3dc] shadow-sm">
      <table className="min-w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-[#f5f0ea] border-b border-[#e8e3dc]">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3 py-2.5 text-left font-semibold text-[#6b6560] border-r border-[#e8e3dc] last:border-r-0">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => {
    const text = typeof children === "string" ? children : (Array.isArray(children) ? children.filter((c) => typeof c === "string").join("") : "");
    return (
      <td className={`px-3 py-2.5 text-[#6b6560] border-r border-[#e8e3dc] last:border-r-0 border-b border-[#e8e3dc] ${isNumeric(text) ? "text-right font-mono tabular-nums" : ""}`}>
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
  const [searchEnabled, setSearchEnabled] = useState(true); // default ON when no files
  const [tavilyKey, setTavilyKeyState] = useState(() => getTavilyKey());
  const [searching, setSearching] = useState(false);
  const [researchPhase, setResearchPhase] = useState<"idle" | "searching" | "deepReading" | "generating" | "done">("idle");
  const handleTavilyKeyChange = (key: string) => {
    setTavilyKeyState(key);
    setTavilyKey(key);
  };

  // ---- file upload ----
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; content: string }[]>([]);
  const [fileParsing, setFileParsing] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = useCallback(async (file: File) => {
    setFileError(null);
    setFileParsing(true);
    try {
      const result = await parseFile(file);
      setUploadedFiles((prev) => [...prev, { name: result.fileName, content: result.text }]);
      // when user uploads files, they may still want web search — but we let them decide
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "文件解析失败");
    } finally {
      setFileParsing(false);
    }
  }, []);

  const handleFileRemove = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const totalFileChars = uploadedFiles.reduce((sum, f) => sum + f.content.length, 0);

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

    // build file context from uploaded files
    const fileContext = uploadedFiles.length > 0
      ? `\n\n[本地上传资料]\n\n${uploadedFiles.map((f) => `### ${f.name}\n\n${f.content.slice(0, 8000)}${f.content.length > 8000 ? "\n\n...(内容过长，已截断前8000字)" : ""}`).join("\n\n---\n\n")}\n\n---\n请基于以上本地资料，结合你的战略分析方法论，回答用户问题。\n\n`
      : "";

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
          researchContext: (context || "") + fileContext,
        }));
      } catch {
        sendMessage(buildUserPrompt({
          name: name.trim(),
          industry: industry.trim() || undefined,
          depth, type,
          competitor: competitor.trim() || undefined,
          geographic,
          researchContext: fileContext || undefined,
        }));
      } finally {
        setResearchPhase("done");
      }
    } else if (fileContext) {
      // files only, no web search
      setResearchPhase("generating");
      sendMessage(buildUserPrompt({
        name: name.trim(),
        industry: industry.trim() || undefined,
        depth, type,
        competitor: competitor.trim() || undefined,
        geographic,
        researchContext: fileContext,
      }));
      setResearchPhase("done");
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
  }, [name, industry, depth, type, competitor, geographic, searchEnabled, tavilyKey, isBusy, hasContent, uploadedFiles, clearMessages, sendMessage]);

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
        <h1 className="text-3xl font-black text-[#3d3835] mb-2">战略分析</h1>
        <p className="text-[#8a827c]">
          基于 Kaplan-Norton 战略管理系统，整合波特五力、VRIO、SWOT、PESTEL、BCG、蓝海战略等经典分析工具
        </p>
      </div>

      {/* ======== Kaplan-Norton 框架体系 ======== */}
      <section className="mb-10 no-print">
        <h2 className="text-lg font-bold text-[#3d3835] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#c2785e] rounded-full inline-block" />
          Kaplan-Norton 战略管理体系
        </h2>

        {/* 三大支柱 */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            {
              id: "strategy-map",
              title: "战略地图",
              subtitle: "Strategy Map",
              desc: '将战略转化为四维度因果链路，回答"我们如何创造价值"',
              steps: ["确定股东价值差距（财务）", "明确客户价值主张（客户）", "选择关键内部流程（流程）", "确定战略就绪度（学习与成长）"],
              archetypes: ["总成本最低", "产品领先", "全面客户解决方案", "系统锁定"],
              color: "#c2785e",
            },
            {
              id: "bsc",
              title: "平衡计分卡",
              subtitle: "Balanced Scorecard",
              desc: "四维度 KPI 体系，滞后指标+领先指标双轮驱动",
              perspectives: [
                { name: "财务", kpis: "收入增长·生产率·资产利用" },
                { name: "客户", kpis: "份额·获客·满意度·NPS" },
                { name: "内部流程", kpis: "运营·客户管理·创新·合规" },
                { name: "学习与成长", kpis: "人力资本·信息资本·组织资本" },
              ],
              color: "#6366f1",
            },
            {
              id: "sfo",
              title: "战略中心型组织",
              subtitle: "Strategy-Focused Organization",
              desc: "五大原则确保战略不只是一张纸，而是每个人的日常工作",
              principles: [
                "高层领导推动变革",
                "将战略转化为可操作的术语",
                "使组织围绕战略协同化",
                "让战略成为每个人的日常工作",
                "使战略成为持续性流程",
              ],
              color: "#10b981",
            },
          ].map((pillar) => (
            <details key={pillar.id} className="group bg-white rounded-2xl border border-[#e8e3dc] hover:border-[#c2785e]/30 transition-all">
              <summary className="p-5 cursor-pointer select-none marker:hidden flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{ background: pillar.color }}>
                  {pillar.id === "strategy-map" ? "🗺️" : pillar.id === "bsc" ? "📊" : "🏛️"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#3d3835] text-sm">{pillar.title}</h3>
                    <span className="text-xs text-[#b8b0a8]">{pillar.subtitle}</span>
                  </div>
                  <p className="text-xs text-[#8a827c] mt-1 leading-relaxed">{pillar.desc}</p>
                </div>
                <svg className="w-4 h-4 text-[#b8b0a8] mt-2 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>

              {/* Expanded content */}
              <div className="px-5 pb-5 space-y-3 border-t border-[#f0ebe4] pt-4 mx-5">
                {pillar.id === "strategy-map" && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-[#6b6560] mb-2">四步构建法</p>
                      <div className="space-y-1.5">
                        {(pillar as any).steps.map((s: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#8a827c]">
                            <span className="w-5 h-5 rounded-full bg-[#f5f0ea] flex items-center justify-center text-[10px] font-bold text-[#c2785e]">{i + 1}</span>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#6b6560] mb-2">四种通用战略原型</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(pillar as any).archetypes.map((a: string) => (
                          <span key={a} className="px-2 py-1 rounded-full text-[10px] bg-[#c2785e]/5 text-[#c2785e] font-medium">{a}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => { setName(""); setType("company"); setDepth("L3"); }}
                      className="w-full text-center text-xs text-[#c2785e] font-medium hover:underline"
                    >
                      用战略地图分析你的公司（L3深度）→
                    </button>
                  </>
                )}

                {pillar.id === "bsc" && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-[#6b6560] mb-2">四维度与典型指标</p>
                      <div className="space-y-2">
                        {(pillar as any).perspectives.map((p: any) => (
                          <div key={p.name} className="flex items-start gap-2 text-xs">
                            <span className="font-semibold text-[#3d3835] min-w-[60px]">{p.name}</span>
                            <span className="text-[#8a827c]">{p.kpis}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#faf7f2] rounded-xl p-3 text-xs text-[#8a827c] leading-relaxed">
                      <span className="font-semibold text-[#6b6560]">指标设计原则</span>：每个战略目标配 1-2 个滞后指标（结果）+ 1-2 个领先指标（驱动因素）
                    </div>
                  </>
                )}

                {pillar.id === "sfo" && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-[#6b6560] mb-2">五大原则</p>
                      <div className="space-y-1.5">
                        {(pillar as any).principles.map((p: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#8a827c]">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#faf7f2] rounded-xl p-3 text-xs text-[#8a827c] leading-relaxed">
                      <span className="font-semibold text-[#6b6560]">双循环管理</span>：运营回顾会（周/月）+ 战略学习会（季度），战略不是一年一次的活动
                    </div>
                  </>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* 分析工具箱 — 框架速览 */}
        <h2 className="text-lg font-bold text-[#3d3835] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#6366f1] rounded-full inline-block" />
          分析工具箱
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { label: "PESTEL", desc: "宏观环境六维度扫描", category: "外部环境" },
            { label: "波特五力", desc: "行业竞争结构分析", category: "外部环境" },
            { label: "VRIO", desc: "资源与能力审计", category: "内部能力" },
            { label: "价值链", desc: "成本优势与差异化来源", category: "内部能力" },
            { label: "SWOT/TOWS", desc: "内外交叉矩阵生成战略选项", category: "综合" },
            { label: "BCG 矩阵", desc: "业务组合与资源配置", category: "综合" },
            { label: "蓝海战略", desc: "ERRC 四步动作创造新市场", category: "战略选择" },
            { label: "安索夫矩阵", desc: "增长方向选择：市场×产品", category: "战略选择" },
          ].map((tool) => (
            <div
              key={tool.label}
              className="bg-white rounded-xl border border-[#e8e3dc] p-4 hover:border-[#c2785e]/30 hover:-translate-y-0.5 transition-all"
            >
              <p className="text-xs text-[#b8b0a8] mb-0.5">{tool.category}</p>
              <p className="font-bold text-[#3d3835] text-sm mb-1">{tool.label}</p>
              <p className="text-xs text-[#8a827c] leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-[#e8e3dc] p-6 mb-8 no-print">
        <h2 className="text-lg font-bold text-[#3d3835] mb-4">分析参数</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#6b6560] mb-1">
              分析对象 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "industry" ? "如：新能源汽车" : "如：比亚迪"}
              className="w-full px-4 py-2.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 focus:border-[#c2785e] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b6560] mb-1">行业（可选）</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="如：新能源汽车、互联网平台"
              className="w-full px-4 py-2.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 focus:border-[#c2785e] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b6560] mb-2">分析深度</label>
            <div className="flex gap-2">
              {(["L1", "L2", "L3"] as AnalysisDepth[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    depth === d
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-[#f5f0ea] text-[#8a827c] hover:bg-[#f0ebe4]"
                  }`}
                >
                  {d === "L1" ? "快速" : d === "L2" ? "标准" : "深度"}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#8a827c] mt-1">
              {depth === "L1" ? "2-3个框架，~15分钟" : depth === "L2" ? "5-7个框架，~45分钟" : "全框架+战略地图，~2小时"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b6560] mb-1">分析类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AnalysisType)}
              className="w-full px-4 py-2.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 focus:border-[#c2785e] transition-all"
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
              <label className="block text-sm font-medium text-[#6b6560] mb-1">
                对标公司 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="如：理想汽车"
                className="w-full px-4 py-2.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 focus:border-[#c2785e] transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#6b6560] mb-1">地理范围</label>
            <select
              value={geographic}
              onChange={(e) => setGeographic(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 focus:border-[#c2785e] transition-all"
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
            className="px-8 py-2.5 bg-[#c2785e] text-white rounded-full font-medium hover:bg-[#b0684e] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            {isBusy ? "分析中..." : hasContent ? "新分析" : "开始分析"}
          </button>
          {isBusy && (
            <button
              onClick={abortStream}
              className="px-6 py-2.5 border border-[#e8e3dc] text-[#8a827c] rounded-full font-medium hover:bg-[#f5f0ea] transition-all text-sm"
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
                className="px-6 py-2.5 border border-[#e8e3dc] text-[#8a827c] rounded-full font-medium hover:bg-[#f5f0ea] transition-all text-sm"
              >
                复制全文
              </button>
              <button
                onClick={downloadMarkdown}
                className="px-6 py-2.5 border border-[#e8e3dc] text-[#8a827c] rounded-full font-medium hover:bg-[#f5f0ea] transition-all text-sm"
              >
                下载 MD
              </button>
              <button
                onClick={printReport}
                className="px-6 py-2.5 border border-[#e8e3dc] text-[#8a827c] rounded-full font-medium hover:bg-[#f5f0ea] transition-all text-sm"
              >
                打印 / PDF
              </button>
            </>
          )}
        </div>

        {/* File upload area */}
        <div className="mt-5 pt-5 border-t border-[#f0ebe4]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[#6b6560]">📎 上传本地资料（可选）</label>
            <span className="text-xs text-[#b8b0a8]">PDF / DOCX / TXT</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileAdd(file);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="hidden"
          />

          {/* uploaded file list */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 mb-3">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#faf7f2] rounded-xl p-3 border border-[#e8e3dc]">
                  <svg className="w-5 h-5 text-[#c2785e] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3d3835] truncate">{f.name}</p>
                    <p className="text-xs text-[#b8b0a8]">{(f.content.length / 1000).toFixed(1)}k 字符</p>
                  </div>
                  <button
                    onClick={() => handleFileRemove(i)}
                    className="text-[#b8b0a8] hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="text-xs text-[#8a827c] text-right">
                合计 {totalFileChars > 1000 ? (totalFileChars / 1000).toFixed(1) + "k" : totalFileChars} 字符
              </div>
            </div>
          )}

          {/* parsing indicator */}
          {fileParsing && (
            <div className="flex items-center gap-2 text-sm text-[#c2785e] mb-3">
              <div className="w-4 h-4 border-2 border-[#c2785e]/20 border-t-[#c2785e] rounded-full animate-spin" />
              正在解析文件...
            </div>
          )}

          {/* file error */}
          {fileError && (
            <div className="text-sm text-red-500 mb-3">{fileError}</div>
          )}

          {/* drop / browse zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#e8e3dc] rounded-xl p-6 text-center cursor-pointer hover:border-[#c2785e] hover:bg-[#faf7f2] transition-all"
          >
            <svg className="w-8 h-8 text-[#b8b0a8] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-[#6b6560]">
              {uploadedFiles.length > 0 ? "继续添加文件" : "点击上传或拖拽文件"}
            </p>
            <p className="text-xs text-[#b8b0a8] mt-1">
              支持 PDF、DOCX、TXT，单文件建议不超过 20MB
            </p>
          </div>
        </div>
      </div>

      {/* API Config (collapsible) */}
      <details className="mb-8 no-print">
        <summary className="text-sm text-[#8a827c] cursor-pointer hover:text-[#3d3835] transition-colors select-none">
          API 配置 {apiKey ? "(已配置)" : "(未配置)"} {searchEnabled ? "| 联网搜索: 开" : ""}
        </summary>
        <div className="mt-3 p-4 bg-[#f5f0ea] rounded-xl border border-[#e8e3dc] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8a827c] mb-1">服务商</label>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="w-full px-3 py-2 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {API_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            {isCustom ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#8a827c] mb-1">Endpoint</label>
                  <input
                    type="text" value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1/chat/completions"
                    className="w-full px-3 py-2 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8a827c] mb-1">Model</label>
                  <input
                    type="text" value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="gpt-4o"
                    className="w-full px-3 py-2 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[#8a827c] mb-1">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-100"
                    : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                {apiKey ? `Key: sk-...${apiKey.slice(-4)}` : "设置 API Key"}
              </button>
            </div>
          </div>

          {/* Data source mode indicator */}
          <div className="border-t border-[#e8e3dc] pt-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-[#8a827c]">数据来源：</span>

              {/* file status */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                uploadedFiles.length > 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-[#f5f0ea] text-[#b8b0a8]"
              }`}>
                📎 本地{uploadedFiles.length > 0 ? ` ${uploadedFiles.length}个文件` : "无"}
              </span>

              <span className="text-xs text-[#b8b0a8]">+</span>

              {/* web search toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={searchEnabled}
                  onChange={(e) => setSearchEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  searchEnabled && tavilyKey
                    ? "bg-blue-50 text-blue-600"
                    : "bg-[#f5f0ea] text-[#b8b0a8]"
                }`}>
                  联网搜索{searchEnabled && tavilyKey ? " ✓" : ""}
                </span>
              </label>

              {searchEnabled && !tavilyKey && (
                <input
                  type="password"
                  value={tavilyKey}
                  onChange={(e) => handleTavilyKeyChange(e.target.value)}
                  placeholder="输入 Tavily API Key → tavily.com 免费注册"
                  className="flex-1 min-w-[200px] px-3 py-1.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              )}

              {uploadedFiles.length === 0 && !tavilyKey && searchEnabled && (
                <span className="text-xs text-amber-600">需要 Key 才能联网，或上传本地文件</span>
              )}
            </div>
          </div>
        </div>
      </details>

      {/* Report Area */}
      <div className="bg-white rounded-2xl border border-[#e8e3dc] p-6 md:p-8 min-h-[400px]">
        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-600 font-medium mb-2">分析出错</p>
            <p className="text-sm text-[#b8b0a8] mb-4">{error}</p>
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-2 bg-[#c2785e] text-white rounded-full text-sm font-medium hover:bg-[#b0684e] transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && !isBusy && !hasContent && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-[#3d3835] mb-2">开始你的战略分析</h3>
            <p className="text-sm text-[#8a827c] max-w-md mx-auto leading-relaxed">
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
                  className="px-3 py-1.5 bg-[#f5f0ea] border border-[#e8e3dc] rounded-full text-xs text-[#8a827c] hover:bg-[#f0ebe4] hover:text-[#3d3835] transition-colors"
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
              <div className="flex items-center gap-3 mb-6 p-4 bg-[#c2785e]/10 rounded-xl">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#c2785e] font-medium">
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
                        status === "done" ? "bg-emerald-100 text-emerald-600" :
                        status === "active" ? "bg-[#c2785e]/15 text-[#c2785e]" :
                        "bg-[#f5f0ea] text-[#b8b0a8]"
                      }`}>
                        {status === "done" ? "✓" : (status === "active" ? "·" : "")}
                      </div>
                      <div>
                        <p className={`font-medium ${status === "active" ? "text-[#c2785e]" : status === "done" ? "text-emerald-600" : "text-[#8a827c]"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-[#8a827c]">{step.desc}</p>
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
          <div className="flex items-center gap-3 mb-6 p-3 bg-[#c2785e]/5 rounded-xl">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#c2785e]">
              {searching ? "搜索中..." : "生成中..."}
            </span>
          </div>
        )}

        {/* Report document */}
        {hasContent && (
          <div>
            {/* Report Cover */}
            <div className="mb-8 pb-6 border-b-2 border-[#e8e3dc]">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#3d3835] tracking-tight">{name || "战略分析报告"}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#b8b0a8]">{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#c2785e]/10 text-[#c2785e] font-medium">
                      {type === "company" ? "公司分析" : type === "industry" ? "行业分析" : "竞争对手对标"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      depth === "L1" ? "bg-[#f5f0ea] text-[#8a827c]" :
                      depth === "L2" ? "bg-emerald-50 text-emerald-600" :
                      "bg-purple-100 text-purple-600"
                    }`}>
                      {depth === "L1" ? "快速扫描" : depth === "L2" ? "标准分析" : "深度战略"}
                    </span>
                    {extractConfidence(reportContent) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                        置信度：{extractConfidence(reportContent)}
                      </span>
                    )}
                  </div>
                  {industry && <p className="text-sm text-[#8a827c] mt-1">行业：{industry} | 地理范围：{geographic}</p>}
                  {type === "benchmark" && competitor && (
                    <p className="text-sm text-[#b8b0a8] mt-1">对标：{competitor}</p>
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
                <details className="mt-10 pt-6 border-t border-[#e8e3dc] no-print">
                  <summary className="text-sm font-medium text-[#8a827c] cursor-pointer hover:text-[#3d3835]">
                    数据来源（{sources.length} 条引用）
                  </summary>
                  <ol className="mt-3 space-y-1 text-xs text-[#b8b0a8] list-decimal pl-5">
                    {sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#c2785e] hover:underline break-all">
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
            <div className="mt-8 pt-4 border-t border-[#e8e3dc] flex items-center justify-between no-print">
              <span className="text-xs text-[#8a827c]">
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
                className="flex-1 px-4 py-2.5 border border-[#e8e3dc] bg-white text-[#3d3835] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 focus:border-[#c2785e] transition-all"
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
