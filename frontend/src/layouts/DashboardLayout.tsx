import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { BarChart3, ShoppingCart, Package, Settings, LogOut, Menu, X, Users, Warehouse, FileText, History, MapPin, AlertTriangle, CheckCircle2, Info, Clock, Dot } from 'lucide-react';
import { PermissionGate } from '../components/PermissionGate';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

type NotifType = 'alert' | 'success' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const ROLE_CONFIG: Record<string, {
  label: string;
  gradient: string;
  pillBg: string;
  pillText: string;
  dot: string;
}> = {
  administrateur: {
    label: 'Administrateur',
    gradient: 'from-red-500 to-rose-600',
    pillBg: 'bg-red-500/20 border border-red-500/25',
    pillText: 'text-red-300',
    dot: 'bg-emerald-400',
  },
  "gestionnaire de stock": {
    label: 'Gestionnaire',
    gradient: 'from-emerald-500 to-teal-600',
    pillBg: 'bg-emerald-500/20 border border-emerald-500/25',
    pillText: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  "responsable region": {
    label: 'Responsable',
    gradient: 'from-amber-500 to-orange-600',
    pillBg: 'bg-amber-500/20 border border-amber-500/25',
    pillText: 'text-amber-300',
    dot: 'bg-emerald-400',
  },
  utilisateur: {
    label: 'Utilisateur',
    gradient: 'from-blue-500 to-indigo-600',
    pillBg: 'bg-blue-500/20 border border-blue-500/25',
    pillText: 'text-blue-300',
    dot: 'bg-emerald-400',
  },
};

const getRoleConfig = (role?: string | null) =>
  ROLE_CONFIG[role?.toLowerCase() ?? ''] ?? ROLE_CONFIG['user'];

const getInitials = (name?: string | null) => {
  if (!name) return '?';
  return name.split(/[@.\s_-]/).filter(Boolean).slice(0, 2)
    .map(n => n[0].toUpperCase()).join('');
};

const NotifIcon = ({ type }: { type: NotifType }) => {
  const map = {
    alert: { icon: AlertTriangle, cls: 'text-red-400 bg-red-500/15' },
    warning: { icon: Clock, cls: 'text-amber-400 bg-amber-500/15' },
    success: { icon: CheckCircle2, cls: 'text-emerald-400 bg-emerald-500/15' },
    info: { icon: Info, cls: 'text-blue-400 bg-blue-500/15' },
  };
  const { icon: Icon, cls } = map[type];
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cls}`}>
      <Icon size={15} />
    </div>
  );
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'alert', title: 'Stock critique', message: 'Modem ADSL v2 — Gafsa sous le seuil minimum.', time: 'maintenant', read: false, link: '/map' },
  { id: '2', type: 'warning', title: 'Demande en attente', message: '3 demandes en attente depuis +48h.', time: 'il y a 2h', read: false, link: '/demandes' },
  { id: '3', type: 'success', title: 'Livraison confirmée', message: 'CMD-088 livrée — stock mis à jour (Sousse).', time: 'il y a 3h', read: false, link: '/commandes' },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentRole = JSON.parse(localStorage.getItem('user') || '{}').role;
  const currentRegion = JSON.parse(localStorage.getItem('user') || '{}').region;
  const roleConfig = getRoleConfig(currentRole);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const userId = user?.id || (storedUser ? JSON.parse(storedUser).id : null);

        if (userId && token) {
          const res = await api.get(`/auth/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(res.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, [user?.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayEmail = userData?.email || user?.email;
  const shortName = displayEmail?.includes('@') ? displayEmail.split('@')[0] : displayEmail;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const handleNotifClick = (notif: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.link) { navigate(notif.link); setNotifOpen(false); }
  };

  return (
    <div className="flex h-screen text-white overflow-hidden relative font-sans">

      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-600 via-blue-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[260px] flex flex-col
        bg-[#0f172a]/70 backdrop-blur-2xl border-r border-white/[0.06]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        <div className="flex items-center gap-3 px-5 h-[60px] flex-shrink-0 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/40">
            <BarChart3 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-black tracking-tight text-white leading-none uppercase">TT Inventory</h1>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.16em] mt-0.5">Tunisie Telecom</p>
          </div>
        </div>

        {/* User Profile Card in Sidebar */}
        <div className="px-4 py-3.5 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
            <div className="relative flex-shrink-0">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-[12px] font-black text-white shadow-md`}>
                {getInitials(shortName)}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f172a] ${roleConfig.dot}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white/90 truncate capitalize">{shortName}</p>
              <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${roleConfig.pillBg} ${roleConfig.pillText}`}>
                <Dot size={10} className="flex-shrink-0 -ml-0.5" />
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-none">
          <SectionLabel>Principal</SectionLabel>
          <PermissionGate role={currentRole} permission="VIEW_REGION">
            <NavItem icon={<BarChart3 size={15} />} label="Tableau de Bord" to={`/dash/${currentRegion}`} />
          </PermissionGate>
          <PermissionGate role={currentRole} permission="VIEW_DASHBOARD">
            <NavItem icon={<BarChart3 size={15} />} label="Tableau de Bord" to="/dashboard" />
          </PermissionGate>
          <NavItem icon={<Package size={15} />} label="Produits" to="/products" />
          <PermissionGate role={currentRole} permission="VIEW_REGION">
            <NavItem icon={<Warehouse size={15} />} label="Stocks" to={`/region/${currentRegion}`} />
          </PermissionGate>

          <PermissionGate role={currentRole} permission="VIEW_MAP">
            <NavItem icon={<Warehouse size={15} />} label="Stocks" to="/map" />
          </PermissionGate>
          {
            JSON.parse(localStorage.getItem('user') || '{}').role!=="utilisateur"&& (
              <SectionLabel>Opérations</SectionLabel>
            )
          }
          <PermissionGate role={currentRole} permission="VIEW_DEMANDE">
            <NavItem icon={<FileText size={15} />} label="Demandes" to="/demandes" />
          </PermissionGate>
          <PermissionGate role={currentRole} permission="VIEW_COMMANDE">
            <NavItem icon={<ShoppingCart size={15} />} label="Commandes" to="/commandes" />
          </PermissionGate>
          <SectionLabel>Admin</SectionLabel>
          <PermissionGate role={currentRole} permission="MANAGE_USERS">
            <NavItem icon={<Users size={15} />} label="Utilisateurs" to="/users" />
          </PermissionGate>
          <PermissionGate role={currentRole} permission="VIEW_DASHBOARD">
            <NavItem icon={<History size={15} />} label="Historique" to="/historique" />
          </PermissionGate>
          <NavItem icon={<Settings size={15} />} label="Paramètres" to="/parametres" />
        </nav>

        {currentRegion && (
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.07]">
              <MapPin size={11} className="text-white/25 flex-shrink-0" />
              <span className="text-[9px] text-white/25 font-bold uppercase tracking-widest">Région</span>
              <span className="ml-auto text-[11px] font-semibold text-white/55 capitalize">{currentRegion}</span>
            </div>
          </div>
        )}

        <div className="px-3 pb-4 pt-2 border-t border-white/[0.06] flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[13px] font-semibold text-red-400">Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-[260px] relative">
        {/* Floating Bell & Avatar Icon (Top Right) */}
        <div className="absolute top-4 right-6 z-30 flex items-center gap-3" ref={notifRef}>
          <div className="relative">

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[340px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/[0.10] rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                  <span className="text-[13px] font-bold text-white">Notifications</span>
                  <button onClick={markAllRead} className="text-[10px] text-blue-400 font-semibold">Tout marquer lu</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-white/[0.05]">
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => handleNotifClick(n)} className="w-full p-4 flex gap-3 hover:bg-white/[0.05] transition-colors text-left">
                      <NotifIcon type={n.type} />
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-white/90">{n.title}</p>
                        <p className="text-[11px] text-white/40 line-clamp-1">{n.message}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Rendered Here */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/20 px-3 pt-4 pb-1.5">{children}</p>
);

const NavItem = ({ icon, label, to, badge, badgeVariant = 'blue' }: any) => {
  const colors = { red: 'bg-red-500', amber: 'bg-amber-500', blue: 'bg-blue-500' };
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-[13px] font-semibold flex-1 truncate">{label}</span>
      {badge && <span className={`text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center ${colors[badgeVariant as keyof typeof colors]}`}>{badge}</span>}
    </NavLink>
  );
};

export default DashboardLayout;