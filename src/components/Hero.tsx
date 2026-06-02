export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl -z-10" />

      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 mb-8">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        AI 驱动的销售与营销
      </span>

      <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6">
        跑豆<span className="text-purple-600">AI</span>
      </h1>

      <p className="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
        让 AI 成为你的销售与营销引擎，自动化获客、分析、决策，释放增长潜力
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <a
          href="#features"
          className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
          了解更多
        </a>
        <a
          href="#about"
          className="px-8 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          关于 Lisa
        </a>
      </div>
    </section>
  )
}
