import { useState } from "react"
import ContactCTA from "../components/ContactCTA"

interface Customer {
  id: number
  name: string
  recency: number
  frequency: number
  monetary: number
  segment: string
}

const DEMO_DATA: Customer[] = [
  { id: 1, name: "客户 A", recency: 3, frequency: 45, monetary: 180000, segment: "" },
  { id: 2, name: "客户 B", recency: 90, frequency: 3, monetary: 15000, segment: "" },
  { id: 3, name: "客户 C", recency: 7, frequency: 28, monetary: 95000, segment: "" },
  { id: 4, name: "客户 D", recency: 180, frequency: 1, monetary: 3000, segment: "" },
  { id: 5, name: "客户 E", recency: 14, frequency: 12, monetary: 42000, segment: "" },
]

function classify(r: number, f: number, m: number): string {
  const rScore = r <= 7 ? 3 : r <= 30 ? 2 : 1
  const fScore = f >= 30 ? 3 : f >= 10 ? 2 : 1
  const mScore = m >= 100000 ? 3 : m >= 30000 ? 2 : 1
  const total = rScore + fScore + mScore
  if (total >= 8) return "高价值客户"
  if (total >= 5) return "潜力客户"
  return "流失风险"
}

const segmentColors: Record<string, string> = {
  "高价值客户": "bg-emerald-50 text-emerald-700",
  "潜力客户": "bg-amber-50 text-amber-700",
  "流失风险": "bg-red-50 text-red-700",
}

export default function CustomerSegmentation() {
  const [customers] = useState<Customer[]>(
    DEMO_DATA.map((c) => ({ ...c, segment: classify(c.recency, c.frequency, c.monetary) }))
  )

  const counts: Record<string, number> = {}
  customers.forEach((c) => {
    counts[c.segment] = (counts[c.segment] || 0) + 1
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-2">客户分层模板</h1>
      <p className="text-slate-400 mb-10">基于 RFM 模型（最近购买时间、购买频率、消费金额）自动给客户打分分层</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {Object.entries(counts).map(([segment, count]) => (
          <div key={segment} className="p-6 rounded-2xl bg-white border border-slate-100 text-center">
            <p className="text-3xl font-black text-slate-900">{count}</p>
            <p className="text-sm text-slate-400 mt-1">{segment}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-sm font-medium text-slate-400">客户</th>
              <th className="pb-3 text-sm font-medium text-slate-400">最近购买 (天)</th>
              <th className="pb-3 text-sm font-medium text-slate-400">购买频次</th>
              <th className="pb-3 text-sm font-medium text-slate-400">消费金额 (¥)</th>
              <th className="pb-3 text-sm font-medium text-slate-400">分层结果</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-slate-50">
                <td className="py-3 font-medium text-slate-900">{c.name}</td>
                <td className="py-3 text-slate-500">{c.recency} 天</td>
                <td className="py-3 text-slate-500">{c.frequency} 次</td>
                <td className="py-3 text-slate-500">¥{c.monetary.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${segmentColors[c.segment]}`}>
                    {c.segment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-slate-50 text-sm text-slate-400">
        <p className="font-medium text-slate-600 mb-1">分层逻辑说明</p>
        <p>RFM 模型：根据最近购买时间 (Recency)、购买频次 (Frequency)、消费金额 (Monetary) 三个维度打分，每个维度 1-3 分。总分 8-9 分为高价值客户，5-7 分为潜力客户，3-4 分为流失风险。</p>
      </div>

      <ContactCTA message="想接入你自己的客户数据做分析？" />
    </div>
  )
}
