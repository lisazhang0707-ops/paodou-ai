import { Link } from "react-router-dom"

interface Props {
  message?: string
}

export default function ContactCTA({ message = "想要定制化方案？" }: Props) {
  return (
    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 text-white text-center relative overflow-hidden">
      <div className="absolute right-0 top-0 w-48 h-48 opacity-10">
        <svg viewBox="0 0 200 200" fill="white">
          <circle cx="150" cy="50" r="80" />
          <circle cx="180" cy="120" r="60" />
          <rect x="160" y="20" width="80" height="80" rx="10" />
        </svg>
      </div>
      <div className="relative">
        <p className="text-lg font-semibold mb-2">{message}</p>
        <p className="text-slate-300 mb-4">扫码加 Lisa 微信，聊聊你的业务需求</p>
        <Link
          to="/collaborate"
          className="inline-block px-6 py-2.5 bg-white text-slate-800 rounded-full font-medium hover:bg-slate-100 transition-colors"
        >
          了解更多合作方式
        </Link>
      </div>
    </div>
  )
}
