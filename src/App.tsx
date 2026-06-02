import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Blog, { BlogPost } from "./pages/Blog"
import Tools from "./pages/Tools"
import RoiCalculator from "./pages/RoiCalculator"
import CustomerSegmentation from "./pages/CustomerSegmentation"
import About from "./pages/About"
import Collaborate from "./pages/Collaborate"

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/roi-calculator" element={<RoiCalculator />} />
          <Route path="/tools/customer-segmentation" element={<CustomerSegmentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/collaborate" element={<Collaborate />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
