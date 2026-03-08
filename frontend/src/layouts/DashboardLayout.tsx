import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { BarChart3, ShoppingCart, Package, Settings, LogOut, Menu, X, Users } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="flex h-screen text-white overflow-hidden relative font-sans">
      {/* Universal Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-600 via-blue-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-600 via-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-gradient-to-bl from-indigo-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-15" style={{ animationDelay: '1s' }}></div>
      </div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-5 left-5 z-50 md:hidden p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#0f172a]/50 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col transition-all duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo Section */}
        <div className="mb-12 px-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <BarChart3 size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">TT Inventory</h1>
          </div>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest ml-1">Tunisie Telecom</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1">
          <NavItem icon={<BarChart3 size={20} />} label="Tableau de Bord" to="/dashboard" />
          <NavItem icon={<ShoppingCart size={20} />} label="Commandes" to="/commandes" />
          <NavItem icon={<Package size={20} />} label="Stocks" to="/stocks" />
          <NavItem icon={<Users size={20} />} label="Utilisateurs" to="/users" />
          <NavItem icon={<Settings size={20} />} label="Paramètres" to="/settings" />
        </nav>

        {/* Bottom Section - Logout */}
        <div className="pt-6 mt-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto md:ml-72 relative">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Component NavItem
const NavItem = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200
      ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
        : 'text-white/50 hover:text-white hover:bg-white/5'
      }
    `}
  >
    {icon}
    <span className="text-[15px]">{label}</span>
  </NavLink>
);

export default DashboardLayout;