import { memo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "base" });

interface Props {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mermaid-${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    if (!ref.current) return;
    mermaid
      .render(id.current, chart)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => {
        if (ref.current) ref.current.innerHTML = `<p class="text-red-500 text-xs">图表语法错误，请检查 Mermaid 代码</p>`;
      });
  }, [chart]);

  return (
    <div className="my-4 p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
      <div ref={ref} className="flex justify-center" />
      <details className="mt-2">
        <summary className="text-xs text-slate-400 cursor-pointer">查看源码</summary>
        <pre className="mt-1 text-xs text-slate-500 whitespace-pre-wrap">{chart}</pre>
      </details>
    </div>
  );
}

// Detect [IMAGE: query] markers and render as image search placeholder
function ImagePlaceholder({ query }: { query: string }) {
  const encoded = encodeURIComponent(query);
  // Use Unsplash as a fallback for image search
  const unsplashUrl = `https://source.unsplash.com/800x400/?${encoded}`;

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-200">
      <img
        src={unsplashUrl}
        alt={query}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <p className="text-xs text-slate-400 text-center py-1 bg-slate-50">
        配图：{query}
      </p>
    </div>
  );
}

const markdownComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg font-bold text-slate-900 mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-slate-800 mt-3 mb-1">{children}</h3>
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
    const lang = /language-(\w+)/.exec(className ?? "")?.[1];

    if (lang === "mermaid") {
      return <MermaidBlock chart={content} />;
    }

    return inline ? (
      <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm">{content}</code>
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
  // Custom handling for [IMAGE: xxx] in paragraphs
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (src?.startsWith("image:")) {
      return <ImagePlaceholder query={alt || src.replace("image:", "")} />;
    }
    return <img src={src} alt={alt} className="my-3 rounded-xl max-w-full" loading="lazy" />;
  },
};

// Pre-process content: convert [IMAGE: xxx] to ![](image:xxx) before markdown parsing
function preprocessContent(content: string): string {
  // Replace [IMAGE: description] with markdown image syntax
  return content.replace(/\[IMAGE:\s*(.+?)\]/g, (_: string, query: string) => {
    return `![${query.trim()}](image:${encodeURIComponent(query.trim())})`;
  });
}

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

  const processed = preprocessContent(content);

  return (
    <div className="flex mb-4 group">
      <div className="max-w-[85%] bg-slate-50 rounded-2xl rounded-bl-md px-4 py-3 relative">
        {content ? (
          <div className="prose-sm">
            <ReactMarkdown components={markdownComponents}>
              {processed}
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
