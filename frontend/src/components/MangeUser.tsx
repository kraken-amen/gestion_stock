import { UsersIcon, ShieldCheck, UserCheck, UserX, Loader2, TrendingUp, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/userService";
import type { User } from "../types";

const MangeUser = () => {
    const [users, setUsers]     = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate              = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }

        setLoading(true);
        getUsers()
            .then(res  => { setUsers(res.data); setLoading(false); })
            .catch(err => { console.error("Erreur fetching users:", err); setLoading(false); });
    }, [navigate]);

    // ── Stats ──
    const totalUsers        = users.length;
    const totalResponsables = users.filter(u => u.role === 'responsable region').length;
    const totalActive       = users.filter(u => u.isActive).length;
    const totalDisabled     = users.filter(u => !u.isActive).length;
    const activationRate    = totalUsers > 0 ? ((totalActive / totalUsers) * 100).toFixed(1) : "0";
    const disabledRate      = totalUsers > 0 ? ((totalDisabled / totalUsers) * 100).toFixed(1) : "0";
    const responsableRate   = totalUsers > 0 ? ((totalResponsables / totalUsers) * 100).toFixed(1) : "0";

    const stats = [
        {
            title: "Total utilisateurs",
            value: totalUsers,
            icon: <UsersIcon size={20} />,
            color: "text-blue-300",
            iconBg: "bg-blue-500/20",
            border: "border-blue-500/20",
            glow: "shadow-blue-500/10",
            sub: "inscrits dans le système",
        },
        {
            title: "Responsables",
            value: totalResponsables,
            icon: <ShieldCheck size={20} />,
            color: "text-amber-300",
            iconBg: "bg-amber-500/20",
            border: "border-amber-500/20",
            glow: "shadow-amber-500/10",
            sub: `${responsableRate}% du total`,
        },
        {
            title: "Comptes actifs",
            value: totalActive,
            icon: <UserCheck size={20} />,
            color: "text-emerald-300",
            iconBg: "bg-emerald-500/20",
            border: "border-emerald-500/20",
            glow: "shadow-emerald-500/10",
            sub: `${activationRate}% actifs`,
            highlight: true,
        },
        {
            title: "Comptes désactivés",
            value: totalDisabled,
            icon: <UserX size={20} />,
            color: "text-red-300",
            iconBg: "bg-red-500/20",
            border: "border-red-500/20",
            glow: "shadow-red-500/10",
            sub: `${disabledRate}% du total`,
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-white/30">
                <Loader2 className="animate-spin mb-3" size={32} />
                <p className="text-[13px] font-medium">Chargement des données…</p>
            </div>
        );
    }

    return (
        <div className="px-5 pb-8 pt-2">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[18px] font-black text-white tracking-tight">
                        Gestion des utilisateurs
                    </h2>
                    <p className="text-white/40 text-[12px] font-medium mt-0.5">
                        Vue d'ensemble des comptes et accès
                    </p>
                </div>
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold transition-colors shadow-lg shadow-blue-600/25"
                >
                    <UsersIcon size={13} />
                    Gérer les comptes
                </button>
            </div>

            {/* ── KPI cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden rounded-2xl border ${s.border} bg-white/[0.04] backdrop-blur-xl p-4 hover:bg-white/[0.07] transition-all duration-300 shadow-xl ${s.glow} group`}
                    >
                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-9 h-9 ${s.iconBg} ${s.color} rounded-xl flex items-center justify-center`}>
                                {s.icon}
                            </div>
                            <button className="text-white/20 hover:text-white/50 transition-colors">
                                <MoreHorizontal size={14} />
                            </button>
                        </div>

                        <p className="text-[11px] font-semibold text-white/45 mb-1 uppercase tracking-wide">
                            {s.title}
                        </p>
                        <p className="text-[28px] font-black text-white leading-none tracking-tight">
                            {s.value}
                        </p>
                        {s.highlight ? (
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp size={10} className="text-emerald-400" />
                                <p className="text-emerald-400 text-[10px] font-bold">{s.sub}</p>
                            </div>
                        ) : (
                            <p className={`text-[10px] font-medium mt-2 ${s.color} opacity-70`}>{s.sub}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Activity summary ── */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[14px] font-black text-white">Résumé de l'activité</h3>
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">ce mois</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Activation */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-white/50">Taux d'activation</p>
                            <p className="text-[12px] font-black text-emerald-400">{activationRate}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000"
                                style={{ width: `${activationRate}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-white/25">{totalActive} comptes actifs / {totalUsers} total</p>
                    </div>

                    {/* Disabled */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-white/50">Comptes désactivés</p>
                            <p className="text-[12px] font-black text-red-400">{disabledRate}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000"
                                style={{ width: `${disabledRate}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-white/25">{totalDisabled} utilisateurs désactivés</p>
                    </div>

                    {/* Responsables */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-white/50">Responsables régionaux</p>
                            <p className="text-[12px] font-black text-amber-400">{responsableRate}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
                                style={{ width: `${responsableRate}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-white/25">{totalResponsables} responsables assignés</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MangeUser;