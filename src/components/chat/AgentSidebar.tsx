import { useState } from "react";
import type { AgentConfig } from "../../data/agents";
import type { ApiProvider } from "../../data/providers";

interface Props {
  agents: AgentConfig[];
  activeId: string;
  onSelect: (id: string) => void;
  hasApiKey: boolean;
  onApiKeyClick: () => void;
  providerId: string;
  providers: ApiProvider[];
  onProviderChange: (id: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  searchEnabled: boolean;
  onSearchToggle: () => void;
  tavilyKey: string;
  onTavilyKeyChange: (key: string) => void;
}

export default function AgentSidebar({
  agents,
  activeId,
  onSelect,
  hasApiKey,
  onApiKeyClick,
  providerId,
  providers,
  onProviderChange,
  model,
  onModelChange,
  searchEnabled,
  onSearchToggle,
  tavilyKey,
  onTavilyKeyChange,
}: Props) {
  const currentProvider = providers.find((p) => p.id === providerId) ?? providers[0];
  // expanded parent agents — auto-expand when a sub-agent is active
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const set = new Set<string>();
    for (const a of agents) {
      if (a.subAgents?.some((s) => s.id === activeId)) {
        set.add(a.id);
      }
    }
    return set;
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const isSubActive = (parent: AgentConfig) =>
    parent.subAgents?.some((s) => s.id === activeId);

  const ProviderSelect = () => (
    <select
      value={providerId}
      onChange={(e) => onProviderChange(e.target.value)}
      className="w-full text-xs border border-[#e8e3dc] rounded-lg px-2 py-1.5 bg-white text-[#3d3835] focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20"
    >
      {providers.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </select>
  );

  const ModelSelect = () => (
    <select
      value={model}
      onChange={(e) => onModelChange(e.target.value)}
      className="w-full text-xs border border-[#e8e3dc] rounded-lg px-2 py-1.5 bg-white text-[#3d3835] focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20"
    >
      {providerId === "custom" ? (
        <option value={model}>{model || "输入模型名"}</option>
      ) : currentProvider.models.length > 0 ? (
        currentProvider.models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))
      ) : (
        <option value={model}>{model}</option>
      )}
    </select>
  );

  // Mobile: flatten all agents + subAgents into one list
  const flatAgents = agents.flatMap((a) =>
    a.subAgents ? [a, ...a.subAgents] : [a]
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-[#e8e3dc] lg:bg-white lg:flex-shrink-0">
        <div className="p-4 border-b border-[#e8e3dc]">
          <h2 className="text-sm font-bold text-[#6b6560] flex items-center gap-2">
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-[#c2785e]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            AI 智能体
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {agents.map((agent) => {
            const hasSubs = !!agent.subAgents?.length;
            const expanded_ = expanded.has(agent.id);
            const subActive = isSubActive(agent);
            const isActive = activeId === agent.id || subActive;

            return (
              <div key={agent.id}>
                {/* Parent agent button */}
                <button
                  onClick={() => {
                    if (hasSubs) {
                      toggleExpand(agent.id);
                      // if not expanded and no sub active yet, select first sub
                      if (!expanded_ && !subActive && agent.subAgents?.[0]) {
                        onSelect(agent.subAgents[0].id);
                      }
                    } else {
                      onSelect(agent.id);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#f5f0ea] shadow-sm ring-1 ring-[#c2785e]/20"
                      : "hover:bg-[#f5f0ea] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{agent.icon}</span>
                    <span className="font-bold text-sm text-[#3d3835] flex-1">{agent.name}</span>
                    {hasSubs && (
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        className={`text-[#8a827c] transition-transform ${expanded_ ? "rotate-90" : ""}`}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-[#8a827c] leading-relaxed">{agent.description}</p>
                  <div className="flex gap-1 mt-2">
                    {agent.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#f5f0ea] text-[#8a827c]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Sub-agents */}
                {hasSubs && expanded_ && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#e8e3dc] pl-3">
                    {agent.subAgents!.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(sub.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          activeId === sub.id
                            ? "bg-[#c2785e]/10 ring-1 ring-[#c2785e]/20"
                            : "hover:bg-[#f5f0ea]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{sub.icon}</span>
                          <span className={`text-sm font-medium ${activeId === sub.id ? "text-[#c2785e]" : "text-[#6b6560]"}`}>
                            {sub.name}
                          </span>
                        </div>
                        <p className="text-xs text-[#8a827c] mt-0.5">{sub.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#e8e3dc] space-y-2">
          <div>
            <label className="block text-xs text-[#8a827c] mb-1 font-medium">服务商</label>
            <ProviderSelect />
          </div>
          <div>
            <label className="block text-xs text-[#8a827c] mb-1 font-medium">模型</label>
            {providerId === "custom" ? (
              <input
                type="text"
                value={model}
                onChange={(e) => onModelChange(e.target.value)}
                placeholder="输入模型名称"
                className="w-full text-xs border border-[#e8e3dc] rounded-lg px-2 py-1.5 bg-white text-[#3d3835] focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20"
              />
            ) : (
              <ModelSelect />
            )}
          </div>
          {providerId === "custom" && (
            <div>
              <label className="block text-xs text-[#8a827c] mb-1 font-medium">Endpoint</label>
              <input
                type="text"
                value={localStorage.getItem("api_endpoint_custom") ?? ""}
                onChange={(e) => localStorage.setItem("api_endpoint_custom", e.target.value)}
                placeholder="https://api.example.com/v1/chat/completions"
                className="w-full text-xs border border-[#e8e3dc] rounded-lg px-2 py-1.5 bg-white text-[#3d3835] focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20 font-mono"
              />
            </div>
          )}
        </div>
        <div className="p-3 border-t border-[#e8e3dc] space-y-3">
          {/* Search toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#8a827c] font-medium">🔍 联网搜索</label>
            <button
              onClick={onSearchToggle}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                searchEnabled ? "bg-blue-500" : "bg-[#f5f0ea]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  searchEnabled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {/* Tavily key */}
          {searchEnabled && (
            <div>
              <label className="block text-xs text-[#8a827c] mb-1 font-medium">Tavily API Key</label>
              <input
                type="password"
                value={tavilyKey}
                onChange={(e) => onTavilyKeyChange(e.target.value)}
                placeholder="tvly-dev-..."
                className="w-full text-xs border border-[#e8e3dc] rounded-lg px-2 py-1.5 bg-white text-[#3d3835] focus:outline-none focus:ring-2 focus:ring-[#c2785e]/20"
              />
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#e8e3dc]">
          <button
            onClick={onApiKeyClick}
            className="w-full flex items-center gap-2 text-xs text-[#8a827c] hover:text-[#3d3835] transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-emerald-500" : "bg-amber-500"}`} />
            {hasApiKey ? "API Key 已配置" : "请配置 API Key"}
            <span className="ml-auto text-[#b8b0a8]">⚙</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden border-b border-[#e8e3dc] bg-white px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {flatAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                activeId === agent.id
                  ? "bg-[#c2785e]/10 text-[#c2785e] font-medium"
                  : "bg-[#f5f0ea] border border-[#e8e3dc] text-[#8a827c] hover:border-[#d6d0c8]"
              }`}
            >
              <span>{agent.icon}</span>
              <span>{agent.name}</span>
            </button>
          ))}
          <span className="text-[#8a827c] mx-1">|</span>
          <button
            onClick={onApiKeyClick}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
              hasApiKey
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-emerald-500" : "bg-amber-500"}`} />
            {hasApiKey ? currentProvider.label : "设置Key"}
          </button>
          <select
            value={providerId}
            onChange={(e) => onProviderChange(e.target.value)}
            className="text-xs border border-[#e8e3dc] rounded-full px-2 py-1 bg-white text-[#3d3835] flex-shrink-0 focus:outline-none"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
