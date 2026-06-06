import { useState, useRef, useEffect, useMemo } from "react";
import { agents } from "../data/agents";
import { API_PROVIDERS } from "../data/providers";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { useChat } from "../hooks/useChat";
import AgentSidebar from "../components/chat/AgentSidebar";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import ApiKeyModal from "../components/ApiKeyModal";

function getKeyForProvider(providerId: string): string {
  return "api_key_" + providerId;
}

export default function Agents() {
  const [providerId, setProviderId] = useLocalStorage("ai_provider", "deepseek");
  const provider = useMemo(
    () => API_PROVIDERS.find((p) => p.id === providerId) ?? API_PROVIDERS[0],
    [providerId]
  );

  // Effective endpoint (custom provider reads from localStorage)
  const endpoint = useMemo(() => {
    if (providerId === "custom") {
      return localStorage.getItem("api_endpoint_custom") || "";
    }
    return provider.endpoint;
  }, [providerId, provider.endpoint]);

  const [model, setModel] = useLocalStorage(
    "ai_model_" + providerId,
    provider.defaultModel
  );
  useEffect(() => {
    if (providerId !== "custom" && provider.models.length > 0 && !provider.models.includes(model)) {
      setModel(provider.defaultModel);
    }
  }, [providerId]);

  const [apiKey, setApiKey, clearApiKey] = useLocalStorage(
    getKeyForProvider(providerId),
    ""
  );
  const [activeAgentId, setActiveAgentId] = useState(agents[0].id);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const activeAgent = agents.find((a) => a.id === activeAgentId) ?? agents[0];
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    abortStream,
    clearMessages,
  } = useChat(apiKey, activeAgent.systemPrompt, endpoint, model);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasKey = !!apiKey;

  const handleProviderChange = (newProviderId: string) => {
    const p = API_PROVIDERS.find((pr) => pr.id === newProviderId);
    if (p) {
      setProviderId(newProviderId);
      setModel(localStorage.getItem("ai_model_" + newProviderId) || p.defaultModel);
    }
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <AgentSidebar
        agents={agents}
        activeId={activeAgentId}
        onSelect={setActiveAgentId}
        hasApiKey={hasKey}
        onApiKeyClick={() => setShowApiKeyModal(true)}
        providerId={providerId}
        providers={API_PROVIDERS}
        onProviderChange={handleProviderChange}
        model={model}
        onModelChange={handleModelChange}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto px-6 py-16 text-center">
              <div className="text-5xl mb-4">{activeAgent.icon}</div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {activeAgent.name}
              </h2>
              <p className="text-slate-500 mb-8">{activeAgent.description}</p>

              {!hasKey && (
                <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-700 mb-3">
                    请先配置 {provider.label} 的 API Key 以开始使用
                  </p>
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="px-6 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
                  >
                    配置 API Key
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-3">试试这些：</p>
                {activeAgent.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(ex)}
                    disabled={!hasKey || isLoading}
                    className="block w-full text-left px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                  <button
                    onClick={() => clearMessages()}
                    className="ml-3 underline"
                  >
                    重试
                  </button>
                </div>
              )}
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={
                    isLoading &&
                    msg.role === "assistant" &&
                    i === messages.length - 1
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          onStop={abortStream}
          disabled={!hasKey}
        />
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
        onClear={clearApiKey}
        providerLabel={provider.label}
      />
    </div>
  );
}
