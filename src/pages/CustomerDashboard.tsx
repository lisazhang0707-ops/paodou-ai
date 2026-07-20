import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DashboardNav from "../components/DashboardNav";
import { getCustomerRecords, saveCustomerRecord, deleteCustomerRecord } from "../utils/dashboardStore";
import type { CustomerRecord } from "../utils/dashboardStore";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const SEGMENTS = ["VIP", "高价值", "中价值", "低价值"];

function emptyCustomer(): CustomerRecord {
  return {
    id: crypto.randomUUID(),
    name: "",
    segment: "SMB",
    acquisitionDate: new Date().toISOString().slice(0, 10),
    totalRevenue: 0,
    orderCount: 0,
    lastOrderDate: new Date().toISOString().slice(0, 10),
    avgOrderValue: 0,
    lifetimeMonths: 0,
  };
}

function classifyRfm(c: CustomerRecord): { segment: string; score: number } {
  const daysSinceLast = (Date.now() - new Date(c.lastOrderDate).getTime()) / 86400000;
  const rScore = daysSinceLast < 30 ? 3 : daysSinceLast < 90 ? 2 : 1;
  const fScore = c.orderCount >= 12 ? 3 : c.orderCount >= 6 ? 2 : 1;
  const mScore = c.totalRevenue >= 500000 ? 3 : c.totalRevenue >= 100000 ? 2 : 1;
  const total = rScore + fScore + mScore;
  if (total >= 8) return { segment: "VIP", score: total };
  if (total >= 6) return { segment: "高价值", score: total };
  if (total >= 4) return { segment: "中价值", score: total };
  return { segment: "低价值", score: total };
}

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState(getCustomerRecords);
  const [form, setForm] = useState<CustomerRecord>(emptyCustomer());
  const [editing, setEditing] = useState(false);

  const refresh = () => setCustomers(getCustomerRecords());

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    saveCustomerRecord(form);
    setForm(emptyCustomer());
    setEditing(false);
    refresh();
  };

  const handleEdit = (c: CustomerRecord) => {
    setForm(c);
    setEditing(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomerRecord(id);
    refresh();
  };

  const rfmGroups = useMemo(() => {
    const groups: Record<string, { count: number; revenue: number }> = {};
    customers.forEach((c) => {
      const { segment } = classifyRfm(c);
      if (!groups[segment]) groups[segment] = { count: 0, revenue: 0 };
      groups[segment].count++;
      groups[segment].revenue += c.totalRevenue;
    });
    return SEGMENTS.map((s) => ({ name: s, count: groups[s]?.count || 0, revenue: (groups[s]?.revenue || 0) / 10000 }));
  }, [customers]);

  const churnRisky = useMemo(() => {
    return customers
      .map((c) => {
        const daysSinceLast = (Date.now() - new Date(c.lastOrderDate).getTime()) / 86400000;
        const { segment } = classifyRfm(c);
        const churnScore = daysSinceLast > 120 ? 0.8 : daysSinceLast > 90 ? 0.6 : daysSinceLast > 60 ? 0.3 : 0.1;
        return { ...c, daysSinceLast, segment, churnScore };
      })
      .filter((c) => c.churnScore >= 0.3)
      .sort((a, b) => b.churnScore - a.churnScore);
  }, [customers]);

  const ltvs = useMemo(() => {
    return customers
      .map((c) => {
        const avgAnnualOrders = c.lifetimeMonths > 0 ? (c.orderCount / c.lifetimeMonths) * 12 : 0;
        const estRetentionYears = 3;
        const ltv = c.avgOrderValue * Math.max(avgAnnualOrders, 1) * estRetentionYears;
        return { ...c, ltv };
      })
      .sort((a, b) => b.ltv - a.ltv);
  }, [customers]);

  return (
    <div>
      <DashboardNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-[#3d3835] mb-1">客户价值分析</h1>
        <p className="text-sm text-[#8a827c] mb-8">RFM 分层 · LTV 预测 · 流失预警</p>

        {/* KPI 概要 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "客户总数", value: customers.length, unit: "家" },
            { label: "累计收入", value: customers.reduce((s, c) => s + c.totalRevenue, 0), unit: "万元" },
            { label: "流失风险", value: churnRisky.length, unit: "家" },
            { label: "VIP 客户", value: rfmGroups[0]?.count || 0, unit: "家" },
          ].map((k) => (
            <div key={k.label} className="p-4 rounded-2xl border border-[#e8e3dc] bg-white">
              <div className="text-xs text-[#b8b0a8] mb-1">{k.label}</div>
              <div className="text-xl font-black text-[#3d3835]">
                {k.unit === "万元" ? `${(k.value / 10000).toFixed(1)}万` : `${k.value}${k.unit}`}
              </div>
            </div>
          ))}
        </div>

        {/* RFM 图表 */}
        {customers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white">
              <h3 className="text-sm font-bold text-[#6b6560] mb-4">RFM 客户分层</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={rfmGroups} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ payload }: any) => `${payload.name}: ${payload.count}`}>
                    {rfmGroups.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white">
              <h3 className="text-sm font-bold text-[#6b6560] mb-4">各层收入贡献（万元）</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={rfmGroups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" name="收入" radius={[4, 4, 0, 0]}>
                    {rfmGroups.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 流失预警 */}
        {churnRisky.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl border border-red-200 bg-red-50/50">
            <h3 className="text-sm font-bold text-red-500 mb-3">流失预警（{churnRisky.length}家）</h3>
            <div className="space-y-2">
              {churnRisky.slice(0, 10).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-[#f5f0ea] rounded-xl">
                  <div>
                    <span className="font-medium text-[#3d3835]">{c.name}</span>
                    <span className="text-xs text-[#b8b0a8] ml-2">{c.segment}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#8a827c]">{Math.round(c.daysSinceLast)}天未下单</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.churnScore >= 0.6 ? "text-red-500 bg-red-500/10" : "text-amber-600 bg-amber-500/10"
                    }`}>
                      风险 {(c.churnScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LTV 排行 */}
        {ltvs.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl border border-[#e8e3dc] bg-white">
            <h3 className="text-sm font-bold text-[#6b6560] mb-4">客户 LTV 预估 Top 10</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f5f0ea]">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-[#8a827c]">客户名称</th>
                    <th className="text-left px-4 py-2 font-medium text-[#8a827c]">RFM 层级</th>
                    <th className="text-right px-4 py-2 font-medium text-[#8a827c]">客单价</th>
                    <th className="text-right px-4 py-2 font-medium text-[#8a827c]">累计收入</th>
                    <th className="text-right px-4 py-2 font-medium text-[#8a827c]">预估 LTV</th>
                  </tr>
                </thead>
                <tbody>
                  {ltvs.slice(0, 10).map((c) => (
                    <tr key={c.id} className="border-t border-[#e8e3dc] hover:bg-[#f5f0ea]">
                      <td className="px-4 py-2 font-medium text-[#3d3835]">{c.name}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          c.ltv > 500000 ? "bg-[#c2785e]/10 text-[#c2785e]" :
                          c.ltv > 100000 ? "bg-emerald-50 text-emerald-600" : "bg-[#f5f0ea] text-[#8a827c]"
                        }`}>
                          {classifyRfm(c).segment}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right text-[#6b6560]">{(c.avgOrderValue / 10000).toFixed(1)}万</td>
                      <td className="px-4 py-2 text-right text-[#6b6560]">{(c.totalRevenue / 10000).toFixed(1)}万</td>
                      <td className="px-4 py-2 text-right font-bold text-[#c2785e]">{(c.ltv / 10000).toFixed(1)}万</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 添加/编辑表单 */}
        <div className="p-5 rounded-2xl border border-[#e8e3dc] bg-white mb-8">
          <h3 className="text-sm font-bold text-[#6b6560] mb-4">{editing ? "编辑客户" : "添加客户"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { key: "name", label: "名称", type: "text" },
              { key: "segment", label: "行业", type: "text" },
              { key: "totalRevenue", label: "累计收入", type: "number" },
              { key: "orderCount", label: "订单数", type: "number" },
              { key: "avgOrderValue", label: "客单价", type: "number" },
              { key: "lifetimeMonths", label: "合作月数", type: "number" },
              { key: "acquisitionDate", label: "获客日期", type: "date" },
              { key: "lastOrderDate", label: "最后下单", type: "date" },
            ].map((f) => (
              <label key={f.key} className="block">
                <span className="text-[11px] text-[#8a827c]">{f.label}</span>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
                  className="w-full mt-1 px-2 py-1.5 text-sm border border-[#e8e3dc] bg-white text-[#3d3835] rounded-lg focus:outline-none focus:border-blue-500"
                />
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              {editing ? "更新" : "添加"}
            </button>
            {editing && (
              <button onClick={() => { setForm(emptyCustomer()); setEditing(false); }} className="px-4 py-2 text-sm font-medium text-[#8a827c] bg-[#f5f0ea] hover:bg-[#f0ebe4] rounded-xl transition-colors">
                取消
              </button>
            )}
          </div>
        </div>

        {/* 客户列表 */}
        {customers.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-[#e8e3dc]">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f0ea]">
                <tr>
                  {["名称", "行业", "RFM层级", "累计收入", "订单数", "客单价", "最后下单", "操作"].map((h) => (
                    <th key={h} className="text-left px-4 py-2 font-medium text-[#8a827c] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const { segment } = classifyRfm(c);
                  return (
                    <tr key={c.id} className="border-t border-[#e8e3dc] hover:bg-[#f5f0ea]">
                      <td className="px-4 py-2 font-medium text-[#3d3835]">{c.name}</td>
                      <td className="px-4 py-2 text-[#8a827c]">{c.segment}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          segment === "VIP" ? "bg-[#c2785e]/10 text-[#c2785e]" :
                          segment === "高价值" ? "bg-emerald-50 text-emerald-600" :
                          segment === "中价值" ? "bg-amber-50 text-amber-600" : "bg-[#f5f0ea] text-[#8a827c]"
                        }`}>{segment}</span>
                      </td>
                      <td className="px-4 py-2">{(c.totalRevenue / 10000).toFixed(1)}万</td>
                      <td className="px-4 py-2">{c.orderCount}</td>
                      <td className="px-4 py-2">{(c.avgOrderValue / 10000).toFixed(1)}万</td>
                      <td className="px-4 py-2">{c.lastOrderDate}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleEdit(c)} className="text-[#c2785e] hover:underline mr-2">编辑</button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">删除</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
