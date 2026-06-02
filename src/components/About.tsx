export default function About() {
  return (
    <section id="about" className="px-6 py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-purple-200">
              L
            </div>
          </div>

          <div className="text-center md:text-left">
            <span className="text-purple-600 font-semibold text-sm tracking-wide uppercase">关于我</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Hi，我是 Lisa
            </h2>
            <div className="space-y-4 text-gray-500 leading-relaxed text-lg">
              <p>
                资深销售与营销管理者，多年一线实战经验。相信 AI 不是替代人，而是让专业的人更高效。
              </p>
              <p>
                跑豆AI 是我创立的个人品牌，致力于将 AI 能力带入销售与营销的日常工作中——不是泛泛的"AI 赋能"，而是具体的、可落地的工具和方法。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
