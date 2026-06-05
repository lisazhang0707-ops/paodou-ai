import type { AgentConfig } from "../../data/agents";

interface Props {
  agents: AgentConfig[];
  activeId: string;
  onSelect: (id: string) => void;
  hasApiKey: boolean;
  onApiKeyClick: () => void;
}

export default function AgentSidebar({
  agents,
  activeId,
  onSelect,
  hasApiKey,
  onApiKeyClick,
}: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-slate-100 lg:bg-slate-50 lg:flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            AI 智能体
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                activeId === agent.id
                  ? "bg-white shadow-sm ring-1 ring-blue-100"
                  : "hover:bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{agent.icon}</span>
                <span className="font-bold text-sm text-slate-900">
                  {agent.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {agent.description}
              </p>
              <div className="flex gap-1 mt-2">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onApiKeyClick}
            className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {hasApiKey ? "API Key 已配置" : "请配置 API Key"}
            <span className="ml-auto text-slate-300">⚙</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                activeId === agent.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <span>{agent.icon}</span>
              <span>{agent.name}</span>
            </button>
          ))}
          <button
            onClick={onApiKeyClick}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
              hasApiKey
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {hasApiKey ? "已配置" : "设置Key"}
          </button>
        </div>
      </div>
    </>
  );
}
