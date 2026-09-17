import { Link } from "react-router-dom"

const projects = [
  {
    title: "AI 产业链图谱 & 财报分析",
    desc: "上市公司产业链图谱 + 财务报告查询 + AI 尽调分析工具",
    url: "https://lisazhang0707-ops.github.io/paodou-ai/financial-resources.html",
    external: true,
  },
  {
    title: "维保运营监控看板",
    desc: "工地负责人/站长双视角，ECharts 可视化运营监控",
    url: "https://lisazhang0707-ops.github.io/paodou-ai/dashboard_standalone.html",
    external: true,
  },
  {
    title: "毕业指南",
    desc: "毕业生指南 & 资源整理",
    url: "https://lisazhang0707-ops.github.io/graduation-guide/",
    external: true,
  },
  {
    title: "AI 学习追踪器",
    desc: "系统化追踪 AI 学习进度，规划学习路径",
    url: import.meta.env.BASE_URL + "ai-learning-tracker.html",
    external: true,
  },
]

const strategyItems = [
  {
    to: "/strategy",
    title: "战略分析",
    desc: "多框架企业战略诊断：五力、SWOT、BSC、蓝海战略、PESTEL、安索夫矩阵",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "管理仪表盘",
    desc: "MBA 数据管理模型：财务、客户、AI产业链、竞争、效率、团队",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
]

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-[#3d3835] mb-3">作品展示</h1>
        <p className="text-[#8a827c] text-lg">数据工具、分析框架、实战项目，持续积累</p>
      </div>

      {/* 分析工具 */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-[#3d3835] mb-6 pb-3 border-b border-[#e8e3dc]">分析工具</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {strategyItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group p-7 rounded-3xl border border-[#e8e3dc] bg-white hover:border-[#c2785e]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60 transition-all"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#c2785e]/10 text-[#c2785e] mb-5 group-hover:bg-[#c2785e] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#3d3835] mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-[#8a827c] leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 独立项目 */}
      <section>
        <h2 className="text-xl font-bold text-[#3d3835] mb-6 pb-3 border-b border-[#e8e3dc]">独立项目</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-7 rounded-3xl border border-[#e8e3dc] bg-white hover:border-[#c2785e]/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/60 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-[#3d3835] group-hover:text-[#c2785e] transition-colors">
                  {p.title}
                </h3>
                <svg className="w-4 h-4 text-[#b8b0a8] group-hover:text-[#c2785e] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              <p className="text-sm text-[#8a827c] leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
