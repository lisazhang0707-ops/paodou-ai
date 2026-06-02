import { Link } from "react-router-dom"
import ContactCTA from "../components/ContactCTA"

const tools = [
  {
    slug: "roi-calculator",
    title: "营销 ROI 计算器",
    desc: "输入投放金额、转化数据，自动计算 ROAS、CPA、LTV，对比多渠道效率",
    path: "/tools/roi-calculator",
  },
  {
    slug: "customer-segmentation",
    title: "客户分层模板",
    desc: "基于 RFM 模型快速给客户打分，识别高价值客户和流失风险",
    path: "/tools/customer-segmentation",
  },
]

export default function Tools() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-3">工具</h1>
        <p className="text-slate-400">免费在线工具，打开即用。更多工具持续更新中。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            to={tool.path}
            className="group p-8 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h3>
            <p className="text-slate-400 leading-relaxed">{tool.desc}</p>
          </Link>
        ))}
      </div>

      <ContactCTA message="需要更定制化的分析工具？" />
    </div>
  )
}
