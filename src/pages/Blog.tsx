import { Link, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useEffect, useState, useMemo, useRef } from "react"

function Blog() {
  const posts: Array<{
    slug: string; title: string; date: string; summary: string; tags: string[];
  }> = [
    {
      slug: "wechat-mcp-guide",
      title: "微信公众号 MCP 使用手册",
      date: "2026-06-14",
      summary: "用自然语言直接操作微信公众号——从连接配置到草稿发布、菜单管理、素材上传、用户管理、数据统计的全流程指南",
      tags: ["微信公众号", "MCP", "AI工具"],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-3">文章</h1>
        <p className="text-slate-400">销售 × AI 的实操案例、工具教程与学习笔记</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-slate-400 text-lg">文章即将上线</p>
          <p className="text-slate-300 text-sm mt-2">正在整理实操案例和工具教程，敬请期待</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group pb-8 border-b border-slate-100 last:border-0">
              <div className="flex gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 mb-3 leading-relaxed">{post.summary}</p>
                <time className="text-sm text-slate-300">{post.date}</time>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿\s-]/g, "")
    .replace(/\s+/g, "-")
}

function extractToc(markdown: string) {
  const headingRe = /^(#{1,3})\s+(.+)$/gm
  const items: { level: number; text: string; slug: string }[] = []
  const slugCount: Record<string, number> = {}
  let match: RegExpExecArray | null
  while ((match = headingRe.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2]
    let slug = slugify(text)
    if (slugCount[slug] !== undefined) {
      slugCount[slug]++
      slug = `${slug}-${slugCount[slug]}`
    } else {
      slugCount[slug] = 0
    }
    items.push({ level, text, slug })
  }
  return items
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState("")
  const [activeId, setActiveId] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/blog/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.text()
      })
      .then(setContent)
      .catch(() => setContent("文章加载失败"))
    window.scrollTo(0, 0)
  }, [slug])

  const toc = useMemo(() => extractToc(content), [content])

  const slugMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of toc) {
      if (!map.has(item.text)) {
        map.set(item.text, item.slug)
      }
    }
    return map
  }, [toc])

  function headingId(text: string) {
    return slugMap.get(text) ?? slugify(text)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    )

    const headings = contentRef.current?.querySelectorAll("h1[id], h2[id], h3[id]")
    headings?.forEach((h) => observer.observe(h))

    return () => observer.disconnect()
  }, [content, toc])

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-slate-400">加载中...</p>
      </div>
    )
  }

  if (content === "文章加载失败") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-slate-400 text-lg">文章不存在或已被删除</p>
        <Link to="/blog" className="text-blue-600 hover:underline mt-4 inline-block">返回文章列表</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/blog" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回文章列表
      </Link>

      <div className="flex gap-12">
        {/* Main content */}
        <div className="flex-1 min-w-0" ref={contentRef}>
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children, ...props }) => <h1 id={headingId(String(children))} {...props}>{children}</h1>,
                h2: ({ children, ...props }) => <h2 id={headingId(String(children))} {...props}>{children}</h2>,
                h3: ({ children, ...props }) => <h3 id={headingId(String(children))} {...props}>{children}</h3>,
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table>{children}</table>
                  </div>
                ),
                pre: ({ children }) => (
                  <pre className="relative group">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => {
                  const text = String(children)
                  let variant = "border-blue-500 bg-blue-50/50"
                  if (text.includes("⚠️")) variant = "border-amber-500 bg-amber-50/50"
                  else if (text.includes("💡") || text.includes("📌")) variant = "border-blue-500 bg-blue-50/50"
                  else if (text.includes("✅")) variant = "border-green-500 bg-green-50/50"
                  return (
                    <blockquote className={`border-l-4 ${variant} rounded-r-xl p-4 my-5`}>
                      {children}
                    </blockquote>
                  )
                },
                a: ({ href, children }) => (
                  <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>

          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 text-white text-center relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 opacity-10">
              <svg viewBox="0 0 200 200" fill="white">
                <circle cx="150" cy="50" r="80" />
                <circle cx="180" cy="120" r="60" />
              </svg>
            </div>
            <div className="relative">
              <p className="text-lg font-semibold mb-2">觉得有用？</p>
              <p className="text-slate-300 mb-4">扫码加 Lisa 微信，获取更多销售 × AI 的实操内容</p>
              <Link to="/collaborate" className="inline-block px-6 py-2.5 bg-white text-slate-800 rounded-full font-medium hover:bg-slate-100 transition-colors">
                了解更多合作方式
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar TOC */}
        {toc.length > 0 && (
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">目录</h4>
              <nav className="space-y-0.5">
                {toc.map((item) => (
                  <a
                    key={item.slug}
                    href={`#${item.slug}`}
                    className={`toc-link block text-sm py-1.5 transition-colors ${
                      item.level === 1 ? "pl-0 font-medium" : item.level === 2 ? "pl-3" : "pl-6"
                    } ${
                      activeId === item.slug ? "text-green-600 font-medium" : "text-slate-500 hover:text-slate-700"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(item.slug)
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" })
                        setActiveId(item.slug)
                      }
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export { Blog as default, BlogPost }
