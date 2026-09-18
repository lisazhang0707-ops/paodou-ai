import { leaderTiers, platformGuide, dailyRoutine } from "../data/aiLeaders"

export default function Leaders() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* 页头 */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-[#c2785e]/10 text-[#c2785e] mb-6">
          2026 全球 AI 一线人物清单
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#3d3835] mb-4">
          关注大佬<span className="text-[#c2785e]">，精进学习</span>
        </h1>
        <p className="text-lg text-[#8a827c] max-w-2xl mx-auto leading-relaxed">
          15 位最值得关注的一线 AI 人物，按「看谁、看什么、多久看一次」分层整理。
          X 上的一手信息，价值高于任何二手 AI 新闻。
        </p>
        <p className="text-xs text-[#b8b0a8] mt-4">更新日期：2026-09-18</p>
      </div>

      {/* 三层人物 */}
      {leaderTiers.map((tier) => (
        <div key={tier.tier} className="mb-16">
          <div className="flex items-center gap-4 mb-2">
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#c2785e] text-white">
              {tier.tier}
            </span>
            <h2 className="text-2xl font-black text-[#3d3835]">{tier.title}</h2>
          </div>
          <p className="text-sm text-[#8a827c] mb-8 ml-0">{tier.subtitle}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier.leaders.map((p) => (
              <div
                key={p.nameEn}
                className="flex flex-col p-6 rounded-3xl border border-[#e8e3dc] bg-white hover:border-[#c2785e]/25 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/60 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {p.avatar ? (
                    <img
                      src={p.avatar.src}
                      alt={p.nameZh}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#f0ebe4]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#c2785e]/10 text-[#c2785e] flex items-center justify-center font-bold text-lg shrink-0 border-2 border-[#c2785e]/20">
                      {p.nameZh.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#3d3835] text-lg leading-tight truncate">{p.nameZh}</h3>
                    <span className="text-xs text-[#c2785e] font-medium">{p.nameEn}</span>
                  </div>
                </div>
                <p className="text-xs text-[#8a827c] mb-1">{p.role}</p>
                <p className="text-xs text-[#b8b0a8] mb-4">关注：{p.focus}</p>

                <p className="text-sm text-[#6b6560] leading-relaxed mb-5 flex-1">{p.why}</p>

                <div className="flex gap-2">
                  {p.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#e8e3dc] text-xs font-medium text-[#6b6560] hover:border-[#c2785e]/40 hover:bg-[#c2785e]/5 hover:text-[#c2785e] transition-colors"
                    >
                      {l.label}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 平台分工 */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#e8e3dc]" />
          <h2 className="text-xl font-bold text-[#3d3835] whitespace-nowrap">📱 在哪个平台看</h2>
          <div className="h-px flex-1 bg-[#e8e3dc]" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {platformGuide.map((p) => (
            <div key={p.platform} className="p-6 rounded-3xl border border-[#e8e3dc] bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#3d3835] text-lg">{p.platform}</h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#c2785e]/10 text-[#c2785e]">
                  {p.role}
                </span>
              </div>
              <p className="text-sm text-[#6b6560] leading-relaxed mb-3">{p.desc}</p>
              <p className="text-xs text-[#b8b0a8]">{p.sample}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 15 分钟流程 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#e8e3dc]" />
          <h2 className="text-xl font-bold text-[#3d3835] whitespace-nowrap">⏱ 每天 15 分钟摄入流程</h2>
          <div className="h-px flex-1 bg-[#e8e3dc]" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {dailyRoutine.map((step, i) => (
            <div key={step.title} className="relative p-6 rounded-3xl border border-[#e8e3dc] bg-white">
              <div className="w-9 h-9 rounded-full bg-[#c2785e] text-white flex items-center justify-center font-bold mb-4">
                {i + 1}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-[#3d3835]">{step.title}</h3>
                <span className="text-xs text-[#b8b0a8] font-medium">{step.time}</span>
              </div>
              <p className="text-sm text-[#6b6560] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="border border-dashed border-[#e8e3dc] rounded-3xl p-8 text-center bg-white/50">
        <p className="text-sm text-[#8a827c] leading-relaxed max-w-2xl mx-auto">
          看信息是为了建立判断，不是为了收集信息。每天 15 分钟看完，周末挑一条最有价值的
          深挖成文章或实操，沉淀进<a href="#/blog" className="text-[#c2785e] hover:underline">跑豆 AI 知识库</a>。
        </p>
      </div>

      {/* 头像来源署名 */}
      <div className="mt-8">
        <p className="text-xs text-[#b8b0a8] mb-2 font-medium">头像来源（CC 授权照片 + 个人公开头像）</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {(() => {
            const seen = new Set<string>()
            const credits: { credit: string; creditUrl?: string }[] = []
            for (const tier of leaderTiers)
              for (const p of tier.leaders)
                if (p.avatar && !seen.has(p.avatar.src)) {
                  seen.add(p.avatar.src)
                  credits.push({ credit: `${p.nameZh}：${p.avatar.credit}`, creditUrl: p.avatar.creditUrl })
                }
            return credits.map((c) =>
              c.creditUrl ? (
                <a key={c.credit} href={c.creditUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#b8b0a8] hover:text-[#c2785e] transition-colors">
                  {c.credit}
                </a>
              ) : (
                <span key={c.credit} className="text-[10px] text-[#b8b0a8]">{c.credit}</span>
              )
            )
          })()}
        </div>
      </div>
    </div>
  )
}
