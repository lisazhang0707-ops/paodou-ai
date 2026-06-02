const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: "销售数据分析",
    desc: "用 AI 自动分析销售数据，发现隐藏的趋势、机会和风险，生成可视化报告",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "营销 ROI 优化",
    desc: "追踪多渠道营销投放效果，AI 智能分配预算，最大化每一分钱的回报",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: "客户画像洞察",
    desc: "基于行为数据自动构建客户画像，精准识别高价值客户和潜在流失客户",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
    title: "自动化工作流",
    desc: "从线索获取到客户跟进，AI 自动化全流程，让你专注于高价值决策",
  },
]

export default function Features() {
  return (
    <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-purple-600 font-semibold text-sm tracking-wide uppercase">核心能力</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
          AI 驱动的营销工具链
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          从数据到决策，一站式 AI 工具助力你的销售与营销增长
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="group p-8 rounded-2xl border border-gray-100 hover:border-purple-100 hover:shadow-lg hover:shadow-purple-50 transition-all bg-white"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
