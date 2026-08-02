interface KpiMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "flat";
  changePct: number;
  bscDimension: "financial" | "customer" | "process" | "learning";
  status: "good" | "warn" | "bad";
}

function statusColor(status: string) {
  switch (status) {
    case "bad": return "text-red-500 bg-red-50";
    case "warn": return "text-amber-600 bg-amber-50";
    default: return "text-emerald-600 bg-emerald-50";
  }
}

function trendIcon(trend: string) {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
}

function fmt(n: number, unit: string): string {
  if (unit === "%") return n.toFixed(1) + "%";
  if (unit === "万元") return (n / 10000).toFixed(0) + "万";
  if (unit === "人") return n.toFixed(0) + "人";
  if (unit === "家") return n.toFixed(0) + "家";
  return n.toLocaleString();
}

export default function KpiCard({ metric, onClick }: { metric: KpiMetric; onClick?: () => void }) {
  const pct = metric.changePct;
  const trendCls = metric.trend === "up" ? "text-emerald-600" : metric.trend === "down" ? "text-red-500" : "text-[#8a827c]";

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border border-[#e8e3dc] bg-white hover:shadow-md hover:shadow-stone-200/60 transition-all ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#8a827c] uppercase tracking-wide">{metric.label}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(metric.status)}`}>
          {metric.status === "bad" ? "异常" : metric.status === "warn" ? "关注" : "正常"}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-black text-[#3d3835]">{fmt(metric.value, metric.unit)}</span>
        <span className="text-xs text-[#8a827c]">{metric.unit === "万元" ? "" : metric.unit}</span>
      </div>
      <div className="flex items-center gap-1 text-xs">
        <span className={trendCls}>{trendIcon(metric.trend)} {Math.abs(pct).toFixed(1)}%</span>
        <span className="text-[#8a827c]">vs 上期</span>
      </div>
      <div className="mt-2 w-full bg-[#f5f0ea] rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${metric.status === "bad" ? "bg-red-400" : metric.status === "warn" ? "bg-amber-400" : "bg-emerald-400"}`}
          style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
        />
      </div>
      <div className="text-[10px] text-[#8a827c] mt-1 text-right">目标 {fmt(metric.target, metric.unit)}</div>
    </div>
  );
}

export type { KpiMetric };
