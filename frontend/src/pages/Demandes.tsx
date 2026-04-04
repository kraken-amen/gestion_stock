import { useState, useEffect } from 'react';
import { Search, Filter, Plus, ArrowLeft, Power, Edit2, Trash2, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from '../components/ui/Select';
import type { Demande } from '../types';

// Données mock
const MOCK_DEMANDES: Demande[] = [
    {
        id: '1',
        reference: 'DEM-2024-001',
        client: 'Mohamed Ahmed',
        email: 'med.ahmed@gmail.com',
        region: 'Tunis',
        status: 'pending',
        quantity: 500,
        createdAt: '2024-03-08',
        dueDate: '2024-03-15',
        description: 'Demande de stock iPhone 15 Pro'
    },
    {
        id: '2',
        reference: 'DEM-2024-002',
        client: 'Fatima Bousselmi',
        email: 'fatima.b@gmail.com',
        region: 'Sfax',
        status: 'in_progress',
        quantity: 250,
        createdAt: '2024-03-07',
        dueDate: '2024-03-12',
        description: 'Demande de service installation'
    },
    {
        id: '3',
        reference: 'DEM-2024-003',
        client: 'Ali Mansour',
        email: 'ali.mansour@gmail.com',
        region: 'Sousse',
        status: 'approved',
        quantity: 1000,
        createdAt: '2024-03-06',
        dueDate: '2024-03-10',
        description: 'Demande de stock Samsung Galaxy'
    },
    {
        id: '4',
        reference: 'DEM-2024-004',
        client: 'Zahra Khalifa',
        email: 'zahra.k@gmail.com',
        region: 'Kairouan',
        status: 'rejected',
        quantity: 100,
        createdAt: '2024-03-05',
        dueDate: '2024-03-09',
        description: 'Demande de maintenance'
    },
    {
        id: '5',
        reference: 'DEM-2024-005',
        client: 'Omar Trabelsi',
        email: 'omar.t@gmail.com',
        region: 'Gafsa',
        status: 'pending',
        quantity: 350,
        createdAt: '2024-03-04',
        dueDate: '2024-03-11',
        description: 'Demande de stock Accessoires'
    },
];

export default function DemandesPage() {
    const navigate = useNavigate();
    const [demandes, setDemandes] = useState<Demande[]>(MOCK_DEMANDES);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filtrer les demandes
    const filteredDemandes = demandes.filter(demande => {
        const matchesSearch =
            demande.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || demande.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Fonctions pour les statuts
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="text-emerald-400" />;
            case 'pending': return <Clock size={16} className="text-amber-400" />;
            case 'rejected': return <AlertCircle size={16} className="text-red-400" />;
            case 'in_progress': return <TrendingUp size={16} className="text-blue-400" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50';
            case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-400/50';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-400/50';
            case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-400/50';
            default: return 'bg-white/10 text-white/70';
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
        <div className="min-h-screen overflow-hidden relative font-sans bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 p-6">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-600 via-blue-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-600 via-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-white drop-shadow-lg">Gestion des Demandes</h1>
                            <p className="text-white/70 text-sm font-medium mt-1">Administration et suivi des demandes</p>
                        </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6">
                        <Plus size={18} className="mr-2" />
                        Nouvelle Demande
                    </Button>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {/* Search */}
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                            type="text"
                            placeholder="Rechercher par référence, client ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 bg-white/5 border-white/20 focus:border-white/50 text-white placeholder:text-white/40"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-white/5 border-white/20 focus:border-white/50 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="in_progress">En cours</SelectItem>
                            <SelectItem value="approved">Approuvée</SelectItem>
                            <SelectItem value="rejected">Rejetée</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Card className="bg-slate-900/80 border-white/20 shadow-2xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-6 py-4 text-left text-xs font-black text-white/80 uppercase tracking-wider">Référence</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-white/80 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-white/80 uppercase tracking-wider">Région</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-white/80 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-white/80 uppercase tracking-wider">Quantité</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-white/80 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredDemandes.map((demande) => (
                                        <tr key={demande.id} className="hover:bg-white/5 transition-colors group">
                                            {/* Reference */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">{demande.reference}</span>
                                                    <span className="text-white/70 text-xs mt-1">{demande.createdAt}</span>
                                                </div>
                                            </td>

                                            {/* Client */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                                                        {demande.client.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold text-sm">{demande.client}</span>
                                                        <span className="text-white/70 text-xs">{demande.email}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Region */}
                                            <td className="px-6 py-4">
                                                <span className="text-white/70 text-sm font-medium">{demande.region}</span>
                                            </td>
                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(demande.status)}
                                                    <Badge className={`${getStatusColor(demande.status)} border`}>
                                                        {getStatusLabel(demande.status)}
                                                    </Badge>
                                                </div>
                                            </td>

                                            {/* Quantity */}
                                            <td className="px-6 py-4">
                                                <span className="text-blue-300 font-bold text-sm">{demande.quantity.toLocaleString()}</span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all border border-blue-400/50">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-all border border-emerald-400/50">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all border border-red-400/50">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredDemandes.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-white/70 font-medium mb-2">Aucune demande trouvée</p>
                                <p className="text-white/50 text-sm">Essayez de modifier vos filtres</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <Card className="bg-slate-900/80 border-white/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold">Total Demandes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-white drop-shadow-lg">{demandes.length}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/80 border-white/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold">En attente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-amber-400 drop-shadow-lg">
                                {demandes.filter(d => d.status === 'pending').length}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/80 border-white/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold">En cours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-blue-400 drop-shadow-lg">
                                {demandes.filter(d => d.status === 'in_progress').length}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/80 border-white/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold">Approuvées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-emerald-400 drop-shadow-lg">
                                {demandes.filter(d => d.status === 'approved').length}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}