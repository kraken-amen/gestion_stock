import NotificationBell from "../components/NotificationBell";

// Stats
import KPISection from "../components/dashboard/stats/KPISection";

// Charts
import StockByRegionChart from "../components/dashboard/charts/StockByRegionChart";
import DemandStatusChart from "../components/dashboard/charts/DemandStatusChart";
import StockEvolutionChart from "../components/dashboard/charts/StockEvolutionChart";
import TopProductsChart from "../components/dashboard/charts/TopProductsChart";

//  Alerts
import AlertsPanel from "../components/dashboard/alerts/AlertsPanel";

// Activity
import RecentRequests from "../components/dashboard/activity/RecentRequests";
import StockMovements from "../components/dashboard/activity/StockMovements";
import RecentOrders from "../components/dashboard/activity/RecentOrders";


const Dashboard = () => {


  return (
    <div className="w-full min-h-screen font-sans text-white">

      {/* ─── HEADER ───────────────────────────────────────── */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">

          <div>
            <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">
              Tableau de Bord
            </h1>
            <p className="text-white/60 text-xs hidden md:block">
              Bienvenue dans votre tableau de bord
            </p>
          </div>

          {/* Notifications */}
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>

        </div>
      </div>

      {/* ─── CONTENT ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* KPI */}
        <KPISection />

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch auto-rows-fr">
          <StockByRegionChart />
          <DemandStatusChart />
          <StockEvolutionChart />
          <TopProductsChart />
        </div>

        {/*PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr">
          <AlertsPanel />
          <RecentRequests />
          <StockMovements />
        </div>

        {/* ORDERS */}
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;