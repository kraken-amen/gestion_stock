import React, { useState, useEffect } from 'react';
import { Hash, Loader2, Edit3 } from 'lucide-react';
import Select from 'react-select';
import { useToast } from '../context/ToastContext';
import customSelectStyles from './ui/selectStyles';
import { getProducts } from '../services/productService';
import { updateStock } from '../services/stockService';

interface PropsStockUpdate {
    isOpen: boolean;
    onClose: () => void;
    onStockUpdated: () => void;
    stock: any; 
}

const StockModelUpdate = ({ isOpen, onClose, onStockUpdated, stock }: PropsStockUpdate) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    
    const [formData, setFormData] = useState({
        product_id: '',
        quantite: 0,
    });

    useEffect(() => {
        if (isOpen && stock) {
            setFormData({
                product_id: stock.product_id?._id || stock.product_id,
                quantite: stock.quantite || 0,
            });
        }
    }, [isOpen, stock]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                const options = data.map((p: any) => ({
                    value: p._id,
                    label: `${p.codeArticle} - ${p.libelle}`
                }));
                setProducts(options);
            } catch (err) {
                console.error("Erreur produits:", err);
            }
        };
        if (isOpen) fetchProducts();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateStock(stock._id, formData);
            addToast('Modification enregistrée', 'success');
            onStockUpdated();
            onClose();
        } catch (error) {
            addToast("Erreur lors de la modification", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Content - Blue Design */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl"></div>
                
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Edit3 className="text-blue-400" size={24} />
                    Modifier l'article
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Select Product */}
                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Désignation Produit</label>
                        <Select
                            options={products}
                            value={products.find((p: any) => p.value === formData.product_id)}
                            placeholder="Sélectionner un produit"
                            isSearchable
                            styles={customSelectStyles}
                            onChange={(option) => setFormData({ ...formData, product_id: option?.value || '' })}
                        />
                    </div>

                    {/* Quantité */}
                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Nouvelle Quantité</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="number"
                                value={formData.quantite}
                                onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-12 py-3 text-white focus:border-blue-500/50 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Buttons - Blue Theme */}
                    <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="relative cursor-pointer flex-1 py-3 rounded-xl font-bold text-white/70 hover:bg-white/5 border border-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockModelUpdate;