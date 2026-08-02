import { useState, useMemo } from "react"
import ContactCTA from "../components/ContactCTA"

interface Channel {
  name: string
  trueRate: number
  trials: number
  successes: number
}

// 单位经济：每次尝试 = ¥10 投放，成功转化带来 ¥1000 收入
const COST_PER_TRIAL = 10
const REWARD = 1000

export default function BanditModel() {
  const [budget, setBudget] = useState(10000)
  const [channels, setChannels] = useState<Channel[]>([
    { name: "公众号", trueRate: 0.023, trials: 0, successes: 0 },
    { name: "抖音", trueRate: 0.035, trials: 0, successes: 0 },
    { name: "小红书", trueRate: 0.018, trials: 0, successes: 0 },
    { name: "知乎", trueRate: 0.028, trials: 0, successes: 0 },
  ])

  const [exploreRatio, setExploreRatio] = useState(0.15)
  const [runId, setRunId] = useState(0) // 触发重新模拟

  const results = useMemo(() => {
    const state = channels.map(c => ({ ...c }))
    let cumulative = 0
    // 完美决策收益 = 期望值（总尝试次数 × 最高真实转化率 × 单笔收入），为确定基准
    const batches = Math.floor(budget / COST_PER_TRIAL)
    const optimalReward = batches * REWARD * Math.max(...state.map(c => c.trueRate))

    for (let i = 0; i < batches; i++) {
      let selected: number
      if (Math.random() < exploreRatio || i < 8) {
        selected = Math.floor(Math.random() * state.length)
      } else {
        // Thompson sampling: 从 Beta(成功+1, 失败+1) 后验中采样
        let best = -1
        let bestSample = -1
        for (let j = 0; j < state.length; j++) {
          const alpha = state[j].successes + 1
          const beta = state[j].trials - state[j].successes + 1
          const sample = betaSample(alpha, beta)
          if (sample > bestSample) {
            bestSample = sample
            best = j
          }
        }
        selected = best
      }
      const reward = Math.random() < state[selected].trueRate ? REWARD : 0
      state[selected].trials++
      if (reward > 0) state[selected].successes++
      cumulative += reward
    }
    return { finalState: state, totalReward: cumulative, optimalReward, batches }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget, exploreRatio, channels, runId])

  const regret = results.optimalReward - results.totalReward
  const efficiency = results.optimalReward > 0 ? (results.totalReward / results.optimalReward) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-[#3d3835] mb-2">多臂老虎机 — A/B 测试预算分配</h1>
      <p className="text-[#8a827c] mb-4">自动探索 vs 利用：用 Thompson Sampling 动态分配营销预算到转化率最高的渠道</p>
      <div className="mb-8 p-4 rounded-xl bg-[#f5f0ea] text-sm text-[#8a827c]">
        <span className="font-medium text-[#6b6560]">模型来源：</span>《模型思维》第 27 章 — 多臂老虎机问题。平衡探索新选项（explore）和利用已知最优解（exploit），最大化长期收益。
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#8a827c]">总预算 (¥)</span>
              <span className="font-semibold text-[#3d3835]">{budget.toLocaleString()}</span>
            </div>
            <input
              type="range" min={1000} max={100000} step={1000} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-[#f5f0ea] rounded-lg appearance-none cursor-pointer accent-[#c2785e]"
            />
            <p className="text-xs text-[#8a827c] mt-1">每次尝试 = ¥{COST_PER_TRIAL} 投放，共 {results.batches.toLocaleString()} 次尝试</p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#8a827c]">探索比例 (Explore %)</span>
              <span className="font-semibold text-[#3d3835]">{(exploreRatio * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range" min={1} max={50} step={1} value={exploreRatio * 100}
              onChange={(e) => setExploreRatio(Number(e.target.value) / 100)}
              className="w-full h-2 bg-[#f5f0ea] rounded-lg appearance-none cursor-pointer accent-[#c2785e]"
            />
            <p className="text-xs text-[#8a827c] mt-1">ε-greedy 混合：此比例的尝试随机探索，其余按 Thompson 后验采样利用。纯 Thompson Sampling 可设为接近 0%（探索已内建于后验采样）。</p>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-[#6b6560] mb-3">渠道真实转化率（模拟设定）</h3>
            {channels.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#8a827c]">{c.name}</span>
                <input
                  type="range" min={0.1} max={10} step={0.1} value={c.trueRate * 100}
                  onChange={(e) => {
                    const updated = [...channels]
                    updated[i].trueRate = Number(e.target.value) / 100
                    setChannels(updated)
                  }}
                  className="w-32 h-1.5 bg-[#f5f0ea] rounded-lg appearance-none cursor-pointer accent-[#c2785e]"
                />
                <span className="text-sm font-mono text-[#6b6560] w-10 text-right">{(c.trueRate * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setRunId(r => r + 1)}
            className="px-4 py-2 rounded-lg bg-[#c2785e] text-white text-sm font-medium hover:bg-[#b0684e] transition-colors"
          >
            重新模拟
          </button>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#f5f0ea] text-center">
              <p className="text-xl font-black text-[#c2785e]">¥{results.totalReward.toLocaleString()}</p>
              <p className="text-xs text-[#8a827c]">实际收益</p>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f0ea] text-center">
              <p className="text-xl font-black text-[#3d3835]">¥{results.optimalReward.toLocaleString()}</p>
              <p className="text-xs text-[#8a827c]">完美决策收益（期望）</p>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f0ea] text-center">
              <p className="text-xl font-black text-red-500">¥{Math.max(0, regret).toLocaleString()}</p>
              <p className="text-xs text-[#8a827c]">遗憾值 (Regret)</p>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f0ea] text-center">
              <p className="text-xl font-black text-emerald-600">{efficiency.toFixed(1)}%</p>
              <p className="text-xs text-[#8a827c]">效率比</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#6b6560]">各渠道学习结果（后验均值）</h3>
            {results.finalState.map((c) => {
              const posteriorMean = (c.successes + 1) / (c.trials + 2)
              return (
                <div key={c.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[#f5f0ea]">
                  <span className="text-sm font-medium text-[#6b6560]">{c.name}</span>
                  <div className="flex gap-3 text-xs text-[#8a827c]">
                    <span>尝试 {c.trials} 次</span>
                    <span>成功 {c.successes} 次</span>
                    <span className="font-semibold text-[#6b6560]">
                      估计 {(posteriorMean * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <ContactCTA message="想把这套方法应用到你的真实投放数据？" />
    </div>
  )
}

// Beta 分布采样（用于 Thompson Sampling 后验采样）
function betaSample(alpha: number, beta: number): number {
  const x = gammaSample(alpha, 1)
  const y = gammaSample(beta, 1)
  return x / (x + y)
}

// Marsaglia-Tsang Gamma 采样
function gammaSample(shape: number, scale: number): number {
  if (shape < 1) {
    const u = Math.random()
    return gammaSample(shape + 1, scale) * Math.pow(u, 1 / shape)
  }
  const d = shape - 1 / 3
  const c = 1 / Math.sqrt(9 * d)
  while (true) {
    let x: number
    let v: number
    do {
      x = standardNormal()
      v = 1 + c * x
    } while (v <= 0)
    v = v * v * v
    const u = Math.random()
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale
  }
}

function standardNormal(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
