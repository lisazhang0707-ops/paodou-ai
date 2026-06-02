import { useState, useMemo } from "react"
import ContactCTA from "../components/ContactCTA"

interface Channel {
  name: string
  trueRate: number
  trials: number
  successes: number
}

export default function BanditModel() {
  const [budget, setBudget] = useState(10000)
  const [channels, setChannels] = useState<Channel[]>([
    { name: "公众号", trueRate: 0.023, trials: 0, successes: 0 },
    { name: "抖音", trueRate: 0.035, trials: 0, successes: 0 },
    { name: "小红书", trueRate: 0.018, trials: 0, successes: 0 },
    { name: "知乎", trueRate: 0.028, trials: 0, successes: 0 },
  ])

  const [exploreRatio, setExploreRatio] = useState(0.15)

  const results = useMemo(() => {
    const data: { round: number; channel: string; reward: number; cumulativeReward: number; optimalReward: number }[] = []
    const state = channels.map(c => ({ ...c }))
    let cumulative = 0
    let optimal = 0
    const batches = Math.floor(budget / 100)

    for (let i = 0; i < batches; i++) {
      let selected: number
      if (Math.random() < exploreRatio || i < 8) {
        selected = Math.floor(Math.random() * state.length)
      } else {
        // Thompson sampling: pick channel with highest sampled rate
        let best = -1
        let bestSample = -1
        for (let j = 0; j < state.length; j++) {
          const sample = (state[j].successes + 1) / (state[j].trials + 2) + (Math.random() - 0.5) * 0.05
          if (sample > bestSample) {
            bestSample = sample
            best = j
          }
        }
        selected = best
      }
      // trueRate is hidden, convert this round randomly
      const reward = Math.random() < state[selected].trueRate ? 1000 : 0
      state[selected].trials++
      if (reward > 0) state[selected].successes++
      cumulative += reward
      optimal += 1000 * Math.max(...state.map(c => c.trueRate))
      data.push({ round: i + 1, channel: state[selected].name, reward, cumulativeReward: cumulative, optimalReward: optimal })
    }
    return { data, finalState: state, totalReward: cumulative, optimalReward: optimal }
  }, [budget, exploreRatio, channels])

  const regret = results.optimalReward - results.totalReward

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-2">多臂老虎机 — A/B 测试预算分配</h1>
      <p className="text-slate-400 mb-4">自动探索 vs 利用：用 Thompson Sampling 动态分配营销预算到转化率最高的渠道</p>
      <div className="mb-8 p-4 rounded-xl bg-slate-50 text-sm text-slate-400">
        <span className="font-medium text-slate-600">模型来源：</span>《模型思维》第 27 章 — 多臂老虎机问题。平衡探索新选项（explore）和利用已知最优解（exploit），最大化长期收益。
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">总预算 (¥)</span>
              <span className="font-semibold text-slate-900">{budget.toLocaleString()}</span>
            </div>
            <input
              type="range" min={1000} max={100000} step={1000} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">探索比例 (Explore %)</span>
              <span className="font-semibold text-slate-900">{(exploreRatio * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range" min={1} max={50} step={1} value={exploreRatio * 100}
              onChange={(e) => setExploreRatio(Number(e.target.value) / 100)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">渠道真实转化率（隐藏值，仅用于模拟）</h3>
            {channels.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{c.name}</span>
                <input
                  type="range" min={0.1} max={10} step={0.1} value={c.trueRate * 100}
                  onChange={(e) => {
                    const updated = [...channels]
                    updated[i].trueRate = Number(e.target.value) / 100
                    setChannels(updated)
                  }}
                  className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-mono text-slate-600 w-10 text-right">{(c.trueRate * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className="text-xl font-black text-blue-600">¥{results.totalReward.toLocaleString()}</p>
              <p className="text-xs text-slate-400">实际收益</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className="text-xl font-black text-slate-900">¥{results.optimalReward.toLocaleString()}</p>
              <p className="text-xs text-slate-400">完美决策收益</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className="text-xl font-black text-red-500">¥{regret.toLocaleString()}</p>
              <p className="text-xs text-slate-400">遗憾值 (Regret)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <p className="text-xl font-black text-emerald-600">{((results.totalReward / results.optimalReward) * 100).toFixed(1)}%</p>
              <p className="text-xs text-slate-400">效率比</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">各渠道学习结果</h3>
            {results.finalState.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-sm font-medium text-slate-700">{c.name}</span>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>尝试 {c.trials} 次</span>
                  <span>成功 {c.successes} 次</span>
                  <span className="font-semibold text-slate-600">
                    估计 {(c.successes / Math.max(c.trials, 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ContactCTA message="想把这套方法应用到你的真实投放数据？" />
    </div>
  )
}
