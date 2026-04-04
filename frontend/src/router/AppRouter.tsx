import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Users from "../pages/Listusers"
import Otp from "../pages/Otp"
import { OtpProtectedRoute } from "../components/ProtectedRoute"
import { ToastProvider } from "../context/ToastContext"
import DashboardLayout from "../layouts/DashboardLayout"
import TunisiaMap from "../pages/TunisiaMap"
import RegionPage from "../pages/Region"
import Demandes from "../pages/Demandes"
const AppRouter = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public / Unauthenticated Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/otp" element={<OtpProtectedRoute><Otp /></OtpProtectedRoute>} />

          {/* Dashboard Routes with Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demandes" element={<Demandes />} />
            <Route path="/users" element={<Users />} />
            <Route path="/map" element={<TunisiaMap />} />
            <Route path="/region/:name" element={<RegionPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default AppRouter