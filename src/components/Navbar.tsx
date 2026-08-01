import { Link, useLocation } from "react-router-dom"

const links = [
  { to: "/", label: "首页" },
  { to: "/blog", label: "文章" },
  { to: "/tools", label: "工具" },
  { to: "/strategy", label: "战略分析" },
  { to: "/agents", label: "智能体" },
  { to: "/growth", label: "成长" },
  { to: "/about", label: "关于" },
  { to: "/dashboard", label: "仪表盘" },
  { to: "/collaborate", label: "合作" },
  { to: import.meta.env.BASE_URL + "education.html", label: "学习教育", external: true },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#faf7f2]/80 backdrop-blur-md border-b border-[#e8e3dc]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-[#3d3835] tracking-tight">
          跑豆<span className="text-[#c2785e]">AI</span>
        </Link>
        <div className="flex gap-1 flex-wrap justify-end">
          {links.map(({ to, label, external }) =>
            external ? (
              <a
                key={to}
                href={to}
                className="px-3 py-2 rounded-full text-sm font-medium transition-colors text-[#8a827c] hover:text-[#3d3835] hover:bg-[#f5f0ea]"
              >
                {label}
              </a>
            ) : (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  pathname === to
                    ? "bg-[#c2785e]/10 text-[#c2785e]"
                    : "text-[#8a827c] hover:text-[#3d3835] hover:bg-[#f5f0ea]"
                }`}
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
