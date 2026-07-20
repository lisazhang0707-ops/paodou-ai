import { Link, useLocation } from "react-router-dom"

const links = [
  { to: "/", label: "首页" },
  { to: "/blog", label: "文章" },
  { to: "/tools", label: "工具" },
  { to: "/strategy", label: "战略分析" },
  { to: "/agents", label: "智能体" },
  { to: "/about", label: "关于" },
  { to: "/dashboard", label: "仪表盘" },
  { to: "/collaborate", label: "合作" },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-slate-100 tracking-tight">
          跑豆<span className="text-blue-400">AI</span>
        </Link>
        <div className="flex gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
