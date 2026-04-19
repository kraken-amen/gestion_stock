import { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowLeft, Loader2, Trash2, ClipboardList, Truck, CheckCircle, Clock, Box } from 'lucide-react';
import { getCommandes, deleteCommande } from "../services/commandeService";
import CommandeModelCreate from '../components/CommandeModelCreate';
import { useNavigate } from 'react-router-dom';
import type { Commande } from "../types";
import CommandeModelView from '../components/CommandeModelView';

export default function CommandePage() {
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // Updated filter for Status enum
    const navigate = useNavigate();
    const [isModalOpenView, setIsModalOpenView] = useState(false);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchCommandes();
    }, [navigate]);

    // Fetch Commandes instead of Products
    const fetchCommandes = async () => {
        try {
            setLoading(true);
            const res = await getCommandes();
            const dataToSet = Array.isArray(res) ? res : (res?.data || []);
            setCommandes(dataToSet);
        } catch (error) {
            console.error("Erreur fetching commandes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Voulez-vous supprimer cette commande ?")) return;
        try {
            await deleteCommande(id);
            fetchCommandes();
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    // Filter logic updated for Commande Status and Demande Reference
    const filteredCommandes = useMemo(() => {
        if (!Array.isArray(commandes)) return [];

        return commandes.filter(cmd => {
            const matchesStatus = filterStatus === 'all' || cmd.status === filterStatus;

            const refId = typeof cmd.demande_id === 'object' ? cmd.demande_id?._id : cmd.demande_id;

            const matchesSearch =
                (refId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cmd.status?.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesSearch && matchesStatus;
        });
    }, [commandes, searchTerm, filterStatus]);

    // Helper for status badges colors
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'EN_PREPARATION': return 'bg-amber-500/20 text-amber-400 border border-amber-400/50';
            case 'EXPEDIEE': return 'bg-blue-500/20 text-blue-400 border border-blue-400/50';
            case 'LIVREE': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50';
            default: return 'bg-slate-500/20 text-slate-400 border border-slate-400/50';
        }
    };
    const getdemande = (demande_id: any) => {
        if (demande_id) {
            return 'bg-amber-500/20 text-amber-400 border border-amber-400/50';
        }
        else {
            return 'bg-red-500/20 text-red-400 border border-red-400/50';
        }
    };
    return (
        <div className="min-h-screen relative font-sans text-white">
            {/* Background - Kept Original */}
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
                                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Suivi des Commandes</h1>
                                <p className="text-white/60 text-xs hidden md:block">Gestion des expéditions et livraisons</p>
                            </div>
                        </div>
                        {/* Note: Create button usually redirects to a selection of Demande first */}
                        <button
                            onClick={() => setIsModalOpenCreate(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={18} /> Nouvelle Commande
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher par ID Demande ou statut..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
                            >
                                <option value="all" className="bg-slate-900">Tous les statuts</option>
                                <option value="EN_PREPARATION" className="bg-slate-900">En Préparation</option>
                                <option value="EXPEDIEE" className="bg-slate-900">Expédiée</option>
                                <option value="LIVREE" className="bg-slate-900">Livrée</option>
                            </select>
                        </div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                                <Loader2 className="animate-spin" size={40} />
                                <p>Chargement des commandes...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">commande/Qté</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">région/Date</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Statut</th>
                                        {JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && (
                                            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCommandes.map((commande) => (
                                        <tr key={commande._id} className="hover:bg-white/5 transition-colors group"
                                            onClick={() => { setIsModalOpenView(true); setSelectedCommande(commande); }}
                                            title="Voir les détails complets"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getdemande(commande.demande_id)}`}>
                                                        <ClipboardList size={18} />
                                                    </div>
                                                    <div className="flex flex-col gap-1 max-h-[120px] overflow-hidden relative">
                                                        {commande.items?.slice(0, 2).map((item, index) => (
                                                            <div key={index} className="flex flex-row items-center gap-2 mb-1 last:mb-0">
                                                                <Box size={10} />
                                                                {/* El Code Article */}
                                                                <span className="font-bold text-sm text-blue-400 whitespace-nowrap">
                                                                    #{item?.product_id?.codeArticle}
                                                                </span>

                                                                {/* El Quantité same line*/}
                                                                <span className="text-red-300/70 text-[10px] font-black whitespace-nowrap">
                                                                    / {item?.quantite} UNITÉS
                                                                </span>
                                                            </div>
                                                        ))}

                                                        {commande.items?.length > 2 && (
                                                            <span className="text-white/40 text-xs font-bold mt-1">
                                                                ... et {commande.items.length - 2} autres
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-emerald-400 text-base font-black tracking-tight">
                                                        {new Intl.NumberFormat('fr-TN', {
                                                            minimumFractionDigits: 3
                                                        }).format(commande.items?.reduce((total, item) =>
                                                            total + (item.quantite * (item.product_id?.prix || 0)), 0)
                                                        )}
                                                        <span className="ml-1 text-xs font-medium text-emerald-500/70">DT</span>
                                                    </span>
                                                    <span className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">
                                                        Total Net
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white/80 text-sm font-bold">{commande.region}</span>
                                                    <span className="text-white/50 text-xs flex items-center gap-1">
                                                        <Clock size={12} /> {commande.createdAt ? new Date(commande.createdAt).toLocaleDateString() : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap flex items-center gap-2 w-fit ${getStatusStyles(commande.status)}`}>
                                                    {commande.status === 'EN_PREPARATION' && <Loader2 size={12} className="animate-spin" />}
                                                    {commande.status === 'EXPEDIEE' && <Truck size={12} />}
                                                    {commande.status === 'LIVREE' && <CheckCircle size={12} />}
                                                    {commande.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && (
                                                        <>
                                                            {/* <button
                                                                className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 transition-all"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button> */}
                                                            <button
                                                                onClick={() => handleDelete(commande._id!)}
                                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!loading && filteredCommandes.length === 0 && (
                            <div className="py-20 text-center text-white/40">
                                <ClipboardList className="mx-auto mb-4 opacity-20" size={60} />
                                <p>Aucune commande trouvée.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Modal for viewing the linked Demande details */}
            {isModalOpenView && selectedCommande && (
                <CommandeModelView
                    isOpen={isModalOpenView}
                    onClose={() => { setIsModalOpenView(false); setSelectedCommande(null) }}
                    commande={selectedCommande} // Passing the referenced Demande
                />
            )}
            {isModalOpenCreate && (
                <CommandeModelCreate
                    isOpen={isModalOpenCreate}
                    onClose={() => setIsModalOpenCreate(false)}
                    onCommandeCreated={fetchCommandes}
                />
            )}
        </div>
    );
}