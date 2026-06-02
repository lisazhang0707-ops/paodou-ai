import { useState, useMemo } from "react"
import ContactCTA from "../components/ContactCTA"

export default function DiffusionModel() {
  const [population, setPopulation] = useState(100000)
  const [initialInfected, setInitialInfected] = useState(100)
  const [contactRate, setContactRate] = useState(5)
  const [spreadProb, setSpreadProb] = useState(0.08)
  const [recoveryDays, setRecoveryDays] = useState(14)

  const data = useMemo(() => {
    const S: number[] = [population - initialInfected]
    const I: number[] = [initialInfected]
    const R: number[] = [0]
    const days = 60
    const beta = (contactRate * spreadProb) / population
    const gamma = 1 / recoveryDays

    for (let t = 0; t < days; t++) {
      const newInfected = Math.min(beta * S[t] * I[t], S[t])
      const newRecovered = gamma * I[t]
      S.push(S[t] - newInfected)
      I.push(I[t] + newInfected - newRecovered)
      R.push(R[t] + newRecovered)
    }

    const r0 = (contactRate * spreadProb) / gamma
    const peakDay = I.indexOf(Math.max(...I))
    const totalReached = R[R.length - 1] + I[I.length - 1]
    return { S, I, R, r0, peakDay, totalReached }
  }, [population, initialInfected, contactRate, spreadProb, recoveryDays])

  const maxY = Math.max(...data.I) * 1.2
  const chartWidth = 600
  const chartHeight = 200
  const step = chartWidth / 60

  const pathI = data.I
    .map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${chartHeight - (v / maxY) * chartHeight}`)
    .join(" ")

  const inputs = [
    { label: "目标人群", value: population, set: setPopulation, step: 10000, min: 1000, max: 1000000 },
    { label: "初始传播人数", value: initialInfected, set: setInitialInfected, step: 10, min: 1, max: 10000 },
    { label: "每人日均接触数", value: contactRate, set: setContactRate, step: 1, min: 0, max: 50 },
    { label: "单次接触转化率 (%)", value: +(spreadProb * 100).toFixed(1), set: (v: number) => setSpreadProb(v / 100), step: 0.5, min: 0.1, max: 50 },
    { label: "遗忘/免疫周期 (天)", value: recoveryDays, set: setRecoveryDays, step: 1, min: 1, max: 90 },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-2">营销传播扩散模型</h1>
      <p className="text-slate-400 mb-4">基于 SIR 传染病模型，模拟营销信息在目标人群中的传播过程</p>
      <div className="mb-8 p-4 rounded-xl bg-slate-50 text-sm text-slate-400">
        <span className="font-medium text-slate-600">模型来源：</span>《模型思维》第 11 章 — 广播模型、扩散模型和传染模型。R₀ = 接触率 × 转化率 × 传播周期。
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {inputs.map(({ label, value, set, step, min, max }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-900">{typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={min || 0}
                max={max || value * 3 || 100}
                step={step}
                value={value}
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
              <path d={pathI} fill="none" stroke="#2563eb" strokeWidth="2" />
              {/* Peak marker */}
              {(() => {
                const peakX = data.peakDay * step
                const peakY = chartHeight - (data.I[data.peakDay] / maxY) * chartHeight
                return (
                  <>
                    <line x1={peakX} y1={peakY} x2={peakX} y2={chartHeight} stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx={peakX} cy={peakY} r="3" fill="#2563eb" />
                    <text x={peakX + 5} y={peakY - 5} fontSize="10" fill="#64748b">峰值 第{data.peakDay}天</text>
                  </>
                )
              })()}
              <text x="0" y="10" fontSize="10" fill="#94a3b8">感染人数</text>
              <text x={chartWidth - 30} y="10" fontSize="10" fill="#64748b">SIR 曲线</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className={`text-xl font-black ${data.r0 >= 1 ? "text-red-600" : "text-emerald-600"}`}>{data.r0.toFixed(2)}</p>
              <p className="text-xs text-slate-400">R₀ (基本再生数)</p>
              <p className="text-xs text-slate-300 mt-0.5">{data.r0 >= 1 ? "会扩散" : "不会扩散"}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className="text-xl font-black text-slate-900">第{data.peakDay}天</p>
              <p className="text-xs text-slate-400">感染峰值</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className="text-xl font-black text-blue-600">{Math.round(data.totalReached).toLocaleString()}</p>
              <p className="text-xs text-slate-400">总触达人数</p>
            </div>
          </div>
        </div>
      </div>

      <ContactCTA message="想把这个模型应用到你的营销策略？" />
    </div>
  )
}
