import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import DashboardNav from "../components/DashboardNav";
import {
  LANDSCAPE_COMPANIES,
  getMarketDistribution,
  getChainDistribution,
  getSubGroupDistribution,
  getFinanceUrl,
  CHAIN_META,
  MARKET_LABELS,
  UNIQUE_MARKETS,
} from "../data/aiLandscape";
import type { Market, ChainLevel } from "../data/aiLandscape";

const MARKET_COLORS: Record<Market, string> = {
  us: "#3b82f6",
  cn: "#ef4444",
  hk: "#10b981",
  eu: "#f59e0b",
  jp: "#8b5cf6",
  kr: "#06b6d4",
  tw: "#f97316",
  ipo: "#94a3b8",
};

const CHAIN_LABELS: Record<ChainLevel, string> = {
  upstream: "上游",
  midstream: "中游",
  downstream: "下游",
};

type SortKey = "name" | "ticker" | "market" | "chain" | "subGroup";

export default function AIChainDashboard() {
  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState<Market | "all">("all");
  const [chainFilter, setChainFilter] = useState<ChainLevel | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ---- KPI ----
  const kpis = useMemo(() => {
    const upstreamCount = LANDSCAPE_COMPANIES.filter((c) => c.chain === "upstream").length;
    const midstreamCount = LANDSCAPE_COMPANIES.filter((c) => c.chain === "midstream").length;
    const downstreamCount = LANDSCAPE_COMPANIES.filter((c) => c.chain === "downstream").length;
    const subGroups = new Set(LANDSCAPE_COMPANIES.map((c) => c.subGroup));
    return {
      total: LANDSCAPE_COMPANIES.length,
      markets: UNIQUE_MARKETS.length,
      chainBreakdown: `${upstreamCount} / ${midstreamCount} / ${downstreamCount}`,
      subGroups: subGroups.size,
    };
  }, []);

  // ---- Chart data ----
  const marketData = useMemo(() => getMarketDistribution(), []);
  const chainData = useMemo(() => getChainDistribution(), []);
  const subGroupData = useMemo(() => getSubGroupDistribution().slice(0, 12), []);

  // Stacked bar: chain × market
  const chainMarketData = useMemo(() => {
    const levels: ChainLevel[] = ["upstream", "midstream", "downstream"];
    return levels.map((level) => {
      const companies = LANDSCAPE_COMPANIES.filter((c) => c.chain === level);
      const entry: Record<string, number | string> = { name: CHAIN_LABELS[level] };
      for (const m of UNIQUE_MARKETS) {
        entry[MARKET_LABELS[m]] = companies.filter((c) => c.market === m).length;
      }
      return entry;
    });
  }, []);

  // ---- Filtered & sorted table ----
  const filteredCompanies = useMemo(() => {
    let list = LANDSCAPE_COMPANIES;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q)
      );
    }
    if (marketFilter !== "all") {
      list = list.filter((c) => c.market === marketFilter);
    }
    if (chainFilter !== "all") {
      list = list.filter((c) => c.chain === chainFilter);
    }
    const sorted = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" && typeof bv === "string"
        ? av.localeCompare(bv, "zh")
        : String(av).localeCompare(String(bv), "zh");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [search, marketFilter, chainFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  // ---- Render ----
  return (
    <div>
      <DashboardNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-[#3d3835] mb-1">AI产业链可视化分析</h1>
        <p className="text-sm text-[#8a827c] mb-8">
          全球AI产业链上市公司全景 · 上游基础设施 / 中游算力平台 / 下游应用场景
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "覆盖公司总数", value: kpis.total, unit: "家" },
            { label: "覆盖市场", value: kpis.markets, unit: "个市场" },
            { label: "上 / 中 / 下游", value: kpis.chainBreakdown, unit: "家" },
            { label: "覆盖子领域", value: kpis.subGroups, unit: "个" },
          ].map((k) => (
            <div key={k.label} className="p-4 rounded-2xl border border-[#e8e3dc] bg-white">
              <div className="text-xs text-[#b8b0a8] mb-1">{k.label}</div>
              <div className="text-xl font-black text-[#3d3835]">
                {typeof k.value === "number" ? k.value.toLocaleString() : k.value}
                {k.unit !== "家" && k.unit !== "个" && k.unit !== "个市场" ? "" : ""}
                <span className="text-sm font-normal text-[#8a827c] ml-1">{k.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Market Pie */}
          <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white">
            <h3 className="text-sm font-bold text-[#6b6560] mb-4">市场分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {marketData.map((entry) => (
                    <Cell key={entry.market} fill={MARKET_COLORS[entry.market]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} 家`, "公司数"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chain Level Bar */}
          <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white">
            <h3 className="text-sm font-bold text-[#6b6560] mb-4">产业链层级分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                <XAxis dataKey="name" tick={false} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value} 家`, "公司数"]} />
                <Bar dataKey="value" name="公司数" radius={[4, 4, 0, 0]}>
                  {chainData.map((entry) => (
                    <Cell key={entry.chain} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SubGroup Horizontal Bar */}
          <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white">
            <h3 className="text-sm font-bold text-[#6b6560] mb-4">子领域公司数量（Top 12）</h3>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={subGroupData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  width={140}
                />
                <Tooltip formatter={(value) => [`${value} 家`, "公司数"]} />
                <Bar dataKey="value" name="公司数" radius={[0, 4, 4, 0]}>
                  {subGroupData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.chain === "upstream" ? "#dc2626" : entry.chain === "midstream" ? "#ea580c" : "#6366f1"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chain × Market Stacked Bar */}
          <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white">
            <h3 className="text-sm font-bold text-[#6b6560] mb-4">层级 × 市场构成</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chainMarketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {UNIQUE_MARKETS.map((m) => (
                  <Bar
                    key={m}
                    dataKey={MARKET_LABELS[m]}
                    stackId="a"
                    fill={MARKET_COLORS[m]}
                    radius={0}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Table */}
        <div className="rounded-2xl border border-[#e8e3dc] bg-white overflow-hidden">
          <div className="p-4 border-b border-[#e8e3dc]">
            <h3 className="text-sm font-bold text-[#6b6560] mb-3">公司列表</h3>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="搜索公司名称或代码..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg focus:outline-none focus:border-[#c2785e]"
              />
              <select
                value={marketFilter}
                onChange={(e) => setMarketFilter(e.target.value as Market | "all")}
                className="px-3 py-1.5 text-sm border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg focus:outline-none focus:border-[#c2785e]"
              >
                <option value="all">全部市场</option>
                {UNIQUE_MARKETS.map((m) => (
                  <option key={m} value={m}>{MARKET_LABELS[m]}</option>
                ))}
              </select>
              <select
                value={chainFilter}
                onChange={(e) => setChainFilter(e.target.value as ChainLevel | "all")}
                className="px-3 py-1.5 text-sm border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg focus:outline-none focus:border-[#c2785e]"
              >
                <option value="all">全部层级</option>
                {(["upstream", "midstream", "downstream"] as ChainLevel[]).map((l) => (
                  <option key={l} value={l}>{CHAIN_LABELS[l]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f0ea]">
                <tr>
                  {([
                    { key: "name" as SortKey, label: "公司名称" },
                    { key: "ticker" as SortKey, label: "代码" },
                    { key: "market" as SortKey, label: "市场" },
                    { key: "chain" as SortKey, label: "产业链层级" },
                    { key: "subGroup" as SortKey, label: "子领域" },
                  ]).map((h) => (
                    <th
                      key={h.key}
                      className="text-left px-4 py-2 font-medium text-[#8a827c] whitespace-nowrap cursor-pointer hover:text-[#3d3835] select-none"
                      onClick={() => toggleSort(h.key)}
                    >
                      {h.label}{sortIndicator(h.key)}
                    </th>
                  ))}
                  <th className="text-left px-4 py-2 font-medium text-[#8a827c] whitespace-nowrap">
                    财报
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[#b8b0a8]">
                      没有匹配的公司，试试调整筛选条件
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((c, i) => {
                    const finUrl = getFinanceUrl(c);
                    return (
                      <tr
                        key={i}
                        className="border-t border-[#e8e3dc] hover:bg-[#f5f0ea] transition-colors"
                      >
                        <td className="px-4 py-2 font-medium text-[#3d3835] whitespace-nowrap">
                          {c.name}
                        </td>
                        <td className="px-4 py-2 text-[#8a827c] max-w-[140px] truncate" title={c.ticker}>
                          {c.ticker}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                            style={{
                              background: MARKET_COLORS[c.market] + "18",
                              color: MARKET_COLORS[c.market],
                            }}
                          >
                            {MARKET_LABELS[c.market]}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: CHAIN_META[c.chain].color + "18",
                              color: CHAIN_META[c.chain].color,
                            }}
                          >
                            {CHAIN_LABELS[c.chain]}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-[#6b6560] max-w-[180px] truncate" title={c.subGroup}>
                          {c.subGroup}
                        </td>
                        <td className="px-4 py-2">
                          {finUrl ? (
                            <a
                              href={finUrl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#c2785e] hover:underline font-medium whitespace-nowrap"
                            >
                              {finUrl.label}
                            </a>
                          ) : (
                            <span className="text-xs text-[#b8b0a8]">--</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filteredCompanies.length > 0 && (
            <div className="px-4 py-2 border-t border-[#e8e3dc] text-xs text-[#b8b0a8]">
              共 {filteredCompanies.length} 家公司
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
