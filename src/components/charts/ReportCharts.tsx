import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChartConfig {
  title?: string;
  data: Record<string, unknown>[];
}

interface ChartErrorFallbackProps {
  error: string;
  raw: string;
}

// ---------------------------------------------------------------------------
// Fallback
// ---------------------------------------------------------------------------

function ChartErrorFallback({ error, raw }: ChartErrorFallbackProps) {
  return (
    <div className="my-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
      <p className="text-sm text-amber-700 font-medium mb-1">图表数据需要调整</p>
      <p className="text-xs text-amber-600 mb-2">{error}</p>
      <details>
        <summary className="text-xs text-amber-500 cursor-pointer">查看原始数据</summary>
        <pre className="mt-1 text-xs text-amber-700 whitespace-pre-wrap overflow-x-auto">{raw}</pre>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#64748b"];

function fillColors(data: Record<string, unknown>[]): Record<string, unknown>[] {
  return data.map((d, i) => ({ ...d, fill: d.fill ?? CHART_COLORS[i % CHART_COLORS.length] }));
}

// ---------------------------------------------------------------------------
// Individual charts
// ---------------------------------------------------------------------------

function ReportBarChart({ config }: { config: ChartConfig }) {
  const data = fillColors(config.data);
  const keys = Object.keys(data[0] ?? {}).filter((k) => k !== "fill" && k !== "name");
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
        />
        {keys.map((k) => (
          <Bar key={k} dataKey={k} fill={String(data[0]?.fill ?? CHART_COLORS[0])} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function ReportRadarChart({ config }: { config: ChartConfig }) {
  const data = fillColors(config.data);
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <Radar name="评分" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function ReportPieChart({ config }: { config: ChartConfig }) {
  const data = fillColors(config.data);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label
          labelLine={{ stroke: "#cbd5e1" }}
        >
          {data.map((_entry, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ReportLineChart({ config }: { config: ChartConfig }) {
  const data = config.data;
  const keys = Object.keys(data[0] ?? {}).filter((k) => k !== "name" && k !== "fill");
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS[i % CHART_COLORS.length] }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export type ChartType = "bar" | "radar" | "pie" | "line";

export function ReportChartBlock({ type, content }: { type: ChartType; content: string }) {
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(content) as ChartConfig;
      if (!parsed.data || !Array.isArray(parsed.data) || !parsed.data.length) {
        return { kind: "err" as const, error: "缺少有效 data 数组" };
      }
      return { kind: "ok" as const, data: parsed };
    } catch (e) {
      return { kind: "err" as const, error: e instanceof SyntaxError ? `JSON 解析错误: ${e.message}` : "数据格式无效" };
    }
  }, [content]);

  if (result.kind === "err") {
    return <ChartErrorFallback error={result.error} raw={content} />;
  }

  const cfg = result.data;
  return (
    <div className="my-6 p-5 bg-white rounded-xl border border-slate-200">
      {cfg.title && (
        <h4 className="text-sm font-bold text-slate-700 mb-3">{cfg.title}</h4>
      )}
      {type === "bar" && <ReportBarChart config={cfg} />}
      {type === "radar" && <ReportRadarChart config={cfg} />}
      {type === "pie" && <ReportPieChart config={cfg} />}
      {type === "line" && <ReportLineChart config={cfg} />}
      <details className="mt-3">
        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-500">查看数据</summary>
        <pre className="mt-1 text-xs text-slate-500 whitespace-pre-wrap overflow-x-auto">{content}</pre>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Re-usable color getter for external use
// ---------------------------------------------------------------------------

export { CHART_COLORS };
