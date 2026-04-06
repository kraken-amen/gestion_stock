import { useState } from 'react';
import { Search, Filter, Plus, ArrowLeft, Edit2, Trash2, Clock, CheckCircle, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Demande } from '../types';

// Données mock
const MOCK_DEMANDES: Demande[] = [
    {
        id: '1',
        client: 'Mohamed Ahmed',
        email: 'med.ahmed@gmail.com',
        region: 'Tunis',
        status: 'pending',
        item: [{ quantity: 500, reference: 'DEM-2024-001' }, { quantity: 250, reference: 'DEM-2024-002' }],
        createdAt: '2024-03-08',
        dueDate: '2024-03-15',
        description: 'Demande de stock iPhone 15 Pro'
    },
    {
        id: '2',
        client: 'Fatima Bousselmi',
        email: 'fatima.b@gmail.com',
        region: 'Sfax',
        status: 'in_progress',
        item: [{ quantity: 250, reference: 'DEM-2024-002' }],
        createdAt: '2024-03-07',
        dueDate: '2024-03-12',
        description: 'Demande de service installation'
    },
    {
        id: '3',
        client: 'Ali Mansour',
        email: 'ali.mansour@gmail.com',
        region: 'Sousse',
        status: 'approved',
        item: [{ quantity: 1000, reference: 'DEM-2024-003' }],
        createdAt: '2024-03-06',
        dueDate: '2024-03-10',
        description: 'Demande de stock Samsung Galaxy'
    },
    {
        id: '4',
        client: 'Zahra Khalifa',
        email: 'zahra.k@gmail.com',
        region: 'Kairouan',
        status: 'rejected',
        item: [{ quantity: 100, reference: 'DEM-2024-004' }],
        createdAt: '2024-03-05',
        dueDate: '2024-03-09',
        description: 'Demande de maintenance'
    },
    {
        id: '5',
        client: 'Omar Trabelsi',
        email: 'omar.t@gmail.com',
        region: 'Gafsa',
        status: 'pending',
        item: [{ quantity: 350, reference: 'DEM-2024-005' }],
        createdAt: '2024-03-04',
        dueDate: '2024-03-11',
        description: 'Demande de stock Accessoires'
    },
];

export default function DemandesPage() {
    const navigate = useNavigate();
    // Remplacer MOCK_DEMANDES par votre source de données réelle
    const [demandes, setDemandes] = useState<Demande[]>(MOCK_DEMANDES);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [orderBy, setOrderBy] = useState('all');

    // Filtrage des demandes
    const filteredDemandes = demandes.filter(demande => {
        const matchesSearch =
            demande.item[0].reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.region?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || demande.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Helpers pour le design
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50';
            case 'pending': return 'bg-amber-500/20 text-amber-400 border border-amber-400/50';
            case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-400/50';
            case 'in_progress': return 'bg-blue-500/20 text-blue-400 border border-blue-400/50';
            default: return 'bg-white/10 text-white/70 border border-white/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return 'Approuvée';
            case 'pending': return 'En attente';
            case 'rejected': return 'Rejetée';
            case 'in_progress': return 'En cours';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen relative font-sans text-white">
            {/* Background identique au code 1 */}
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
                                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Gestion des Demandes</h1>
                                <p className="text-white/60 text-xs hidden md:block">Suivi et administration des requêtes clients</p>
                            </div>
                        </div>
                        <button
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={18} /> Nouvelle Demande
                        </button>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

                    {/* Stats rapides (optionnel, mais garde l'esprit du code 1 avec le bloc Mon Compte) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total', value: demandes.length, color: 'text-white' },
                            { label: 'En attente', value: demandes.filter(d => d.status === 'pending').length, color: 'text-amber-400' },
                            { label: 'En cours', value: demandes.filter(d => d.status === 'in_progress').length, color: 'text-blue-400' },
                            { label: 'Approuvées', value: demandes.filter(d => d.status === 'approved').length, color: 'text-emerald-400' },
                        ].map((stat, i) => (
                            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                                <span className="text-white/50 text-[10px] uppercase font-black mb-1">{stat.label}</span>
                                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher par référence, email, client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <select
                                value={orderBy}
                                onChange={(e) => setOrderBy(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
                            >
                                <option value="all" className="bg-slate-900">Trier par</option>
                                <option value="quantite" className="bg-slate-900">Quantité</option>
                                <option value="date" className="bg-slate-900">Date</option>
                                <option value="reference" className="bg-slate-900">Référence</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
                            >
                                <option value="all" className="bg-slate-900">Tous les statuts</option>
                                <option value="pending" className="bg-slate-900">En attente</option>
                                <option value="in_progress" className="bg-slate-900">En cours</option>
                                <option value="approved" className="bg-slate-900">Approuvé</option>
                                <option value="rejected" className="bg-slate-900">Rejeté</option>
                            </select>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p>Chargement des demandes...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left min-w-[800px]">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Région / Date</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Référence / Qté</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredDemandes.map((demande) => (
                                        <tr key={demande.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-amber-500/20 text-amber-400 border border-amber-400/50">
                                                        {demande.client?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-sm truncate max-w-[150px]">{demande.client}</span>
                                                        <span className="text-white/50 text-xs flex items-center gap-1 truncate">
                                                            <Mail size={12} /> {demande.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white/80 text-sm font-bold">{demande.region}</span>
                                                    <span className="text-white/50 text-xs flex items-center gap-1">
                                                        <Clock size={12} /> {demande.createdAt}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {demande.item.map((item, index)=>(<div className="flex flex-col">
                                                    <span className="font-bold text-sm text-blue-400">#{item.reference}</span>
                                                    <span className="text-red-300/70 text-xs font-black tracking-tighter">
                                                        {item.quantity.toLocaleString()} UNITÉS
                                                    </span>
                                                </div>))}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase whitespace-nowrap ${getStatusStyles(demande.status)}`}>
                                                    {getStatusLabel(demande.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all border border-blue-400/30">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-all border border-emerald-400/30">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all border border-red-400/30">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!loading && filteredDemandes.length === 0 && (
                            <div className="py-20 text-center text-white/40">
                                <FileText className="mx-auto mb-4 opacity-20" size={60} />
                                <p className="font-bold">Aucune demande trouvée.</p>
                                <p className="text-xs">Modifiez vos critères de recherche.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}