import { useState, useMemo } from "react"
import ContactCTA from "../components/ContactCTA"

export default function ThresholdModel() {
  const [totalLeads, setTotalLeads] = useState(10000)
  const [conversionRate, setConversionRate] = useState(0.05)
  const [avgDealSize, setAvgDealSize] = useState(5000)
  const [costPerContact, setCostPerContact] = useState(30)

  const data = useMemo(() => {
    const thresholds = Array.from({ length: 20 }, (_, i) => (i + 1) * 5)
    return thresholds.map(threshold => {
      const passedLeads = totalLeads * (1 - threshold / 100) * (0.5 + (100 - threshold) / 200)
      const dealRate = conversionRate * (1 + threshold / 100 * 0.8)
      const deals = Math.round(passedLeads * dealRate)
      const revenue = deals * avgDealSize
      const cost = Math.round(totalLeads * (1 - threshold / 100)) * costPerContact
      const profit = revenue - cost
      return { threshold, passedLeads: Math.round(passedLeads), dealRate: (dealRate * 100).toFixed(2), deals, revenue, cost, profit }
    })
  }, [totalLeads, conversionRate, avgDealSize, costPerContact])

  const bestIndex = data.reduce((best, cur, i) => cur.profit > data[best].profit ? i : best, 0)
  const best = data[bestIndex]

  const chartWidth = 400
  const chartHeight = 160
  const maxProfit = Math.max(...data.map(d => d.profit), 1)
  const profitPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${(i / 19) * chartWidth},${chartHeight - (d.profit / maxProfit) * chartHeight}`)
    .join(" ")

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-2">阈值决策模型 — 线索筛选临界点</h1>
      <p className="text-slate-400 mb-4">找到最优的线索评分门槛，平衡触达成本与转化收益</p>
      <div className="mb-8 p-4 rounded-xl bg-slate-50 text-sm text-slate-400">
        <span className="font-medium text-slate-600">模型来源：</span>《模型思维》第 19 章 — 基于阈值的模型。存在一个临界点，超过它系统行为会发生根本变化。在营销中，这对应"线索评分设为多少分时跟进效率最高"。
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          {[
            { label: "总线索数", value: totalLeads, set: setTotalLeads, step: 1000, min: 100, max: 100000 },
            { label: "基准转化率 (%)", value: +(conversionRate * 100).toFixed(1), set: (v: number) => setConversionRate(v / 100), step: 0.1, min: 0.1, max: 30 },
            { label: "平均客单价 (¥)", value: avgDealSize, set: setAvgDealSize, step: 1000, min: 500, max: 100000 },
            { label: "单线索触达成本 (¥)", value: costPerContact, set: setCostPerContact, step: 5, min: 1, max: 500 },
          ].map(({ label, value, set, step, min, max }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-900">{typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString()}</span>
              </div>
              <input
                type="range" min={min || 0} max={max || value * 3} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth="1" />
              <path d={profitPath} fill="none" stroke="#2563eb" strokeWidth="2" />
              {(() => {
                const bx = (bestIndex / 19) * chartWidth
                const by = chartHeight - (best.profit / maxProfit) * chartHeight
                return (
                  <>
                    <line x1={bx} y1={by} x2={bx} y2={chartHeight} stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx={bx} cy={by} r="4" fill="#2563eb" />
                    <text x={bx > chartWidth / 2 ? bx - 40 : bx + 5} y={by - 8} fontSize="10" fill="#2563eb" fontWeight="bold">
                      最优 {best.threshold}%
                    </text>
                  </>
                )
              })()}
              <text x="0" y="12" fontSize="10" fill="#94a3b8">利润</text>
              <text x={chartWidth - 45} y="12" fontSize="10" fill="#64748b">阈值 →</text>
            </svg>
          </div>

          <div className="text-center p-4 rounded-xl bg-blue-50 mb-4">
            <p className="text-sm text-blue-600 font-medium">
              最优阈值：<span className="text-lg font-black">{best.threshold}%</span>
              <span className="ml-3">预期利润：</span>
              <span className="text-lg font-black">¥{best.profit.toLocaleString()}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-50">
              <p className="font-bold text-slate-700">{best.deals}</p>
              <p className="text-slate-400">成交数</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <p className="font-bold text-slate-700">¥{(best.revenue).toLocaleString()}</p>
              <p className="text-slate-400">总收入</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <p className="font-bold text-slate-700">¥{(best.cost).toLocaleString()}</p>
              <p className="text-slate-400">触达成本</p>
            </div>
          </div>
        </div>
      </div>

      <ContactCTA message="需要定制你的线索评分模型？" />
    </div>
  )
}
