import { useEffect, useState } from 'react';
import { Search, Edit2, Plus, Filter, Mail, Power, ArrowLeft, Loader2, UserCircle, Trash2 } from 'lucide-react';
import { getUsers, toggleUserStatus, deleteUser } from "../services/userService";
import { useNavigate } from 'react-router-dom';
import type { User } from "../types";
import UserModelCreate from '../components/UserModelCreate';
import UserModelUpdate from '../components/UserModelUpdate';
import UserModelUpdateAdmin from '../components/UserModelUpdateAdmin';
export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpenUpdateAdmin, setIsModalOpenUpdateAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const savedUser = localStorage.getItem('user');
  const currentAuthUser = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };
  const handleToggle = async (id: string) => {
    try {
      await toggleUserStatus(id);
      fetchUsers();
    } catch (error) {
      alert("Erreur lors du changement de statut");
    }
  };

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.isActive === (filterStatus === 'true');
    return matchesSearch && matchesRole && matchesStatus;
  });
  const adminAccount = users.find(u => u._id === currentAuthUser?.id || u._id === currentAuthUser?._id);
  const otherUsers = filteredUsers.filter(u => u._id !== currentAuthUser?.id && u._id !== currentAuthUser?._id);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrateur': return 'bg-red-500/20 text-red-400 border border-red-400/50';
      case 'responsable region': return 'bg-amber-500/20 text-amber-400 border border-amber-400/50';
      case 'Gestionnaire de Stock': return 'bg-green-500/20 text-green-400 border border-green-400/50';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-400/50';
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Responsive */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Gestion Utilisateurs</h1>
                <p className="text-white/60 text-xs hidden md:block">Administration et contrôle des accès</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpenCreate(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} /> Nouveau
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

          {adminAccount && !loading && (
            <div className="mb-8 backdrop-blur-xl bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ring-4 ring-blue-500/20 ${getRoleColor(adminAccount.role)}`}>
                  {adminAccount.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base md:text-lg text-white truncate max-w-[120px] md:max-w-none">
                      {adminAccount.email?.split('@')[0]}
                    </span>
                    <span className="bg-blue-500 text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter whitespace-nowrap">
                      Mon Compte
                    </span>
                  </div>
                  <span className="text-white/50 text-xs md:text-sm flex items-center gap-1 truncate">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{adminAccount.email}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedUser(adminAccount); setIsModalOpenUpdateAdmin(true); }}
                className="p-2 md:p-3 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all active:scale-95 flex-shrink-0"
                title="Modifier mon profil"
              >
                <Edit2 size={20} />
              </button>
            </div>
          )}

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Barre de recherche */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher par email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
              />
            </div>

            {/* Sélecteur de rôle */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all" className="bg-slate-900">Tous les rôles</option>
                <option value="administrateur" className="bg-slate-900">Administrateur</option>
                <option value="responsable region" className="bg-slate-900">Responsable Région</option>
                <option value="utilisateur" className="bg-slate-900">Utilisateur</option>
                <option value="Gestionnaire de Stock" className="bg-slate-900">Gestionnaire de Stock</option>
              </select>
            </div>

            {/* Sélecteur de statut */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all" className="bg-slate-900">Tous les statuts</option>
                <option value="true" className="bg-slate-900">Actif</option>
                <option value="false" className="bg-slate-900">Bloqué</option>
              </select>
            </div>
          </div>

          {/* Table Container - Mobile Responsive */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                <Loader2 className="animate-spin" size={40} />
                <p>Chargement des utilisateurs...</p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {otherUsers.map((user) => (

                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRoleColor(user.role)}`}>
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm truncate max-w-[150px]">{user.email?.split('@')[0]}</span>
                            <span className="text-white/50 text-xs flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap ${getRoleColor(user.role)}`}>
                          {user.role === "responsable region" ? "responsable " + user.region : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`} />
                          <span className={`text-xs font-bold ${user.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {user.isActive ? 'Actif' : 'Bloqué'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggle(user._id!)}
                            className={`p-2 rounded-lg transition-all ${user.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'}`}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => { setSelectedUser(user); setIsModalOpenUpdate(true); }}
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id!)}
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && otherUsers.length === 0 && (
              <div className="py-20 text-center text-white/40">
                <UserCircle className="mx-auto mb-4 opacity-20" size={60} />
                <p>Aucun utilisateur trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserModelCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        onUserCreated={fetchUsers}
      />

      {isModalOpenUpdate && selectedUser && (
        <UserModelUpdate
          isOpen={isModalOpenUpdate}
          onClose={() => { setIsModalOpenUpdate(false); setSelectedUser(null); }}
          onUserUpdated={fetchUsers}
          user={selectedUser}
        />
      )}
      {isModalOpenUpdateAdmin && selectedUser && (
        <UserModelUpdateAdmin
          isOpen={isModalOpenUpdateAdmin}
          onClose={() => { setIsModalOpenUpdateAdmin(false); setSelectedUser(null); }}
          onUserUpdated={fetchUsers}
          user={selectedUser}
        />
      )}
    </div>
  );
}