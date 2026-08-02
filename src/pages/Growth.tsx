import { Link } from "react-router-dom"

const learningResources = [
  {
    title: "AI 学习追踪器",
    desc: "系统化追踪 AI 学习进度，规划学习路径，记录关键节点",
    url: "/paodou-ai/ai-learning-tracker.html",
    external: true,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "回到首页",
    desc: "跑豆AI — AI 驱动的销售与营销",
    to: "/",
    external: false,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
]

export default function Growth() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-3">个人成长</h1>
        <p className="text-slate-500 text-lg">学习工具与资源，持续精进 AI 能力</p>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-slate-100" />
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Learning Resources */}
      <div className="grid sm:grid-cols-2 gap-4">
        {learningResources.map((item) => {
          const sharedClasses =
            "group p-6 rounded-2xl border border-slate-100 bg-white hover:border-emerald-100 hover:shadow-lg hover:shadow-slate-100 transition-all text-left"

          const content = (
            <>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                {item.external && (
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </>
          )

          if (item.external) {
            return (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={sharedClasses}
              >
                {content}
              </a>
            )
          }

          return (
            <Link key={item.to} to={item.to!} className={sharedClasses}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
