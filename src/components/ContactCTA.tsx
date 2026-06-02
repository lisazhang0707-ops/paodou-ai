import { Link } from "react-router-dom"

interface Props {
  message?: string
}

export default function ContactCTA({ message = "想要定制化方案？" }: Props) {
  return (
    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-center">
      <p className="text-lg font-semibold text-gray-900 mb-2">{message}</p>
      <p className="text-gray-500 mb-4">扫码加 Lisa 微信，聊聊你的业务需求</p>
      <Link
        to="/collaborate"
        className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
      >
        了解更多合作方式
      </Link>
    </div>
  )
}
