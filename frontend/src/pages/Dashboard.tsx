import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MangeUser from '../components/MangeUser';
import { PermissionGate } from '../components/PermissionGate';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user,logout } = useAuth()
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  useEffect(() => {
    console.log("USER ROLE =", user?.role)
    console.log("USER =", user)
  }, [user]);
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
        <PermissionGate role={user?.role} permission="MANAGE_USERS">
          <MangeUser />
        </PermissionGate>
      </div>
    </div>
  );
};

export default Dashboard;