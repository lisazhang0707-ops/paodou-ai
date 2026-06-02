export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
        <div className="flex-shrink-0 relative">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-slate-200">
            L
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-6">Hi，我是 Lisa</h1>
          <div className="space-y-4 text-slate-500 leading-relaxed text-lg">
            <p>
              资深销售与营销管理者，多年一线实战经验。相信 AI 不是替代人，而是让专业的人更高效。
            </p>
            <p>
              跑豆AI 是我创立的个人品牌，致力于将 AI 能力带入销售与营销的日常工作中——不是泛泛的"AI 赋能"，而是具体的、可落地的工具和方法。
            </p>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center gap-4 mb-16">
        <div className="h-px flex-1 bg-slate-100" />
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">关注领域</h2>
          <ul className="space-y-2 text-slate-500">
            <li>· AI 在销售流程中的落地应用</li>
            <li>· 营销 ROI 量化与归因分析</li>
            <li>· 客户数据挖掘与分层</li>
            <li>· 自动化营销工作流搭建</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">找到我</h2>
          <ul className="space-y-2 text-slate-500">
            <li>· 微信：扫码添加</li>
            <li>· 知乎：@跑豆AI</li>
            <li>· 小红书：@跑豆AI</li>
            <li>· 邮箱：lisa@paodou.ai</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
