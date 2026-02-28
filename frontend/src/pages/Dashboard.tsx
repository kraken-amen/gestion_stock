import { Users as UsersIcon, ShieldCheck, UserCheck, UserX, ArrowRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/userService';
import { useEffect, useState } from 'react';
import type { User } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  // 1. Fetch data au chargement (Charger les données)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    getUsers().then(res => setUsers(res.data)).catch(err => console.error(err));
    console.log(users);
  }, [navigate]);

  // --- LOGIQUE DE CALCUL

  // Total Users:
  const totalUsers = users.length;

  // Total Responsables:
  const totalResponsables = users.filter(u => u.role === 'responsable_region').length;

  // Total Active Accounts:
  const totalActive = users.filter(u => u.isActive).length;

  // Total Disabled Users:
  const totalDisabled = users.filter(u => !u.isActive).length;

  // Taux de croissance (exemple)
  const growthRate = totalUsers > 0 ? ((totalActive / totalUsers) * 100).toFixed(1) : 0;

  // Données statistiques
  const stats = [
    { title: "Total Users", value: totalUsers, icon: <UsersIcon size={24} />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-400/30" },
    { title: "Total Responsables", value: totalResponsables, icon: <ShieldCheck size={24} />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/30" },
    { title: "Active Accounts", value: totalActive, icon: <UserCheck size={24} />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-400/30" },
    { title: "Disabled Users", value: totalDisabled, icon: <UserX size={24} />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/30" }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen overflow-hidden relative font-sans">
      {/* Background avec les couleurs Tunisie Telecom - Bleu sombre et Violet */}
      <div className="absolute inset-0">
        {/* Gradient principal: bleu sombre -> violet */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 opacity-100"></div>

        {/* Blob animé bleu */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-600 via-blue-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Blob animé violet */}
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-600 via-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Blob animé bleu-violet au centre */}
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-gradient-to-bl from-indigo-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-15" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">Tunisie Telecom</h1>
              <p className="text-white/70 text-sm font-medium">Tableau de bord administrateur</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-400/50 text-red-300 font-bold transition-all hover:text-red-200"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Section En-tête */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Statistiques utilisateurs</h2>
            <p className="text-white/70 font-medium">Statistiques globales des utilisateurs</p>
          </div>

          {/* Grille de Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`backdrop-blur-xl bg-white/10 border ${s.border} rounded-2xl p-6 hover:border-white/50 transition-all duration-300 hover:bg-white/15`}
              >
                <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                  {s.icon}
                </div>
                <h3 className="text-white/70 text-sm font-semibold mb-2">{s.title}</h3>
                <p className="text-4xl font-black text-white drop-shadow-lg">{s.value}</p>
                {s.title === "Active Accounts" && (
                  <p className="text-emerald-300 text-sm font-medium mt-2">{growthRate}% actifs</p>
                )}
              </div>
            ))}
          </div>

          {/* Section Gestion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bouton Manage Regions */}
            <button
              onClick={() => navigate('/regions')}
              className="group backdrop-blur-xl bg-gradient-to-br from-blue-600/40 to-indigo-600/40 border border-blue-400/30 hover:border-blue-300/60 rounded-2xl p-8 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-600/60 hover:to-indigo-600/60"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-2xl font-black text-white drop-shadow-lg mb-2">Gérer les régions</h2>
                  <p className="text-white/70 text-sm font-medium">Gérer les régions</p>
                </div>
                <ArrowRight className="text-white/70 group-hover:text-white group-hover:translate-x-2 transition-all" size={28} />
              </div>
            </button>

            {/* Bouton Manage Users */}
            <button
              onClick={() => navigate('/users')}
              className="group backdrop-blur-xl bg-white/5 border border-white/20 hover:border-white/40 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-2xl font-black text-white drop-shadow-lg mb-2">Gérer les utilisateurs</h2>
                  <p className="text-white/70 text-sm font-medium">Gérer les comptes et accès utilisateur</p>
                </div>
                <ArrowRight className="text-white group-hover:translate-x-2 transition-transform" size={28} />
              </div>
            </button>

          </div>

          {/* Statistiques additionnelles */}
          <div className="mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-black text-white mb-6 drop-shadow-lg">Résumé de l'activité</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">Taux d'activation</p>
                <div className="w-full bg-white/10 rounded-full h-3 border border-white/20">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full"
                    style={{ width: `${growthRate}%` }}
                  ></div>
                </div>
                <p className="text-emerald-300 font-bold mt-2">{growthRate}%</p>
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">Utilisateurs désactivés</p>
                <div className="w-full bg-white/10 rounded-full h-3 border border-white/20">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full"
                    style={{ width: `${totalUsers > 0 ? ((totalDisabled / totalUsers) * 100).toFixed(1) : 0}%` }}
                  ></div>
                </div>
                <p className="text-red-300 font-bold mt-2">{totalDisabled} utilisateurs</p>
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">Responsables</p>
                <div className="w-full bg-white/10 rounded-full h-3 border border-white/20">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full"
                    style={{ width: `${totalUsers > 0 ? ((totalResponsables / totalUsers) * 100).toFixed(1) : 0}%` }}
                  ></div>
                </div>
                <p className="text-amber-300 font-bold mt-2">{totalResponsables} responsables</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;