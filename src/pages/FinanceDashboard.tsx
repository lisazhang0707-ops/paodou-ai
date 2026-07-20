import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import DashboardNav from "../components/DashboardNav";
import { getFinancialRecords, saveFinancialRecord, deleteFinancialRecord, importFinancialCSV } from "../utils/dashboardStore";
import type { FinancialRecord } from "../utils/dashboardStore";

function emptyRecord(): FinancialRecord {
  return {
    period: new Date().toISOString().slice(0, 7),
    revenue: 0, cost: 0, fixedCost: 0, variableCost: 0,
    grossProfit: 0, netProfit: 0, cashFlow: 0,
    budgetRevenue: 0, budgetCost: 0,
  };
}

export default function FinanceDashboard() {
  const [records, setRecords] = useState(getFinancialRecords);
  const [form, setForm] = useState<FinancialRecord>(emptyRecord());
  const [editing, setEditing] = useState(false);

  const refresh = () => setRecords(getFinancialRecords());

  const handleSubmit = () => {
    const rec = {
      ...form,
      grossProfit: form.revenue - form.cost,
      netProfit: form.revenue - form.cost - form.fixedCost - form.variableCost,
    };
    saveFinancialRecord(rec);
    setForm(emptyRecord());
    setEditing(false);
    refresh();
  };

  const handleEdit = (r: FinancialRecord) => {
    setForm(r);
    setEditing(true);
  };

  const handleDelete = (period: string) => {
    deleteFinancialRecord(period);
    refresh();
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const count = importFinancialCSV(reader.result as string);
      alert(`导入 ${count} 条记录`);
      refresh();
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const cvp = useMemo(() => {
    if (records.length < 2) return null;
    const last = records[records.length - 1];
    const cm = last.revenue - last.variableCost;
    const cmRatio = last.revenue > 0 ? cm / last.revenue : 0;
    const bep = cmRatio > 0 ? last.fixedCost / cmRatio : 0;
    const safetyMargin = last.revenue > 0 ? (last.revenue - bep) / last.revenue : 0;
    const dol = last.netProfit > 0 ? cm / last.netProfit : 0;
    return { bep, safetyMargin: safetyMargin * 100, dol, cmRatio: cmRatio * 100 };
  }, [records]);

  const chartData = useMemo(() => records.map((r) => ({ ...r })), [records]);

  return (
    <div>
      <DashboardNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-slate-100 mb-1">财务健康</h1>
        <p className="text-sm text-slate-400 mb-8">收入/成本/利润趋势 · 本量利分析 · 杜邦拆解</p>

        {/* KPI 概要 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "累计收入", value: records.reduce((s, r) => s + r.revenue, 0), unit: "万元" },
            { label: "累计净利润", value: records.reduce((s, r) => s + r.netProfit, 0), unit: "万元" },
            { label: "毛利率", value: records.length > 0 ? (records.reduce((s, r) => s + r.grossProfit, 0) / Math.max(1, records.reduce((s, r) => s + r.revenue, 0)) * 100) : 0, unit: "%" },
            { label: "记录数", value: records.length, unit: "月" },
          ].map((k) => (
            <div key={k.label} className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
              <div className="text-xs text-slate-500 mb-1">{k.label}</div>
              <div className="text-xl font-black text-slate-100">
                {k.unit === "%" ? `${k.value.toFixed(1)}%` : k.unit === "万元" ? `${(k.value / 10000).toFixed(1)}万` : k.value}
              </div>
            </div>
          ))}
        </div>

        {/* 图表 */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900">
              <h3 className="text-sm font-bold text-slate-300 mb-4">收入 / 成本 / 利润趋势</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="收入" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cost" name="成本" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="netProfit" name="净利润" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900">
              <h3 className="text-sm font-bold text-slate-300 mb-4">预算 vs 实际</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="实际收入" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="budgetRevenue" name="预算收入" fill="#475569" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 本量利分析 */}
        {cvp && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "盈亏平衡点", value: `${(cvp.bep / 10000).toFixed(1)}万` },
              { label: "安全边际率", value: `${cvp.safetyMargin.toFixed(1)}%` },
              { label: "经营杠杆系数", value: cvp.dol.toFixed(2) },
              { label: "边际贡献率", value: `${cvp.cmRatio.toFixed(1)}%` },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                <div className="text-xs text-blue-400 mb-1">{item.label}</div>
                <div className="text-xl font-black text-blue-300">{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* 录入表单 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 mb-8">
          <h3 className="text-sm font-bold text-slate-300 mb-4">{editing ? "编辑记录" : "添加记录"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
            {[
              { key: "period", label: "月份", type: "text", placeholder: "YYYY-MM" },
              { key: "revenue", label: "收入", type: "number" },
              { key: "cost", label: "成本", type: "number" },
              { key: "fixedCost", label: "固定成本", type: "number" },
              { key: "variableCost", label: "变动成本", type: "number" },
              { key: "cashFlow", label: "现金流", type: "number" },
              { key: "budgetRevenue", label: "预算收入", type: "number" },
              { key: "budgetCost", label: "预算成本", type: "number" },
            ].map((f) => (
              <label key={f.key} className="block">
                <span className="text-[11px] text-slate-400">{f.label}</span>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
                  className="w-full mt-1 px-2 py-1.5 text-sm border border-slate-700 bg-slate-800 text-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              {editing ? "更新" : "添加"}
            </button>
            {editing && (
              <button onClick={() => { setForm(emptyRecord()); setEditing(false); }} className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                取消
              </button>
            )}
            <label className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">
              CSV 导入
              <input type="file" accept=".csv" onChange={handleCSV} className="hidden" />
            </label>
          </div>
        </div>

        {/* 历史记录表 */}
        {records.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  {["月份", "收入", "成本", "固定成本", "变动成本", "毛利", "净利", "现金流", "预算收入", "操作"].map((h) => (
                    <th key={h} className="text-left px-4 py-2 font-medium text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.period} className="border-t border-slate-800 hover:bg-slate-800/50">
                    <td className="px-4 py-2 font-medium text-slate-200">{r.period}</td>
                    <td className="px-4 py-2">{(r.revenue / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.cost / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.fixedCost / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.variableCost / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.grossProfit / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.netProfit / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.cashFlow / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">{(r.budgetRevenue / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEdit(r)} className="text-blue-400 hover:underline mr-2">编辑</button>
                      <button onClick={() => handleDelete(r.period)} className="text-red-400 hover:underline">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
