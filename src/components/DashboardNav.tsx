import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "总览", short: "M0" },
  { to: "/dashboard/finance", label: "财务健康", short: "M1" },
  { to: "/dashboard/customers", label: "客户价值", short: "M2" },
  { to: "/dashboard/ai-chain", label: "AI产业链", short: "M3" },
];

export default function DashboardNav() {
  const { pathname } = useLocation();

  return (
    <div className="border-b border-[#e8e3dc] bg-white">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 py-2 overflow-x-auto">
        <span className="text-xs font-bold text-[#b8b0a8] mr-2 whitespace-nowrap">MBA 仪表盘</span>
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-[#c2785e]/10 text-[#c2785e]"
                  : "text-[#8a827c] hover:text-[#3d3835] hover:bg-[#f5f0ea]"
              }`}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
            </Link>
          );
        })}
        <span className="text-[11px] text-[#8a827c] ml-2 whitespace-nowrap hidden sm:inline">M4-M5 即将上线</span>
      </div>
    </div>
  );
}
