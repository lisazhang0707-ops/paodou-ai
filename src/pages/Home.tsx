import { Link } from "react-router-dom"

const modules = [
  {
    to: "/blog",
    title: "文章",
    desc: "销售 × AI 实操案例、工具教程、AI 学习笔记",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    to: "/tools",
    title: "工具",
    desc: "免费在线工具：ROI 计算器、客户分层模板，打开即用",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    to: "/about",
    title: "关于",
    desc: "Lisa 是谁？为什么做跑豆AI",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    to: "/collaborate",
    title: "合作",
    desc: "咨询、培训、工具定制，找到适合你的方式",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
]

const projects = [
  {
    title: "AI 产业链图谱 & 财报分析",
    desc: "上市公司产业链图谱 + 财务报告查询 + AI 尽调分析工具",
    url: "https://lisazhang0707-ops.github.io/paodou-ai/financial-resources.html",
  },
  {
    title: "维保运营监控看板",
    desc: "工地负责人/站长双视角，ECharts 可视化运营监控",
    url: "https://lisazhang0707-ops.github.io/paodou-ai/dashboard_standalone.html",
  },
  {
    title: "毕业指南",
    desc: "毕业生指南 & 资源整理",
    url: "https://lisazhang0707-ops.github.io/graduation-guide/",
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white -z-10" />

        {/* Hero SVG illustration */}
        <div className="absolute inset-0 -z-10 opacity-[0.03]">
          <svg viewBox="0 0 1200 800" fill="none">
            <rect x="100" y="100" width="300" height="300" rx="16" stroke="currentColor" strokeWidth="2" className="text-slate-900" />
            <rect x="430" y="130" width="300" height="240" rx="16" stroke="currentColor" strokeWidth="2" className="text-slate-900" />
            <rect x="760" y="70" width="340" height="360" rx="16" stroke="currentColor" strokeWidth="2" className="text-slate-900" />
            <circle cx="250" cy="520" r="80" stroke="currentColor" strokeWidth="2" className="text-blue-600" />
            <circle cx="600" cy="550" r="60" stroke="currentColor" strokeWidth="2" className="text-blue-600" />
            <circle cx="900" cy="500" r="100" stroke="currentColor" strokeWidth="2" className="text-blue-600" />
            <line x1="50" y1="650" x2="1150" y2="650" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" className="text-slate-300" />
            <path d="M200 400 L350 250 L500 350 L600 200" stroke="currentColor" strokeWidth="2" className="text-blue-600" opacity="0.5" />
            <path d="M650 380 L800 280 L950 400" stroke="currentColor" strokeWidth="2" className="text-blue-600" opacity="0.5" />
          </svg>
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          AI 驱动的销售与营销
        </span>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
          跑豆<span className="text-blue-600">AI</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-xl mb-12 leading-relaxed">
          文章 · 工具 · 学习 · 合作
        </p>

        {/* Module cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-slate-100 transition-all text-left"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {m.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{m.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Projects / 作品展示 */}
      {projects.length > 0 && (
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-slate-100" />
              <h2 className="text-lg font-bold text-slate-800 whitespace-nowrap">作品展示</h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                </a>
              ))}

              {/* Add project card */}
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center min-h-[100px]">
                <span className="text-2xl text-slate-300 mb-1">+</span>
                <span className="text-sm text-slate-400">添加你的作品</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
