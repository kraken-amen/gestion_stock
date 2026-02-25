import { Users as UsersIcon, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/userService';
import { useEffect, useState } from 'react';
import type { User } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  // 1. Fetch data au chargement (Charger les données)
  useEffect(() => {
    getUsers().then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- LOGIQUE DE CALCUL

  // Total Users:
  const totalUsers = users.length;

  // Total Responsables:
  const totalResponsables = users.filter(u => u.role === 'responsable_region').length;

  // Total Active Accounts:
  const totalActive = users.filter(u => u.isActive).length;

  // Données statistiques (Exemple)
  const stats = [
    { title: "Total Users", value: totalUsers, icon: <UsersIcon />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Responsables", value: totalResponsables, icon: <ShieldCheck />, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Active Accounts", value: totalActive, icon: <UserCheck />, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Vue d'ensemble</h1>
          <p className="text-slate-400">Statistiques globales de la plateforme</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                {s.icon}
              </div>
              <h3 className="text-slate-400 text-sm font-medium">{s.title}</h3>
              <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Manage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/users')}
            className="flex items-center justify-between p-8 bg-blue-600 hover:bg-blue-500 rounded-3xl transition-all group"
          >
            <div>
              <h2 className="text-xl font-bold text-white text-left">Manage Users</h2>
              <p className="text-blue-100/70 text-sm">Gérer les comptes et accès</p>
            </div>
            <ArrowRight className="text-white group-hover:translate-x-2 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/roles')}
            className="flex items-center justify-between p-8 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-3xl transition-all group"
          >
            <div>
              <h2 className="text-xl font-bold text-white text-left">Manage Roles</h2>
              <p className="text-slate-400 text-sm">Permissions et sécurité</p>
            </div>
            <ArrowRight className="text-slate-400 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;