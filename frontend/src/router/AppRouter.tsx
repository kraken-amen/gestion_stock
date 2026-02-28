import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Users from "../pages/Listusers"
import DashboardLayout from "../layouts/DashboardLayout"
import Otp from "../pages/Otp"
import { OtpProtectedRoute } from "../components/ProtectedRoute"
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
        
        <Route path="/otp" element={<OtpProtectedRoute><Otp /></OtpProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter