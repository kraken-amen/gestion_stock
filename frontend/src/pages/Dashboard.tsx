import MangeUser from "../components/MangeUser";
import { PermissionGate } from "../components/PermissionGate";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Bell, ArrowLeft } from "lucide-react";

// ✅ Stats
import KPISection from "../components/dashboard/stats/KPISection";

// ✅ Charts
import StockByRegionChart from "../components/dashboard/charts/StockByRegionChart";
import DemandStatusChart from "../components/dashboard/charts/DemandStatusChart";
import StockEvolutionChart from "../components/dashboard/charts/StockEvolutionChart";
import TopProductsChart from "../components/dashboard/charts/TopProductsChart";

// ✅ Alerts
import AlertsPanel from "../components/dashboard/alerts/AlertsPanel";

// ✅ Activity
import RecentRequests from "../components/dashboard/activity/RecentRequests";
import StockMovements from "../components/dashboard/activity/StockMovements";
import RecentOrders from "../components/dashboard/activity/RecentOrders";


const Dashboard = () => {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);


  return (
    <div className="w-full min-h-full font-sans space-y-6 p-4">
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div>
              <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Tableau de Bord</h1>
              <p className="text-white/60 text-xs hidden md:block">Bienvenue dans votre tableau de bord</p>
            </div>
          </div>
          {/* Notifications Button */}
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <Bell size={20} />

            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B0E14] animate-pulse" />
          </button>
        </div>
      </div>
      {/* 🔢 KPI Section */}
      <KPISection />

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StockByRegionChart />
        <DemandStatusChart />
        <StockEvolutionChart />
        <TopProductsChart />
      </div>

      {/* 🚨 Alerts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AlertsPanel />
        <RecentRequests />
        <StockMovements />
      </div>

      {/* 🚚 Orders */}
      <RecentOrders />

      {/* 👥 Admin Section */}
      <PermissionGate role={user?.role} permission="MANAGE_USERS">
        <div className="mt-4">
          {/* Separator */}
          <div className="flex items-center gap-3 px-5 mb-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/20">
              Administration
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <MangeUser />
        </div>
      </PermissionGate>

    </div>
  );
};

export default Dashboard;