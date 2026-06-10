import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { agents, findAgentById } from "../data/agents";
import { API_PROVIDERS } from "../data/providers";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { useChat } from "../hooks/useChat";
import AgentSidebar from "../components/chat/AgentSidebar";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import FileDropZone from "../components/chat/FileDropZone";
import ApiKeyModal from "../components/ApiKeyModal";
import { loadDocs, saveDoc } from "../utils/docStore";
import type { StoredDoc } from "../utils/docStore";
import { searchWeb, getTavilyKey, setTavilyKey } from "../utils/search";
import { searchBidKnowledge, formatSearchResults } from "../data/bidKnowledge";

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
  const [storedDocs, setStoredDocs] = useState<StoredDoc[]>(() => loadDocs());
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [tavilyKey, setTavilyKeyState] = useState(() => getTavilyKey());
  const [searching, setSearching] = useState(false);

  const handleTavilyKeyChange = (key: string) => {
    setTavilyKeyState(key);
    setTavilyKey(key);
  };

  const activeAgent = findAgentById(activeAgentId) ?? agents[0];
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    abortStream,
    clearMessages,
  } = useChat(apiKey, activeAgent.systemPrompt, endpoint, model);

  // Wraps sendMessage to add bid knowledge RAG + web search when enabled
  const handleSend = useCallback(async (content: string) => {
    let enriched = content;

    // Bid knowledge RAG — search local knowledge base for bid-helper
    if (activeAgentId === "bid-helper") {
      const results = searchBidKnowledge(content);
      if (results.length > 0) {
        const ctx = formatSearchResults(results);
        enriched = `以下是从标书知识库中检索到的相关知识，请参考这些知识来回答用户问题：\n\n${ctx}\n\n---\n\n用户问题：${content}`;
      }
    }

    if (searchEnabled && tavilyKey) {
      setSearching(true);
      try {
        const results = await searchWeb(content);
        const final = `[联网搜索结果]\n\n${results}\n\n---\n请基于以上最新信息回答用户问题。\n\n${enriched}`;
        sendMessage(final);
      } catch (err) {
        sendMessage(`[联网搜索失败：${err instanceof Error ? err.message : "未知错误"}] 请用你的知识回答。\n\n${enriched}`);
      } finally {
        setSearching(false);
      }
    } else {
      sendMessage(enriched);
    }
  }, [searchEnabled, tavilyKey, sendMessage, activeAgentId]);

  const handleFileAnalyze = useCallback((content: string, fileName: string) => {
    // save to local store
    const doc = saveDoc(fileName, content);
    setStoredDocs((prev) => {
      const filtered = prev.filter((d) => d.fileName !== fileName);
      return [doc, ...filtered].slice(0, 10);
    });
    // send with auto-prompt
    const prompt = `[上传文件：${fileName}]\n\n${content}\n\n---\n请帮我分析这份招标文件，提取关键信息并输出结构化摘要`;
    sendMessage(prompt);
  }, [sendMessage]);

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
        searchEnabled={searchEnabled}
        onSearchToggle={() => setSearchEnabled((v) => !v)}
        tavilyKey={tavilyKey}
        onTavilyKeyChange={handleTavilyKeyChange}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto px-6 py-12 text-center">
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

              {/* File upload zone — only for bid agent */}
              {hasKey && activeAgentId === "bid-helper" && (
                <FileDropZone
                  onAnalyze={handleFileAnalyze}
                  disabled={isLoading}
                />
              )}

              {/* stored docs — only for bid agent */}
              {activeAgentId === "bid-helper" && storedDocs.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs text-slate-400 mb-3">
                    已解析文档（{storedDocs.length}份，存储于本地浏览器）
                  </p>
                  <div className="space-y-2">
                    {storedDocs.slice(0, 5).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 text-left text-xs"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 flex-shrink-0">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-slate-600 truncate flex-1">{doc.fileName}</span>
                        <span className="text-slate-400 flex-shrink-0">
                          {(doc.charCount / 1000).toFixed(0)}k字
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-3">或直接输入需求：</p>
                {activeAgent.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(ex)}
                    disabled={!hasKey || isLoading || searching}
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
          onSend={handleSend}
          isLoading={isLoading || searching}
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
