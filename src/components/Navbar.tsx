import { Link, useLocation } from "react-router-dom"

const links = [
  { to: "/", label: "首页" },
  { to: "/blog", label: "文章" },
  { to: "/tools", label: "工具" },
  { to: "/about", label: "关于" },
  { to: "/collaborate", label: "合作" },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-gray-900 tracking-tight">
          跑豆<span className="text-purple-600">AI</span>
        </Link>
        <div className="flex gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
