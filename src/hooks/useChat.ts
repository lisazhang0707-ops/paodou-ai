import { useState, useRef, useCallback, useEffect } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  abortStream: () => void;
  clearMessages: () => void;
}

export function useChat(apiKey: string, systemPrompt: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const systemRef = useRef(systemPrompt);
  systemRef.current = systemPrompt;

  // Clear messages when systemPrompt changes (agent switch)
  useEffect(() => {
    abortStream();
    setMessages([]);
    setError(null);
  }, [systemPrompt]);

  const clearMessages = useCallback(() => {
    abortStream();
    setMessages([]);
    setError(null);
  }, []);

  const abortStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      if (isLoading) return;
      if (!apiKey) {
        setError("请先配置 API Key");
        return;
      }

      setError(null);
      setIsLoading(true);

      const newMessages: Message[] = [
        ...messages,
        { role: "user" as const, content: trimmed },
        { role: "assistant" as const, content: "" },
      ];
      setMessages(newMessages);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiMessages = [
          { role: "system", content: systemRef.current },
          ...newMessages
            .filter((m) => m.content !== "")
            .map((m) => ({ role: m.role, content: m.content })),
          // Remove the empty assistant placeholder for the API call
        ];
        // The last message is the empty assistant placeholder — remove it from the API call
        if (
          apiMessages.length > 0 &&
          apiMessages[apiMessages.length - 1].role === "assistant" &&
          apiMessages[apiMessages.length - 1].content === ""
        ) {
          apiMessages.pop();
        }

        const response = await fetch(
          "https://api.deepseek.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + apiKey,
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: apiMessages,
              stream: true,
            }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const errMsg =
            (errBody as { error?: { message?: string } })?.error?.message ?? "";
          if (response.status === 401) {
            throw new Error("API Key 无效，请检查后重试");
          } else if (response.status === 402 || response.status === 429) {
            throw new Error("API 额度不足或请求过于频繁，请稍后重试");
          }
          throw new Error("API 错误 (" + response.status + "): " + errMsg);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const delta =
                json.choices?.[0]?.delta?.content;
              if (delta) {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  copy[copy.length - 1] = {
                    ...last,
                    content: last.content + delta,
                  };
                  return copy;
                });
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // User aborted — keep current messages as-is
        } else {
          const message =
            err instanceof Error ? err.message : "网络请求失败，请检查网络连接";
          setError(message);
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [apiKey, isLoading, messages]
  );

  return { messages, isLoading, error, sendMessage, abortStream, clearMessages };
}
