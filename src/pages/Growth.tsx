const courses = [
  {
    id: "ai-for-everyone",
    title: "AI For Everyone",
    instructor: "吴恩达 (Andrew Ng)",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/ai-for-everyone/lecture/SRwLN/week-1-introduction",
    description:
      "面向所有人的 AI 入门课。不写代码，讲清楚 AI 是什么、能做什么、不能做什么、如何在自己的工作中应用 AI。适合非技术背景的管理者和决策者。",
    duration: "约 8 小时（4 周）",
    level: "入门",
    tags: ["AI基础", "非技术", "管理视角"],
  },
]

const sections = [{ title: "吴恩达课程", courses }]

export default function Growth() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-[#3d3835] mb-3">🌱 个人成长</h1>
        <p className="text-[#8a827c] text-lg">
          值得反复学习的课程，持续积累，日日精进。
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-16">
          <h2 className="text-xl font-bold text-[#3d3835] mb-6 pb-3 border-b border-[#e8e3dc]">
            {section.title}
          </h2>
          <div className="grid gap-6">
            {section.courses.map((course) => (
              <a
                key={course.id}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="border border-[#e8e3dc] rounded-xl p-6 bg-white hover:shadow-md hover:border-[#c2785e]/30 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#3d3835] group-hover:text-[#c2785e] transition-colors">
                          {course.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5f0ea] text-[#8a827c]">
                          {course.level}
                        </span>
                      </div>
                      <p className="text-sm text-[#8a827c] mb-1">
                        {course.instructor} · {course.platform}
                      </p>
                      <p className="text-[#6b6560] text-sm leading-relaxed mt-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-xs text-[#8a827c]">⏱ {course.duration}</span>
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs bg-[#c2785e]/5 text-[#c2785e]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#c2785e]/10 flex items-center justify-center group-hover:bg-[#c2785e]/20 transition-colors">
                        <svg
                          className="w-5 h-5 text-[#c2785e]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-[#e8e3dc] pt-12 mt-8">
        <div className="border border-dashed border-[#e8e3dc] rounded-xl p-8 text-center">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="text-lg font-bold text-[#3d3835] mb-2">更多课程陆续添加</h3>
          <p className="text-[#8a827c] text-sm">
            每次遇到好的课程、好的讲座、好的学习资源，就放进这个页面。让它越长越厚。
          </p>
        </div>
      </div>
    </div>
  )
}
