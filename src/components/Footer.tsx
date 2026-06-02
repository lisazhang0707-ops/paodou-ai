export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-slate-100 bg-slate-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span className="font-bold text-slate-800 text-base">跑豆AI</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">微信</a>
          <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">知乎</a>
          <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">小红书</a>
          <a href="mailto:lisa@paodou.ai" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">邮箱</a>
        </div>
      </div>
    </footer>
  )
}
