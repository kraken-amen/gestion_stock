import { X, User, Package, Calendar, Info, Hash } from 'lucide-react';
import type { Demande } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    demande: Demande | null;
}

const DemandeModelView = ({ isOpen, onClose, demande }: Props) => {
    if (!isOpen || !demande) return null;

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                            <h2 className="text-2xl font-bold">Détails de la Demande</h2>
                            <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                                <Hash size={12} /> ID: {demande._id}
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
                        
                        {/* 1. Section Client / Infos Générales */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-2 flex items-center gap-1">
                                    <User size={12} /> Client
                                </p>
                                <p className="text-sm font-medium truncate">{demande.user_id?.email.split('@')[0] || 'Utilisateur'}</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-purple-400 font-bold mb-2 flex items-center gap-1">
                                    <Calendar size={12} /> Date
                                </p>
                                <p className="text-sm font-medium">{formatDate(demande.createdAt)}</p>
                            </div>
                        </div>

                        {/* 2. Statut Badge */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                            <span className="text-sm font-semibold text-white/70">Statut Actuel</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                demande.status === 'ACCEPTEE' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                demande.status === 'REJETEE' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                            }`}>
                                {demande.status}
                            </span>
                        </div>

                        {/* 3. Section Produits */}
                        <div>
                            <p className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                                <Package size={18} className="text-blue-400" /> Articles Demandés
                            </p>
                            <div className="space-y-3">
                                {demande.items.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 border-l-4 border-blue-500 rounded-r-xl">
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {item.product_id?.libelle || item.product_id?.codeArticle || "Produit " + (index + 1)}
                                            </p>
                                            <p className="text-[10px] text-white/40">Réf: {item.product_id?.codeArticle || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-blue-400">{item.quantite}</p>
                                            <p className="text-[10px] text-white/40 uppercase">Unités</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Section Description */}
                        {demande.description && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-orange-400 font-bold mb-2 flex items-center gap-1">
                                    <Info size={12} /> Notes / Description
                                </p>
                                <p className="text-sm text-white/80 leading-relaxed italic">
                                    "{demande.description}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemandeModelView;