export default function Collaborate() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-gray-900 mb-3">合作</h1>
      <p className="text-gray-400 mb-12">为销售团队和营销人提供 AI 落地的咨询、培训与工具定制</p>

      <div className="space-y-6 mb-16">
        {[
          {
            title: "一对一咨询",
            desc: "针对你的业务场景，给出 AI 工具选型和落地路线图。适合正在探索 AI 但不知道从哪开始的团队。",
            price: "¥2,000 / 次",
          },
          {
            title: "企业内训",
            desc: "半天或全天的 AI 实战培训，内容包括 Prompt Engineering、AI 销售流程搭建、数据驱动决策。",
            price: "¥15,000 起 / 场",
          },
          {
            title: "工具定制",
            desc: "根据你的业务需求定制化开发：客户分析大屏、自动化报表、AI 外呼脚本等。",
            price: "按需报价",
          },
        ].map((s) => (
          <div key={s.title} className="p-6 rounded-2xl border border-gray-100 bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
              <span className="text-purple-600 font-semibold text-sm whitespace-nowrap ml-4">{s.price}</span>
            </div>
            <p className="text-gray-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">开始合作</h2>
        <p className="text-purple-200 mb-6">扫码加 Lisa 微信，聊聊你的需求。没有套路，先聊清楚再决定。</p>
        <div className="w-32 h-32 mx-auto bg-white/20 rounded-xl flex items-center justify-center text-white/60 text-sm">
          微信二维码
        </div>
      </div>
    </div>
  )
}
