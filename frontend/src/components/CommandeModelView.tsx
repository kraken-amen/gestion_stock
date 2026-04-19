import { X, Package, Calendar, MapPin, Hash, CreditCard, Tag } from 'lucide-react';
import type { Commande } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    commande: Commande | null;
}

const CommandeModelView = ({ isOpen, onClose, commande }: Props) => {
    if (!isOpen || !commande) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calcul du total
    const totalPrix = commande.items?.reduce((total, item) => 
        total + (item.quantite * (item.product_id?.prix || 0)), 0
    );

    return (
        <div className="font-sans">
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose}></div>

                {/* Modal Content */}
                <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white">
                    
                    {/* Decorative Blurs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 relative z-10 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold">Détails de la Commande</h2>
                            <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                                <Hash size={12} /> ID: {commande._id}
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                        
                        {/* 1. Source de la Commande (Logic Admin/Client) */}
                        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className={`p-2 rounded-lg ${commande.demande_id ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                <Tag size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Origine</p>
                                <p className="text-sm font-bold">
                                    {commande.demande_id 
                                        ? `Client #${commande.demande_id?.user_id?.email.split('@')[0]}` 
                                        : "Création Directe Administrateur"}
                                </p>
                            </div>
                        </div>

                        {/* 2. Infos Générales */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-2 flex items-center gap-1">
                                    <MapPin size={12} /> Région
                                </p>
                                <p className="text-sm font-medium">{commande.region}</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-purple-400 font-bold mb-2 flex items-center gap-1">
                                    <Calendar size={12} /> Date
                                </p>
                                <p className="text-sm font-medium">{formatDate(commande.createdAt)}</p>
                            </div>
                        </div>

                        {/* 3. Statut & Montant */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-center">
                                <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold mb-2 flex items-center gap-1">
                                    <CreditCard size={12} /> Montant Total
                                </p>
                                <p className="text-lg font-black text-white">
                                    {new Intl.NumberFormat('fr-TN', { minimumFractionDigits: 3 }).format(totalPrix)} 
                                    <span className="text-[10px] ml-1 text-white/50">DT</span>
                                </p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-center">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 text-center">Statut</p>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black text-center border ${
                                    commande.status === 'LIVREE' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    commande.status === 'EXPEDIEE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                                }`}>
                                    {commande.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* 4. Section Produits */}
                        <div>
                            <p className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                                <Package size={18} className="text-blue-400" /> Articles de la Commande
                            </p>
                            <div className="space-y-3">
                                {commande.items.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 border-l-4 border-purple-500 rounded-r-xl">
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {item.product_id?.libelle || "Produit Inconnu"}
                                            </p>
                                            <p className="text-[10px] text-white/40">
                                                Prix unitaire: {item.product_id?.prix?.toFixed(3)} DT
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-purple-400">x{item.quantite}</p>
                                            <p className="text-[10px] text-white/40 uppercase">Total: {(item.quantite * (item.product_id?.prix || 0)).toFixed(3)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandeModelView;