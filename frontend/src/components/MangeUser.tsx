import { UsersIcon, ShieldCheck, UserCheck, UserX, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/userService";
import type { User } from "../types";

const MangeUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Fetch data au chargement
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        setLoading(true);
        getUsers()
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur fetching users:", err);
                setLoading(false);
            });
    }, [navigate]);

    // Calcul des statistiques
    const totalUsers = users.length;
    const totalResponsables = users.filter(u => u.role === 'responsable region').length;
    const totalActive = users.filter(u => u.isActive).length;
    const totalDisabled = users.filter(u => !u.isActive).length;
    const growthRate = totalUsers > 0 ? ((totalActive / totalUsers) * 100).toFixed(1) : "0";

    const stats = [
        { title: "Total Users", value: totalUsers, icon: <UsersIcon size={24} />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-400/30" },
        { title: "Total Responsables", value: totalResponsables, icon: <ShieldCheck size={24} />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/30" },
        { title: "Active Accounts", value: totalActive, icon: <UserCheck size={24} />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-400/30" },
        { title: "Disabled Users", value: totalDisabled, icon: <UserX size={24} />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/30" }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white/50">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p>Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            {/* Section En-tête */}
            <div className="mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg text-center md:text-left">
                    Statistiques utilisateurs
                </h2>
                <p className="text-white/70 font-medium text-center md:text-left text-sm md:text-base">
                    Statistiques globales des utilisateurs
                </p>
            </div>

            {/* Grille de Statistiques: Responsive Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className={`backdrop-blur-xl bg-white/10 border ${s.border} rounded-2xl p-5 md:p-6 hover:border-white/50 transition-all duration-300 hover:bg-white/15 shadow-xl`}
                    >
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                            {s.icon}
                        </div>
                        <h3 className="text-white/70 text-xs md:text-sm font-semibold mb-1 md:mb-2">{s.title}</h3>
                        <p className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{s.value}</p>
                        {s.title === "Active Accounts" && (
                            <p className="text-emerald-300 text-[10px] md:text-xs font-medium mt-2">
                                {growthRate}% actifs
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Section Gestion: Responsive Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"> */}
                {/* Button Manage Regions */}
                {/* <button
                    onClick={() => navigate('/regions')}
                    className="group backdrop-blur-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/20 hover:border-blue-300/50 rounded-2xl p-6 md:p-8 transition-all duration-300 active:scale-95"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <h2 className="text-lg md:text-2xl font-black text-white mb-1">Gérer les régions</h2>
                            <p className="text-white/60 text-xs md:text-sm font-medium">Configuration des zones</p>
                        </div>
                        <ArrowRight className="text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all" size={24} />
                    </div>
                </button> */}

                {/* Button Manage Users */}
                {/* <button
                    onClick={() => navigate('/users')}
                    className="group backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl p-6 md:p-8 transition-all duration-300 active:scale-95"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <h2 className="text-lg md:text-2xl font-black text-white mb-1">Gérer les utilisateurs</h2>
                            <p className="text-white/60 text-xs md:text-sm font-medium">Comptes et accès</p>
                        </div>
                        <ArrowRight className="text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all" size={24} />
                    </div>
                </button>
            </div> */}

            {/* Resume de l'activité: Improved for Mobile */}
            <div className="mt-8 md:mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-lg md:text-xl font-black text-white mb-6 drop-shadow-lg">Résumé de l'activité</h3>
                <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                    {/* Activation Rate */}
                    <div className="space-y-2">
                        <p className="text-white/70 text-xs md:text-sm font-medium">Taux d'activation</p>
                        <div className="w-full bg-white/10 rounded-full h-2 border border-white/10 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-1000"
                                style={{ width: `${growthRate}%` }}
                            ></div>
                        </div>
                        <p className="text-emerald-300 text-sm font-bold">{growthRate}%</p>
                    </div>

                    {/* Disabled Users */}
                    <div className="space-y-2">
                        <p className="text-white/70 text-xs md:text-sm font-medium">Utilisateurs désactivés</p>
                        <div className="w-full bg-white/10 rounded-full h-2 border border-white/10 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-red-500 to-red-400 h-full transition-all duration-1000"
                                style={{ width: `${totalUsers > 0 ? (totalDisabled / totalUsers) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <p className="text-red-300 text-sm font-bold">{totalDisabled} utilisateurs</p>
                    </div>

                    {/* Responsables */}
                    <div className="space-y-2">
                        <p className="text-white/70 text-xs md:text-sm font-medium">Responsables</p>
                        <div className="w-full bg-white/10 rounded-full h-2 border border-white/10 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-1000"
                                style={{ width: `${totalUsers > 0 ? (totalResponsables / totalUsers) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <p className="text-amber-300 text-sm font-bold">{totalResponsables} membres</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MangeUser;