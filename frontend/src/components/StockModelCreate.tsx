import React, { useState, useEffect } from 'react';
import { Package, Hash, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { useToast } from '../context/ToastContext';
import customSelectStyles from './ui/selectStyles';
import { getProducts } from '../services/productService';
import { createStock } from '../services/stockService';

interface PropsStock {
    isOpen: boolean;
    onClose: () => void;
    onStockCreated: () => void;
}

const StockModelCreate = ({ isOpen, onClose, onStockCreated }: PropsStock) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        product_id: '',
        quantite: 0,
    });

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

    const handleClose = () => {
        setFormData({ product_id: '', quantite: 0 });
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.product_id || formData.quantite <= 0) {
            addToast('Veuillez remplir tous les champs correctement', 'error');
            return;
        }

        setLoading(true);
        try {
            const userString = localStorage.getItem('user');
            if (!userString) {
                addToast("Session expirée, veuillez vous reconnecter", "error");
                return;
            }

            const user = JSON.parse(userString);
            const userRegion = user.region;

            if (!userRegion) {
                addToast("Erreur: Région non définie pour cet utilisateur", "error");
                return;
            }

            const finalData = {
                product_id: formData.product_id,
                quantite: Number(formData.quantite),
                region: userRegion,
                enregisted: true
            };

            await createStock(finalData);
            addToast('Stock ajouté avec succès', 'success');
            onStockCreated();
            handleClose();
        } catch (error: any) {
            const message = error.response?.data?.message || "Erreur lors de l'ajout";
            addToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={handleClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Package className="text-blue-400" />
                    Nouveau Stock
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Select Product */}
                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Produit</label>
                        <Select
                            options={products}
                            placeholder="Sélectionner un produit"
                            isSearchable
                            styles={customSelectStyles}
                            onChange={(option) => setFormData({ ...formData, product_id: option?.value || '' })}
                        />
                    </div>

                    {/* Quantité */}
                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Quantité</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="number"
                                value={formData.quantite}
                                onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
                                placeholder="0.00"
                                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-12 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 rounded-xl font-bold text-white/70 hover:bg-white/5 border border-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirmer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockModelCreate;