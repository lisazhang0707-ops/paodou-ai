import { memo } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const markdownComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg font-bold text-slate-900 mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-slate-800 mt-3 mb-1">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-slate-600 leading-relaxed mb-2">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 space-y-1 mb-2">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-slate-600">{children}</li>
  ),
  code: ({
    className,
    children,
    ...rest
  }: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    const inline = (rest as { inline?: boolean }).inline ?? /inline/.test(className ?? "");
    const content = String(children ?? "").replace(/\n$/, "");
    return inline ? (
      <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm">
        {content}
      </code>
    ) : (
      <pre className="bg-slate-100 p-3 rounded-xl overflow-x-auto text-sm">
        <code>{content}</code>
      </pre>
    );
  },
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-slate-500">{children}</em>
  ),
};

function ChatMessage({ role, content, isStreaming }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content).catch(() => {});
  };

  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4 group">
      <div className="max-w-[85%] bg-slate-50 rounded-2xl rounded-bl-md px-4 py-3 relative">
        {content ? (
          <div className="prose-sm">
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        ) : isStreaming ? (
          <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse rounded-sm" />
        ) : null}
        {isStreaming && content && (
          <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse rounded-sm ml-0.5 align-middle" />
        )}
        {content && !isStreaming && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-0.5"
          >
            复制
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(ChatMessage);
