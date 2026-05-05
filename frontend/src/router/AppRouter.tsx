import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Users from "../pages/Listusers"
import Otp from "../pages/Otp"
import { OtpProtectedRoute } from "../components/ProtectedRoute"
import { ToastProvider } from "../context/ToastContext"
import DashboardLayout from "../layouts/DashboardLayout"
import TunisiaMap from "../pages/TunisiaMap"
import Demandes from "../pages/Demandes"
import Products from "../pages/Product"
import Parametres from "../pages/Settings"
import Commande from "../pages/Commande"
import Stock from "../pages/Stock"
import RegionDashboardPage from "../pages/RegionDashboardPage"
import History from "../pages/History"
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
            <Route path="/products" element={<Products />} />
            <Route path="/commandes" element={<Commande />} />
            <Route path="/stocks" element={<Stock />} />
            <Route path="/map" element={<TunisiaMap />} />
            <Route path="/region/:name" element={<Stock />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/dash/:name" element={<RegionDashboardPage/>}/>
            <Route path="/historique" element={<History />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default AppRouter