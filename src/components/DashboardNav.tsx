import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "总览", short: "M0" },
  { to: "/dashboard/finance", label: "财务健康", short: "M1" },
  { to: "/dashboard/customers", label: "客户价值", short: "M2" },
];

export default function DashboardNav() {
  const { pathname } = useLocation();

  return (
    <div className="border-b border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 py-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-300 mr-2 whitespace-nowrap">MBA 仪表盘</span>
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
            </Link>
          );
        })}
        <span className="text-[11px] text-slate-300 ml-2 whitespace-nowrap hidden sm:inline">M3-M5 即将上线</span>
      </div>
    </div>
  );
}
