import { useRef, useCallback, type KeyboardEvent } from "react";

interface Props {
  onSend: (content: string) => void;
  isLoading: boolean;
  onStop: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  isLoading,
  onStop,
  disabled,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const content = textareaRef.current?.value ?? "";
      if (content.trim() && !isLoading) {
        onSend(content);
        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.style.height = "auto";
        }
      }
    }
  };

  const handleSendClick = () => {
    const content = textareaRef.current?.value ?? "";
    if (content.trim() && !isLoading) {
      onSend(content);
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="border-t border-slate-100 bg-white px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <textarea
          ref={textareaRef}
          rows={1}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? "请先配置 API Key" : "输入你的需求...（Enter 发送，Shift+Enter 换行）"
          }
          disabled={disabled}
          className="flex-1 resize-none border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
        />
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            title="停止生成"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
            >
              <rect x="2" y="2" width="10" height="10" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSendClick}
            disabled={disabled}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            title="发送"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
