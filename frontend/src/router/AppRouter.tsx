import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/admin/Dashboard"
import Users from "../pages/admin/Listusers"
import Otp from "../pages/Otp"
import { OtpProtectedRoute } from "../components/ProtectedRoute"
import { ToastProvider } from "../context/ToastContext"
const AppRouter = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/otp" element={<OtpProtectedRoute><Otp /></OtpProtectedRoute>} />
        </Routes>
      </ToastProvider >

    </BrowserRouter >
  )
}

export default AppRouter