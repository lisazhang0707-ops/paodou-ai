import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Blog, { BlogPost } from "./pages/Blog"
import Tools from "./pages/Tools"
import RoiCalculator from "./pages/RoiCalculator"
import CustomerSegmentation from "./pages/CustomerSegmentation"
import DiffusionModel from "./pages/DiffusionModel"
import BanditModel from "./pages/BanditModel"
import ThresholdModel from "./pages/ThresholdModel"
import About from "./pages/About"
import Collaborate from "./pages/Collaborate"
import Agents from "./pages/Agents"
import Dashboard from "./pages/Dashboard"
import FinanceDashboard from "./pages/FinanceDashboard"
import CustomerDashboard from "./pages/CustomerDashboard"
import Growth from "./pages/Growth"

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
          <Route path="/tools/diffusion-model" element={<DiffusionModel />} />
          <Route path="/tools/bandit-model" element={<BanditModel />} />
          <Route path="/tools/threshold-model" element={<ThresholdModel />} />
          <Route path="/about" element={<About />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/collaborate" element={<Collaborate />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/finance" element={<FinanceDashboard />} />
          <Route path="/dashboard/customers" element={<CustomerDashboard />} />
          <Route path="/growth" element={<Growth />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
