import { Link, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { useEffect, useState } from "react"

function Blog() {
  const posts = [
    {
      slug: "ai-sales-getting-started",
      title: "销售团队如何从零开始用 AI — 我的实操框架",
      date: "2026-05-20",
      summary: "不是「AI 赋能」这种空话。这篇文章讲的是：一个销售团队具体怎么做、用什么工具、三个月能看到什么变化。",
      tags: ["案例复盘", "AI 入门"],
    },
    {
      slug: "customer-churn-prediction",
      title: "用 AI 预测客户流失，我们提前两个月发现 37 个高风险客户",
      date: "2026-05-10",
      summary: "一个真实案例：如何用公开数据 + 简单的机器学习模型，在客户流失前两个月发出预警。不需要数据科学家。",
      tags: ["案例复盘", "数据分析"],
    },
    {
      slug: "roi-measurement-framework",
      title: "营销 ROI 到底怎么算？一个 Excel 搞不定的问题",
      date: "2026-04-28",
      summary: "多触点归因、长期价值、品牌溢价——传统的 ROI 公式在这些面前失效了。聊聊新的衡量框架。",
      tags: ["工具教程", "营销"],
    },
    {
      slug: "prompt-engineering-sales",
      title: "写给销售的 Prompt Engineering 入门",
      date: "2026-04-15",
      summary: "不需要学编程。几个简单的 Prompt 模板，帮你用 ChatGPT/Claude 做客户调研、写销售邮件、分析竞品。",
      tags: ["AI 学习笔记", "AI 入门"],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-3">文章</h1>
        <p className="text-slate-400">销售 × AI 的实操案例、工具教程与学习笔记</p>
      </div>

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
    </div>
  )
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState("")

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/blog/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.text()
      })
      .then(setContent)
      .catch(() => setContent("文章加载失败"))
  }, [slug])

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-slate-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <article className="prose prose-slate max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
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
  )
}

export { Blog as default, BlogPost }
