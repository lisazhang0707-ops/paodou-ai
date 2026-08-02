import { Link } from "react-router-dom"

const modules = [
  {
    to: "/blog",
    title: "文章",
    desc: "销售 × AI 实操案例、工具教程、AI 学习笔记",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    to: "/tools",
    title: "工具",
    desc: "免费在线工具：ROI 计算器、客户分层模板，打开即用",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    to: "/agents",
    title: "智能体",
    desc: "AI 写作助手：公众号长文、短视频脚本、标书分析",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "仪表盘",
    desc: "MBA 数据管理模型：财务、客户、竞争、效率、团队",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    to: "/strategy",
    title: "战略分析",
    desc: "多框架企业战略诊断：五力、SWOT、BSC、蓝海战略",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
  },
  {
    to: "/collaborate",
    title: "合作",
    desc: "咨询、培训、工具定制，找到适合你的方式",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      {/* Hero — 左右布局 */}
      <section className="relative min-h-[88vh] flex items-center px-6 lg:px-16 overflow-hidden" style={{background: "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(194,120,94,0.06) 0%, transparent 60%), #faf7f2"}}>
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 左列 */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-[#c2785e]/10 text-[#c2785e] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#c2785e] animate-pulse" />
              AI 驱动的销售与营销
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#3d3835] mb-6 leading-tight">
              跑豆<span className="text-[#c2785e]">AI</span>
            </h1>

            <p className="text-xl text-[#8a827c] font-light max-w-lg mb-10 leading-relaxed">
              帮销售管理者用 AI 提效——不讲概念，给可落地的工具和方法
            </p>

            <div className="flex gap-4 flex-wrap mb-12">
              <Link
                to="/agents"
                className="px-8 py-3.5 bg-[#c2785e] text-white rounded-full font-medium hover:bg-[#b0684e] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c2785e]/25 transition-all text-sm"
              >
                免费试用智能体
              </Link>
              <Link
                to="/tools"
                className="px-8 py-3.5 border border-[#e8e3dc] text-[#6b6560] rounded-full font-medium hover:border-[#c2785e]/30 hover:bg-[#c2785e]/5 hover:-translate-y-0.5 transition-all text-sm"
              >
                探索工具
              </Link>
            </div>

            <p className="text-sm text-[#b8b0a8]">
              已服务 200+ 销售团队 · AI 智能体日均调用 500+ 次
            </p>
          </div>

          {/* 右列 — 悬浮软件演示卡 */}
          <div className="hidden lg:flex justify-center">
            <div
              className="relative w-full max-w-lg"
              style={{ perspective: "1000px" }}
            >
              <div
                className="bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-[#e8e3dc] p-6 transition-transform duration-500 ease-out hover:-translate-y-2 hover:rotate-y-2 hover:shadow-2xl hover:shadow-stone-200/80"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 模拟浏览器标题栏 */}
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#f0ebe4]">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <div className="w-3 h-3 rounded-full bg-amber-300" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300" />
                  <span className="ml-3 text-xs text-[#b8b0a8] font-mono">跑豆AI · 销售仪表盘</span>
                </div>

                {/* 模拟 dashboard 内容 */}
                <div className="space-y-4">
                  {/* KPI row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "本月收入", value: "¥128万", color: "#c2785e" },
                      { label: "转化率", value: "23.5%", color: "#10b981" },
                      { label: "客户数", value: "186家", color: "#6366f1" },
                    ].map((k) => (
                      <div key={k.label} className="bg-[#faf7f2] rounded-2xl p-3 text-center">
                        <div className="text-[10px] text-[#b8b0a8] mb-1">{k.label}</div>
                        <div className="text-sm font-bold" style={{color: k.color}}>{k.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* 模拟图表 */}
                  <div className="bg-[#faf7f2] rounded-2xl p-5">
                    <div className="text-xs text-[#8a827c] mb-3 font-medium">收入趋势</div>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 55, 35, 70, 60, 85, 50, 75, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
                            style={{ height: `${h}%`, background: i === 11 ? "#c2785e" : "#e8e3dc" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-[#b8b0a8]">
                      <span>1月</span><span>6月</span><span>12月</span>
                    </div>
                  </div>

                  {/* 底部 AI 建议 */}
                  <div className="bg-[#c2785e]/5 rounded-2xl p-4 border border-[#c2785e]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-[#c2785e]/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#c2785e]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-[#c2785e]">AI 洞察</span>
                    </div>
                    <p className="text-xs text-[#6b6560] leading-relaxed">
                      本月收入环比增长 12%，建议加大华东区域投放力度，当前 ROI 表现最佳。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module cards — 2x3 网格 */}
      <section className="px-6 lg:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#3d3835] mb-3">探索跑豆AI</h2>
            <p className="text-[#8a827c] max-w-md mx-auto">六大核心模块，覆盖销售与营销全流程</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="group p-7 rounded-3xl border border-[#e8e3dc] bg-white hover:border-[#c2785e]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60 transition-all"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#c2785e]/10 text-[#c2785e] mb-5 group-hover:bg-[#c2785e] group-hover:text-white transition-colors">
                  {m.icon}
                </div>
                <h3 className="font-bold text-[#3d3835] mb-2 text-lg">{m.title}</h3>
                <p className="text-sm text-[#8a827c] leading-relaxed">{m.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects / 作品展示 */}
      {projects.length > 0 && (
        <section className="px-6 lg:px-16 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-[#e8e3dc]" />
              <h2 className="text-lg font-bold text-[#3d3835] whitespace-nowrap">作品展示</h2>
              <div className="h-px flex-1 bg-[#e8e3dc]" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          </div>
        </section>
      )}
    </div>
  )
}
