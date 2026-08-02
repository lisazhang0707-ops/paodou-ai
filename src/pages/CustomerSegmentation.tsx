import { useState } from "react"
import ContactCTA from "../components/ContactCTA"

interface Customer {
  id: number
  name: string
  recency: number
  frequency: number
  monetary: number
}

interface Scored extends Customer {
  rScore: number
  fScore: number
  mScore: number
  total: number
  segment: string
}

const DEMO_DATA: Customer[] = [
  { id: 1, name: "客户 A", recency: 3, frequency: 45, monetary: 180000 },
  { id: 2, name: "客户 B", recency: 90, frequency: 3, monetary: 15000 },
  { id: 3, name: "客户 C", recency: 7, frequency: 28, monetary: 95000 },
  { id: 4, name: "客户 D", recency: 180, frequency: 1, monetary: 3000 },
  { id: 5, name: "客户 E", recency: 14, frequency: 12, monetary: 42000 },
]

// 打分规则（绝对阈值，1-3 分制）
const RULES = {
  recency: [["≤ 7 天", 3], ["8–30 天", 2], ["> 30 天", 1]] as [string, number][],
  frequency: [["≥ 30 次", 3], ["10–29 次", 2], ["< 10 次", 1]] as [string, number][],
  monetary: [["≥ ¥100,000", 3], ["¥30,000–99,999", 2], ["< ¥30,000", 1]] as [string, number][],
}

function classify(r: number, f: number, m: number): { rScore: number; fScore: number; mScore: number; total: number; segment: string } {
  const rScore = r <= 7 ? 3 : r <= 30 ? 2 : 1
  const fScore = f >= 30 ? 3 : f >= 10 ? 2 : 1
  const mScore = m >= 100000 ? 3 : m >= 30000 ? 2 : 1
  const total = rScore + fScore + mScore
  const segment = total >= 8 ? "高价值客户" : total >= 5 ? "潜力客户" : "流失风险"
  return { rScore, fScore, mScore, total, segment }
}

const segmentColors: Record<string, string> = {
  "高价值客户": "bg-emerald-50 text-emerald-600",
  "潜力客户": "bg-amber-50 text-amber-600",
  "流失风险": "bg-red-50 text-red-500",
}

export default function CustomerSegmentation() {
  const [customers, setCustomers] = useState<Customer[]>(DEMO_DATA)
  const [showPaste, setShowPaste] = useState(false)
  const [pasteText, setPasteText] = useState("")
  const [nextId, setNextId] = useState(DEMO_DATA.length + 1)

  const scored: Scored[] = customers.map(c => ({ ...c, ...classify(c.recency, c.frequency, c.monetary) }))

  const counts: Record<string, number> = {}
  scored.forEach(c => { counts[c.segment] = (counts[c.segment] || 0) + 1 })

  const updateField = (id: number, field: "name" | "recency" | "frequency" | "monetary", value: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c
      if (field === "name") return { ...c, name: value }
      return { ...c, [field]: Number(value) || 0 }
    }))
  }

  const addRow = () => {
    setCustomers(prev => [...prev, { id: nextId, name: `客户 ${String.fromCharCode(64 + nextId)}`, recency: 30, frequency: 5, monetary: 20000 }])
    setNextId(n => n + 1)
  }

  const deleteRow = (id: number) => setCustomers(prev => prev.filter(c => c.id !== id))

  const applyPaste = () => {
    const lines = pasteText.trim().split(/\r?\n/).filter(l => l.trim())
    const parsed: Customer[] = []
    let id = nextId
    lines.forEach((line, idx) => {
      const parts = line.split(/\t|,|\s+/).filter(p => p.trim())
      if (parts.length < 4) return
      // 跳过表头（第二个字段非数字）
      if (idx === 0 && isNaN(Number(parts[1]))) return
      const name = parts[0]
      const recency = Number(parts[1]) || 0
      const frequency = Number(parts[2]) || 0
      const monetary = Number(parts[3]) || 0
      parsed.push({ id: id++, name, recency, frequency, monetary })
    })
    if (parsed.length > 0) {
      setCustomers(parsed)
      setNextId(id)
      setPasteText("")
      setShowPaste(false)
    }
  }

  const resetDemo = () => {
    setCustomers(DEMO_DATA)
    setNextId(DEMO_DATA.length + 1)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-[#3d3835] mb-2">客户分层模板</h1>
      <p className="text-[#8a827c] mb-10">基于 RFM 模型（最近购买时间、购买频率、消费金额）自动给客户打分分层。可直接编辑下表，或从 Excel 粘贴数据。</p>

      {/* 打分规则 */}
      <div className="mb-8 p-4 rounded-xl bg-[#f5f0ea] text-sm">
        <p className="font-medium text-[#6b6560] mb-2">打分规则（每个维度 1–3 分）</p>
        <div className="grid sm:grid-cols-3 gap-4 text-[#8a827c]">
          <div>
            <p className="font-medium text-[#6b6560] mb-1">R · 最近购买</p>
            {RULES.recency.map(([label, score]) => <p key={label}>{label} → {score} 分</p>)}
          </div>
          <div>
            <p className="font-medium text-[#6b6560] mb-1">F · 购买频次</p>
            {RULES.frequency.map(([label, score]) => <p key={label}>{label} → {score} 分</p>)}
          </div>
          <div>
            <p className="font-medium text-[#6b6560] mb-1">M · 消费金额</p>
            {RULES.monetary.map(([label, score]) => <p key={label}>{label} → {score} 分</p>)}
          </div>
        </div>
        <p className="mt-3 text-[#8a827c]">总分分层：8–9 分 = 高价值客户 ｜ 5–7 分 = 潜力客户 ｜ 3–4 分 = 流失风险</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {Object.entries(counts).map(([segment, count]) => (
          <div key={segment} className="p-6 rounded-2xl bg-white border border-[#e8e3dc] text-center">
            <p className="text-3xl font-black text-[#3d3835]">{count}</p>
            <p className="text-sm text-[#8a827c] mt-1">{segment}</p>
          </div>
        ))}
      </div>

      {/* 操作栏 */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={addRow} className="px-3 py-1.5 rounded-lg bg-[#c2785e] text-white text-sm font-medium hover:bg-[#b0684e] transition-colors">+ 添加客户</button>
        <button onClick={() => setShowPaste(s => !s)} className="px-3 py-1.5 rounded-lg border border-[#e8e3dc] text-[#6b6560] text-sm font-medium hover:bg-[#f5f0ea] transition-colors">粘贴 Excel 数据</button>
        <button onClick={resetDemo} className="px-3 py-1.5 rounded-lg border border-[#e8e3dc] text-[#6b6560] text-sm font-medium hover:bg-[#f5f0ea] transition-colors">恢复示例</button>
      </div>

      {showPaste && (
        <div className="mb-4 p-4 rounded-xl border border-[#e8e3dc] bg-white">
          <p className="text-sm text-[#8a827c] mb-2">从 Excel 复制 4 列数据（客户名、最近购买天数、购买频次、消费金额），粘贴到下方框内，每行一个客户（支持 Tab 或空格分隔）：</p>
          <textarea
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            rows={5}
            placeholder={"客户 A\t3\t45\t180000\n客户 B\t90\t3\t15000"}
            className="w-full p-3 rounded-lg border border-[#e8e3dc] text-sm font-mono focus:outline-none focus:border-[#c2785e]"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={applyPaste} className="px-3 py-1.5 rounded-lg bg-[#c2785e] text-white text-sm font-medium hover:bg-[#b0684e]">导入并替换</button>
            <button onClick={() => { setPasteText(""); setShowPaste(false) }} className="px-3 py-1.5 rounded-lg text-[#8a827c] text-sm">取消</button>
          </div>
        </div>
      )}

      {/* 数据表 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e8e3dc]">
              <th className="pb-3 font-medium text-[#8a827c]">客户</th>
              <th className="pb-3 font-medium text-[#8a827c]">R(天)</th>
              <th className="pb-3 font-medium text-[#8a827c]">F(次)</th>
              <th className="pb-3 font-medium text-[#8a827c]">M(¥)</th>
              <th className="pb-3 font-medium text-[#8a827c] text-center">R分</th>
              <th className="pb-3 font-medium text-[#8a827c] text-center">F分</th>
              <th className="pb-3 font-medium text-[#8a827c] text-center">M分</th>
              <th className="pb-3 font-medium text-[#8a827c] text-center">总分</th>
              <th className="pb-3 font-medium text-[#8a827c]">分层</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {scored.map(c => (
              <tr key={c.id} className="border-b border-[#f0ebe4]">
                <td className="py-2">
                  <input value={c.name} onChange={e => updateField(c.id, "name", e.target.value)}
                    className="w-24 px-2 py-1 rounded border border-transparent hover:border-[#e8e3dc] focus:outline-none focus:border-[#c2785e] font-medium text-[#3d3835]" />
                </td>
                <td className="py-2">
                  <input type="number" value={c.recency} onChange={e => updateField(c.id, "recency", e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-transparent hover:border-[#e8e3dc] focus:outline-none focus:border-[#c2785e] text-[#8a827c]" />
                </td>
                <td className="py-2">
                  <input type="number" value={c.frequency} onChange={e => updateField(c.id, "frequency", e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-transparent hover:border-[#e8e3dc] focus:outline-none focus:border-[#c2785e] text-[#8a827c]" />
                </td>
                <td className="py-2">
                  <input type="number" value={c.monetary} onChange={e => updateField(c.id, "monetary", e.target.value)}
                    className="w-24 px-2 py-1 rounded border border-transparent hover:border-[#e8e3dc] focus:outline-none focus:border-[#c2785e] text-[#8a827c]" />
                </td>
                <td className="py-2 text-center text-[#6b6560]">{c.rScore}</td>
                <td className="py-2 text-center text-[#6b6560]">{c.fScore}</td>
                <td className="py-2 text-center text-[#6b6560]">{c.mScore}</td>
                <td className="py-2 text-center font-bold text-[#3d3835]">{c.total}</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${segmentColors[c.segment]}`}>{c.segment}</span>
                </td>
                <td className="py-2">
                  <button onClick={() => deleteRow(c.id)} className="text-[#8a827c] hover:text-red-500 text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContactCTA message="想接入你自己的客户数据做分析？" />
    </div>
  )
}
