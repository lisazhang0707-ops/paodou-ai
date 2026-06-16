import { useMemo } from "react";
import { Link } from "react-router-dom";
import KpiCard from "../components/KpiCard";
import DashboardNav from "../components/DashboardNav";
import type { KpiMetric } from "../components/KpiCard";
import { getFinancialRecords, getCustomerRecords, getSalesRecords, getTeamMembers } from "../utils/dashboardStore";

function computeFinancialKpi(): KpiMetric {
  const records = getFinancialRecords();
  if (records.length === 0) {
    return { id: "revenue", label: "累计收入", value: 0, target: 10000000, unit: "万元", trend: "flat", changePct: 0, bscDimension: "financial", status: "warn" };
  }
  const total = records.reduce((s, r) => s + r.revenue, 0);
  const totalBudget = records.reduce((s, r) => s + r.budgetRevenue, 0);
  const recent = records.slice(-2);
  const curr = recent[recent.length - 1];
  const prev = recent.length > 1 ? recent[0] : null;
  const changePct = prev && prev.revenue > 0 ? ((curr.revenue - prev.revenue) / prev.revenue) * 100 : 0;
  const trend = changePct > 2 ? "up" : changePct < -2 ? "down" : "flat";
  const budgetDeviation = totalBudget > 0 ? Math.abs(total - totalBudget) / totalBudget : 0;
  return {
    id: "revenue",
    label: "累计收入",
    value: total,
    target: totalBudget || 10000000,
    unit: "万元",
    trend,
    changePct,
    bscDimension: "financial",
    status: budgetDeviation > 0.15 ? "bad" : budgetDeviation > 0.1 ? "warn" : "good",
  };
}

function computeCustomerKpi(): KpiMetric {
  const customers = getCustomerRecords();
  if (customers.length === 0) {
    return { id: "customers", label: "客户总数", value: 0, target: 100, unit: "家", trend: "flat", changePct: 0, bscDimension: "customer", status: "warn" };
  }
  const churnRisky = customers.filter((c) => {
    const daysSinceLast = (Date.now() - new Date(c.lastOrderDate).getTime()) / 86400000;
    return daysSinceLast > 90;
  });
  const churnRate = churnRisky.length / customers.length;
  return {
    id: "customers",
    label: "客户总数",
    value: customers.length,
    target: Math.max(customers.length + 10, 100),
    unit: "家",
    trend: "up",
    changePct: 5,
    bscDimension: "customer",
    status: churnRate > 0.2 ? "bad" : churnRate > 0.1 ? "warn" : "good",
  };
}

function computeProcessKpi(): KpiMetric {
  const sales = getSalesRecords();
  if (sales.length === 0) {
    return { id: "conversion", label: "漏斗转化率", value: 0, target: 25, unit: "%", trend: "flat", changePct: 0, bscDimension: "process", status: "warn" };
  }
  const totalLeads = sales.reduce((s, r) => s + r.leads, 0);
  const totalDeals = sales.reduce((s, r) => s + r.deals, 0);
  const rate = totalLeads > 0 ? (totalDeals / totalLeads) * 100 : 0;
  return {
    id: "conversion",
    label: "漏斗转化率",
    value: rate,
    target: 25,
    unit: "%",
    trend: rate > 20 ? "up" : "down",
    changePct: 8,
    bscDimension: "process",
    status: rate >= 25 ? "good" : rate >= 15 ? "warn" : "bad",
  };
}

function computeLearningKpi(): KpiMetric {
  const members = getTeamMembers();
  if (members.length === 0) {
    return { id: "quota", label: "目标达成率", value: 0, target: 90, unit: "%", trend: "flat", changePct: 0, bscDimension: "learning", status: "warn" };
  }
  const avgAttain = members.reduce((s, m) => s + m.quotaAttainment, 0) / members.length;
  return {
    id: "quota",
    label: "目标达成率",
    value: avgAttain,
    target: 90,
    unit: "%",
    trend: avgAttain >= 85 ? "up" : "down",
    changePct: 3,
    bscDimension: "learning",
    status: avgAttain >= 90 ? "good" : avgAttain >= 75 ? "warn" : "bad",
  };
}

function getAlerts(): string[] {
  const alerts: string[] = [];
  const customers = getCustomerRecords();
  customers.forEach((c) => {
    const daysSinceLast = (Date.now() - new Date(c.lastOrderDate).getTime()) / 86400000;
    if (daysSinceLast > 90) {
      alerts.push(`${c.name} 流失风险高（最后下单 ${Math.round(daysSinceLast)} 天前）`);
    }
  });
  const financials = getFinancialRecords();
  if (financials.length >= 2) {
    const recent = financials.slice(-3);
    let totalBudget = 0, totalActual = 0;
    recent.forEach((r) => { totalBudget += r.budgetRevenue; totalActual += r.revenue; });
    if (totalBudget > 0) {
      const dev = Math.abs(totalActual - totalBudget) / totalBudget;
      if (dev > 0.15) alerts.push(`近3月预算偏差率 ${(dev * 100).toFixed(1)}%，超过15%警戒线`);
    }
  }
  return alerts;
}

const moduleEntries = [
  { to: "/dashboard/finance", title: "财务健康", desc: "收入/成本/利润趋势、本量利分析、杜邦拆解", color: "bg-blue-500" },
  { to: "/dashboard/customers", title: "客户价值", desc: "RFM 分层、LTV 预测、流失预警", color: "bg-emerald-500" },
  { to: "#", title: "市场与竞争", desc: "竞争情报、SWOT 量化、五力评分", color: "bg-slate-400", soon: true },
  { to: "#", title: "销售效率", desc: "漏斗分析、收入预测、资源分配", color: "bg-slate-400", soon: true },
  { to: "#", title: "团队能力", desc: "人效九宫格、离职风险、技能矩阵", color: "bg-slate-400", soon: true },
];

export default function Dashboard() {
  const kpis = useMemo(() => [computeFinancialKpi(), computeCustomerKpi(), computeProcessKpi(), computeLearningKpi()], []);
  const alerts = useMemo(() => getAlerts(), []);

  return (
    <div>
      <DashboardNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">销售管理仪表盘</h1>
            <p className="text-sm text-slate-400 mt-1">平衡计分卡 · 四维度综合概览</p>
          </div>
          <button
            onClick={() => {
              const ctx = kpis.map((k) => `${k.label}: ${k.value}${k.unit} (目标${k.target}${k.unit}, 状态${k.status})`).join("; ");
              const msg = `作为销售管理顾问，基于以下BSC四维度KPI数据，给出3条策略建议：\n${ctx}\n${alerts.length > 0 ? `\n当前预警：${alerts.join("；")}` : ""}`;
              navigator.clipboard.writeText(msg).then(() => alert("分析提示已复制到剪贴板，请粘贴到 AI 对话中"));
            }}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            AI 策略建议
          </button>
        </div>

        {/* BSC 四维度 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} metric={kpi} />
          ))}
        </section>

        {/* 预警 */}
        {alerts.length > 0 && (
          <section className="mb-8 p-5 rounded-2xl border border-red-100 bg-red-50/50">
            <h2 className="text-sm font-bold text-red-700 mb-2">预警（{alerts.length}项）</h2>
            <ul className="space-y-1">
              {alerts.map((a, i) => (
                <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 模块入口 */}
        <section>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">分析模块</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {moduleEntries.map((m) => (
              m.soon ? (
                <div key={m.to} className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 opacity-60">
                  <div className={`w-10 h-10 rounded-xl ${m.color} mb-3`} />
                  <h3 className="font-bold text-slate-500 mb-1">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                  <span className="inline-block mt-2 text-[10px] text-slate-300 bg-slate-100 px-2 py-0.5 rounded">即将上线</span>
                </div>
              ) : (
                <Link
                  key={m.to}
                  to={m.to}
                  className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${m.color} mb-3`} />
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </Link>
              )
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
