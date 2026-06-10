import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { parseFile } from "../../utils/parseFile";

interface Props {
  onAnalyze: (content: string, fileName: string) => void;
  disabled?: boolean;
}

export default function FileDropZone({ onAnalyze, disabled }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readyFile, setReadyFile] = useState<{ name: string; content: string } | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setParsing(true);
    setReadyFile(null);
    try {
      const result = await parseFile(file);
      setReadyFile({ name: result.fileName, content: result.text });
    } catch (err) {
      setError(err instanceof Error ? err.message : "文件解析失败");
    } finally {
      setParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!readyFile) return;
    onAnalyze(readyFile.content, readyFile.name);
    setReadyFile(null);
  };

  const handleReset = () => {
    setReadyFile(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleBrowse}
        className="hidden"
      />

      {/* parsing state */}
      {parsing && (
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-8 text-center">
          <div className="animate-spin mx-auto mb-3 w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          <p className="text-blue-700 font-medium">正在解析文件...</p>
          <p className="text-blue-500 text-sm mt-1">大型PDF可能需要几秒钟</p>
        </div>
      )}

      {/* error state */}
      {error && !parsing && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button
            onClick={handleReset}
            className="text-sm text-red-500 underline hover:text-red-700"
          >
            重新上传
          </button>
        </div>
      )}

      {/* ready to analyze */}
      {readyFile && !parsing && !error && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-green-800 font-medium text-sm truncate">{readyFile.name}</p>
              <p className="text-green-600 text-xs">
                {(readyFile.content.length / 1000).toFixed(1)}k 字符已提取
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-green-500 hover:text-red-500 transition-colors flex-shrink-0"
              title="移除"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className="text-green-700 text-xs mb-4 line-clamp-3 opacity-75">
            {readyFile.content.slice(0, 300)}...
          </p>
          <button
            onClick={handleAnalyze}
            disabled={disabled}
            className="w-full py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            开始分析招标文件
          </button>
        </div>
      )}

      {/* drop zone (shown when no file selected) */}
      {!readyFile && !parsing && !error && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-blue-400 bg-blue-50 scale-[1.02]"
              : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <svg
            width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className={`mx-auto mb-3 ${dragOver ? "text-blue-500" : "text-slate-400"}`}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-slate-700 font-medium mb-1">
            {dragOver ? "松开鼠标上传文件" : "上传甲方招标文件"}
          </p>
          <p className="text-slate-400 text-sm">
            拖拽文件到此处，或点击选择文件
          </p>
          <p className="text-slate-300 text-xs mt-2">
            支持 .pdf / .docx / .txt
          </p>
        </div>
      )}
    </div>
  );
}
