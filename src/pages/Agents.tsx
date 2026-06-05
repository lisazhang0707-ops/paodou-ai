import { useState, useRef, useEffect } from "react";
import { agents } from "../data/agents";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useChat } from "../hooks/useChat";
import AgentSidebar from "../components/chat/AgentSidebar";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import ApiKeyModal from "../components/ApiKeyModal";

export default function Agents() {
  const [apiKey, setApiKey, clearApiKey] = useLocalStorage(
    "deepseek_api_key",
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
  } = useChat(apiKey, activeAgent.systemPrompt);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <AgentSidebar
        agents={agents}
        activeId={activeAgentId}
        onSelect={setActiveAgentId}
        hasApiKey={!!apiKey}
        onApiKeyClick={() => setShowApiKeyModal(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome screen */
            <div className="max-w-2xl mx-auto px-6 py-16 text-center">
              <div className="text-5xl mb-4">{activeAgent.icon}</div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {activeAgent.name}
              </h2>
              <p className="text-slate-500 mb-8">{activeAgent.description}</p>

              {!apiKey && (
                <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-700 mb-3">
                    请先配置 DeepSeek API Key 以开始使用
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
                    disabled={!apiKey || isLoading}
                    className="block w-full text-left px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message list */
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

        {/* Input area */}
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          onStop={abortStream}
          disabled={!apiKey}
        />
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
        onClear={clearApiKey}
      />
    </div>
  );
}
