import { useEffect, useState } from 'react';
import { Search, Edit2, Plus, Filter, Mail, Power, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { createUser, getUsers, toggleUserStatus } from "../services/userService";
import { useNavigate } from 'react-router-dom';
import type { User } from "../types";

export default function UsersListPage() {
  // --- ÉTATS (STATES) ---
  const [users, setUsers] = useState<User[]>([]); // État pour stocker la liste des utilisateurs
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche
  const [filterRole, setFilterRole] = useState('all'); // État pour le filtre de rôle
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  // --- EFFETS (EFFECTS) ---
  // Charger les utilisateurs dès le chargement de la page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [navigate]);

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

  // --- STYLE DES BADGES DE RÔLE ---
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border border-red-400/50';
      case 'responsable_region': return 'bg-amber-500/20 text-amber-400 border border-amber-400/50';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-400/50';
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
  setFormData({
    email: '',
    password: '',
    role: 'user'
  });
  setErrors({
    email: '',
    password: '',
    role: 'user'
  });
  setShowPassword(false);
  setIsModalOpen(false);
};
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-white drop-shadow-lg">Gestion des Utilisateurs</h1>
                <p className="text-white/70 text-sm font-medium">Administration et contrôle des accès plateforme</p>
              </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-lg hover:shadow-xl">
              <Plus size={18} />
              Nouveau User
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* --- SECTION FILTRES (CONTROLS) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Barre de recherche par email */}
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
                <option value="admin" className="bg-slate-900">Admin</option>
                <option value="responsable_region" className="bg-slate-900">Responsable Région</option>
                <option value="user" className="bg-slate-900">User</option>
              </select>
            </div>
          </div>

          {/* --- TABLEAU DES UTILISATEURS --- */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/20">
                  <th className="px-8 py-5 text-xs font-black text-white/80 uppercase tracking-widest">Utilisateur</th>
                  <th className="px-8 py-5 text-xs font-black text-white/80 uppercase tracking-widest">Rôle</th>
                  <th className="px-8 py-5 text-xs font-black text-white/80 uppercase tracking-widest">Statut</th>
                  <th className="px-8 py-5 text-center text-xs font-black text-white/80 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    {/* Avatar et Infos Email */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-lg uppercase">
                          {user.email.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base">{user.email.split('@')[0]}</span>
                          <span className="text-white/70 text-sm flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Badge de Rôle */}
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    {/* Indicateur de Statut */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-red-400 shadow-lg shadow-red-500/50'}`} />
                        <span className={`text-sm font-bold ${user.isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                          {user.isActive ? 'Actif' : 'Bloqué'}
                        </span>
                      </div>
                    </td>
                    {/* Boutons d'Action */}
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleToggle(user._id!)}
                          className={`p-2.5 rounded-lg transition-all ${user.isActive ? 'bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-400/50' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 border border-emerald-400/50'}`}
                          title={user.isActive ? "Bloquer l'utilisateur" : "Activer l'utilisateur"}
                        >
                          <Power size={18} />
                        </button>
                        <button className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition-all border border-blue-400/50">
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Message si aucun résultat */}
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center text-white/70 font-medium">
                Aucun utilisateur trouvé.
              </div>
            )}
          </div>
        </div>
      </div>
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Overlay */}
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={handleClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
              {/* Le Formulaire */}
              <h2 className="text-2xl font-bold text-white mb-6">Ajouter un utilisateur</h2>

              <form className="space-y-4">

                {/* email */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@tunisietelecom.com"
                    className={`w-full bg-white/5 backdrop-blur-sm border-2 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium`}
                  />
                  {errors.email && (
                    <p className="text-red-300 text-xs font-medium mt-1">{errors.email}</p>
                  )}
                </div>

                {/* password */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-white/90 mb-2">Password</label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium"
                    />
                    {errors.password && (
                      <p className="text-red-300 text-xs font-medium mt-1">{errors.password}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">User Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/50
                    focus:bg-white/10 focus:outline-none transition-all font-medium
                    appearance-none cursor-pointer "
                  >
                    <option value="user" className="bg-slate-900">User</option>
                    <option value="responsable_region" className="bg-slate-900">Regional Responsible</option>
                    <option value="admin" className="bg-slate-900">Administrator</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="relative flex-1 py-3 rounded-xl font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/30"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {loading ? 'Ajout en cours...' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div>

  );
}