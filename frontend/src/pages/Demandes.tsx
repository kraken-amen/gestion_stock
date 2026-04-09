import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, ArrowLeft, Trash2, Clock, FileText, Mail, Eye, Check, X, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Demande } from '../types';
import { getDemandes, deleteDemande, approveDemande, rejectDemande } from '../services/demandeService';
import DemandeModelCreate from '../components/DemandeModelCreate';
import DemandeModelUpdate from '../components/DemandeModelUpdate';
import DemandeModelView from '../components/DemandeModelView';

export default function DemandesPage() {
    const navigate = useNavigate();
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
    const [orderBy, setOrderBy] = useState('all');
    const fetchDemandes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        console.log(isModalOpenUpdate,isModalOpenCreate);
        try {
            setLoading(true);
            const res = await getDemandes() as any;
            const data = res.data || res || [];
            setDemandes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchDemandes();
    }, [navigate]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette demande ?')) {
            try {
                await deleteDemande(id);
                fetchDemandes();
            } catch (error) {
                console.error("Erreur suppression:", error);
            }
        }
    };
    const handleApprove = async (id: string) => {
        if (window.confirm('Voulez-vous vraiment approuver cette demande ?')) {
            try {
                await approveDemande(id);
                fetchDemandes();
            } catch (error) {
                console.error("Erreur approbation:", error);
            }
        }
    };
    const handleReject = async (id: string) => {
        if (window.confirm('Voulez-vous vraiment rejeter cette demande ?')) {
            try {
                await rejectDemande(id);
                fetchDemandes();
            } catch (error) {
                console.error("Erreur rejection:", error);
            }
        }
    };

    const processedDemandes = useMemo(() => {
        if (!demandes) return [];

        let result = demandes.filter(demande => {
            const email = demande.user_id?.email || '';
            const region = demande.user_id?.region || '';

            const matchesItems = demande.items?.some(item =>
                item.product_id?.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesSearch =
                email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                matchesItems;

            const matchesStatus = filterStatus === 'all' || demande.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (orderBy !== 'all') {
            result = [...result].sort((a, b) => {
                if (orderBy === 'reference') return (a.items?.[0]?.product_id?.codeArticle || "").localeCompare(b.items?.[0]?.product_id?.codeArticle || "");
                if (orderBy === 'date') return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
                if (orderBy === 'quantite') return (b.items?.[0]?.quantite || 0) - (a.items?.[0]?.quantite || 0);
                return 0;
            });
        }
        return result;
    }, [demandes, searchTerm, filterStatus, orderBy]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACCEPTEE': return 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]';
            case 'EN_ATTENTE': return 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]';
            case 'REJETEE': return 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]';
            default: return 'bg-white/10 text-white/70';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'ACCEPTEE': 'ACCEPTEE',
            'EN_ATTENTE': 'EN ATTENTE',
            'REJETEE': 'REJETEE',
        };
        return labels[status] || status.toUpperCase();
    };

    return (
        <div className="min-h-screen relative font-sans text-white">
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
                <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative z-10">
                <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all">
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Gestion des Demandes</h1>
                                <p className="text-white/60 text-xs hidden md:block">suivi des demandes en temps réel</p>

                            </div>
                        </div>
                        {JSON.parse(localStorage.getItem('role') || '""') === "responsable region" && (
                            <button onClick={() => setIsModalOpenCreate(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg active:scale-95">
                                <Plus size={18} /> Nouvelle Demande
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total', value: demandes.length, color: 'text-white' },
                            { label: 'En attente', value: demandes.filter(d => d.status === 'EN_ATTENTE').length, color: 'text-amber-400' },
                            { label: 'Rejetées', value: demandes.filter(d => d.status === 'REJETEE').length, color: 'text-red-400' },
                            { label: 'Approuvées', value: demandes.filter(d => d.status === 'ACCEPTEE').length, color: 'text-emerald-400' },
                        ].map((stat, i) => (
                            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                                <span className="text-white/50 text-[10px] uppercase font-black mb-1">{stat.label}</span>
                                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Filters Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher par référence, client, région..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white font-medium transition-all"
                            />
                        </div>
                        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border-2 border-white/20 focus:outline-none text-white appearance-none cursor-pointer">
                            <option value="quantite" className="bg-slate-900">Quantité</option>
                            <option value="date" className="bg-slate-900">Date</option>
                            <option value="reference" className="bg-slate-900">Code Article</option>
                        </select>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border-2 border-white/20 focus:outline-none text-white appearance-none cursor-pointer">
                            <option value="all" className="bg-slate-900">Tous les statuts</option>
                            <option value="EN_ATTENTE" className="bg-slate-900">En attente</option>
                            <option value="REJETEE" className="bg-slate-900">Rejeté</option>
                            <option value="ACCEPTEE" className="bg-slate-900">Approuvé</option>
                        </select>
                    </div>

                    {/* Table Section */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Région / Date</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Code Article / Qté</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {processedDemandes.map((demande) => (
                                    <tr key={demande._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-amber-500/20 text-amber-400 border border-amber-400/50">
                                                    {demande.user_id?.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{demande.user_id?.email.split('@')[0]}</span>
                                                    <span className="text-white/50 text-xs md:text-sm flex items-center gap-1 truncate">
                                                        <Mail size={14} className="flex-shrink-0" />
                                                        <span className="truncate">{demande.user_id?.email}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white/80 text-sm font-bold">{demande.user_id?.region}</span>
                                                <span className="text-white/50 text-xs flex items-center gap-1">
                                                    <Clock size={12} /> {demande.createdAt ? new Date(demande.createdAt).toLocaleDateString() : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {demande.items?.map((item, index) => (
                                                <div key={index} className="flex flex-col mb-1 last:mb-0">
                                                    <span className="font-bold text-sm text-blue-400">#{item.product_id?.codeArticle || 'N/A'}</span>
                                                    <span className="text-red-300/70 text-[10px] font-black">
                                                        {item?.quantite} UNITÉS
                                                    </span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${getStatusStyles(demande.status)}`}>
                                                {getStatusLabel(demande.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {
                                                    demande.status === 'EN_ATTENTE' && JSON.parse(localStorage.getItem('role') || '""') === "responsable region" && (
                                                        <button onClick={() => { setSelectedDemande(demande); setIsModalOpenUpdate(true); }} className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 border border-yellow-400/30">
                                                            <Edit2 size={16} />
                                                        </button>
                                                    )
                                                }
                                                {
                                                    demande.status === 'EN_ATTENTE' && JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && (
                                                        <button onClick={() => handleApprove(demande._id)} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/40 border border-green-400/30">
                                                            <Check size={16} />
                                                        </button>
                                                    )
                                                }
                                                {
                                                    demande.status === 'EN_ATTENTE' && JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && (
                                                        <button onClick={() => handleReject(demande._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-400/30">
                                                            <X size={16} />
                                                        </button>
                                                    )
                                                }
                                                <button onClick={() => { setIsModalOpenView(true); setSelectedDemande(demande); }} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-400/30">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(demande._id)} className="p-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 border border-gray-400/30">
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!loading && processedDemandes.length === 0 && (
                            <div className="py-20 text-center text-white/40">
                                <FileText className="mx-auto mb-4 opacity-20" size={60} />
                                <p className="font-bold">Aucune demande trouvée.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DemandeModelCreate
                isOpen={isModalOpenCreate}
                onClose={() => setIsModalOpenCreate(false)}
                onDemandeCreated={fetchDemandes}
            />
            {
                isModalOpenUpdate && selectedDemande &&
                <DemandeModelUpdate
                    isOpen={isModalOpenUpdate}
                    onClose={() => { setIsModalOpenUpdate(false); setSelectedDemande(null) }}
                    onDemandeUpdated={fetchDemandes}
                    demande={selectedDemande}
                />
            }
            {
                isModalOpenView && selectedDemande &&
                <DemandeModelView
                    isOpen={isModalOpenView}
                    onClose={() => { setIsModalOpenView(false); setSelectedDemande(null) }}
                    demande={selectedDemande}
                />
            }
        </div>
    );
}