import { useState, useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
  providerLabel?: string;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSave,
  onClear,
  providerLabel,
}: Props) {
  const [input, setInput] = useState("");
  const [validation, setValidation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInput("");
      setValidation("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    const v = input.trim();
    if (!v) {
      setValidation("请输入 API Key");
      return;
    }
    if (!v.startsWith("sk-")) {
      setValidation("API Key 应以 sk- 开头");
      return;
    }
    if (v.length < 20) {
      setValidation("API Key 长度不足，请检查");
      return;
    }
    onSave(v);
    onClose();
  };

  const handleClear = () => {
    onClear();
    setInput("");
    setValidation("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          配置 {providerLabel ?? ""} API Key
        </h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Key 仅保存在浏览器本地存储（localStorage），不会上传到任何服务器。
          各服务商的 Key 独立存储，切换服务商不会丢失。
        </p>

        {apiKey && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700">
              已配置：sk-...{apiKey.slice(-4)}
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setValidation("");
          }}
          placeholder={apiKey ? "输入新 Key 替换" : "sk-..."}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
        />

        {validation && (
          <p className="text-red-500 text-xs mt-1">{validation}</p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            保存
          </button>
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              清除
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-slate-400 hover:text-slate-600 transition-colors text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
