import { useState } from "react"
import ContactCTA from "../components/ContactCTA"

export default function RoiCalculator() {
  const [budget, setBudget] = useState(100000)
  const [impressions, setImpressions] = useState(500000)
  const [clicks, setClicks] = useState(15000)
  const [conversions, setConversions] = useState(300)
  const [avgRevenue, setAvgRevenue] = useState(2000)

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const cpc = clicks > 0 ? budget / clicks : 0
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0
  const cpa = conversions > 0 ? budget / conversions : 0
  const totalRevenue = conversions * avgRevenue
  const roas = budget > 0 ? totalRevenue / budget : 0
  const profit = totalRevenue - budget

  const inputs = [
    { label: "投放预算 (¥)", value: budget, set: setBudget, step: 10000 },
    { label: "曝光量", value: impressions, set: setImpressions, step: 10000 },
    { label: "点击量", value: clicks, set: setClicks, step: 1000 },
    { label: "转化数", value: conversions, set: setConversions, step: 10 },
    { label: "客单价 (¥)", value: avgRevenue, set: setAvgRevenue, step: 100 },
  ]

  const metrics = [
    { label: "CTR", value: `${ctr.toFixed(2)}%`, color: "text-blue-600" },
    { label: "CPC", value: `¥${cpc.toFixed(2)}`, color: "text-blue-600" },
    { label: "转化率", value: `${conversionRate.toFixed(2)}%`, color: "text-emerald-600" },
    { label: "CPA", value: `¥${cpa.toFixed(2)}`, color: "text-emerald-600" },
    { label: "总收入", value: `¥${totalRevenue.toLocaleString()}`, color: "text-slate-900" },
    { label: "ROAS", value: `${roas.toFixed(2)}x`, color: profit >= 0 ? "text-slate-900" : "text-red-600" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-2">营销 ROI 计算器</h1>
      <p className="text-slate-400 mb-10">拖动滑块调整参数，实时计算投放回报</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {inputs.map(({ label, value, set, step }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-900">{value.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={value * 3 || step * 10}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">计算结果</h3>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map(({ label, value, color }) => (
              <div key={label}>
                <span className="text-sm text-slate-400">{label}</span>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${profit >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {profit >= 0 ? `利润 ¥${profit.toLocaleString()}` : `亏损 ¥${Math.abs(profit).toLocaleString()}`}
          </div>
        </div>
      </div>

      <ContactCTA message="想知道如何优化这些指标？" />
    </div>
  )
}
