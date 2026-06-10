import { useRef, useState, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import { parseFile } from "../../utils/parseFile";

interface Props {
  onSend: (content: string) => void;
  isLoading: boolean;
  onStop: () => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, isLoading, onStop, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, []);

  const getMessage = useCallback(() => {
    const text = textareaRef.current?.value ?? "";
    if (!fileContent) return text;
    // prepend file content with markers
    return `[上传文件：${fileName}]\n\n${fileContent}\n\n---\n${text}`;
  }, [fileContent, fileName]);

  const doSend = useCallback(() => {
    const msg = getMessage();
    if (msg.trim() && !isLoading) {
      onSend(msg);
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
      setFileContent(null);
      setFileName(null);
      setParseError(null);
    }
  }, [getMessage, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    setParsing(true);
    try {
      const result = await parseFile(file);
      setFileContent(result.text);
      setFileName(result.fileName);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "文件解析失败");
    } finally {
      setParsing(false);
      // reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setFileContent(null);
    setFileName(null);
    setParseError(null);
  };

  return (
    <div className="border-t border-slate-100 bg-white px-4 py-3">
      {/* attached file indicator */}
      {(fileName || parsing || parseError) && (
        <div className="max-w-3xl mx-auto mb-2">
          {parsing && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
              </svg>
              解析中...
            </div>
          )}
          {parseError && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {parseError}
              <button onClick={removeFile} className="ml-1 underline text-red-500">移除</button>
            </div>
          )}
          {fileName && !parsing && !parseError && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {fileName}
              <button onClick={removeFile} className="ml-1 text-green-500 hover:text-red-500" title="移除文件">&times;</button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-3xl mx-auto flex items-end gap-2">
        {/* file upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || parsing}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="上传文件（.pdf / .docx / .txt）"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "请先配置 API Key"
              : "输入你的需求...（Enter 发送，可上传 .pdf/.docx 文件）"
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="2" width="10" height="10" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            onClick={doSend}
            disabled={disabled || parsing}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            title="发送"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
