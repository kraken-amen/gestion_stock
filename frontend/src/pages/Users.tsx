import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Edit2, Plus, Filter, Mail, Power } from 'lucide-react';
import { getUsers, toggleUserStatus } from "../services/userService";
import type { User } from "../types";

export default function UsersListPage() {
  // --- ÉTATS (STATES) ---
  const [users, setUsers] = useState<User[]>([]); // État pour stocker la liste des utilisateurs
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche
  const [filterRole, setFilterRole] = useState('all'); // État pour le filtre de rôle

  // --- EFFETS (EFFECTS) ---
  // Charger les utilisateurs dès le chargement de la page
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- ACTIONS ---
  // Fonction pour récupérer les données depuis l'API backend
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data); // On met à jour l'état avec les données réelles
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  // Fonction pour activer/bloquer un utilisateur
  const handleToggle = async (id: string) => {
    try {
      await toggleUserStatus(id); // Appel au service backend
      fetchUsers(); // Recharger la liste pour voir le changement de statut
    } catch (error) {
      alert("Erreur lors du changement de statut");
    }
  };

  // --- LOGIQUE DE FILTRAGE ---
  // Filtrer la liste en fonction de l'email et du rôle sélectionné
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // --- STYLE DES BADGES DE RÔLE (MODIFIÉ PAR VOUS) ---
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-500/20 text-red-500 border border-red-500/50';
      case 'responsable_region': return 'bg-orange-500/20 text-orange-500 border border-orange-500/50';
      default: return 'bg-blue-500/20 text-blue-500 border border-blue-500/50';
    }
  };

  return (
    // Arrière-plan Slate-900 (Gris foncé bleuté) pour un look moderne et lisible
    <div className="relative min-h-screen bg-slate-900 p-8 text-slate-200">
      
      {/* Effets visuels (Blobs) en arrière-plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- SECTION EN-TÊTE (HEADER) --- */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-900/40">
                <UsersIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Gestion des Utilisateurs</h1>
            </div>
            <p className="text-slate-400 font-medium">Administration et contrôle des accès plateforme</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
            <Plus className="w-5 h-5" />
            Nouveau User
          </button>
        </div>

        {/* --- SECTION FILTRES (CONTROLS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Barre de recherche par email */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white placeholder-slate-500 transition-all shadow-inner"
            />
          </div>
          {/* Sélecteur de rôle */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none text-white appearance-none cursor-pointer shadow-inner"
            >
              <option value="all" className="bg-slate-800">Tous les rôles</option>
              <option value="admin" className="bg-slate-800">Admin</option>
              <option value="responsable_region" className="bg-slate-800">Responsable Région</option>
              <option value="user" className="bg-slate-800">User</option>
            </select>
          </div>
        </div>

        {/* --- TABLEAU DES UTILISATEURS --- */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-700">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Rôle</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-blue-500/5 transition-colors group">
                  {/* Avatar et Infos Email */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold border border-slate-600 shadow-sm uppercase">
                        {user.email.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-base">{user.email.split('@')[0]}</span>
                        <span className="text-slate-500 text-sm flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Badge de Rôle */}
                  <td className="px-8 py-5">
                    <span className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  {/* Indicateur de Statut */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-rose-500'}`} />
                      <span className={`text-sm font-bold ${user.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {user.isActive ? 'Actif' : 'Bloqué'}
                      </span>
                    </div>
                  </td>
                  {/* Boutons d'Action */}
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleToggle(user._id!)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${user.isActive ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                        title={user.isActive ? "Bloquer l'utilisateur" : "Activer l'utilisateur"}
                      >
                        <Power className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all shadow-sm border border-transparent hover:border-blue-500/30">
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Message si aucun résultat */}
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-slate-500 font-medium">
              Aucun utilisateur trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}