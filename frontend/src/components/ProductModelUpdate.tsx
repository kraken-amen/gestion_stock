import React, { useState, useEffect } from 'react';
import { updateProduct } from '../services/productService';
import type { ProductPropsUpdate } from '../types';
import { useToast } from '../context/ToastContext';
import { Edit3, Hash, Type, Info, DollarSign } from 'lucide-react';



const ProductModelUpdate = ({ isOpen, onClose, onProductUpdated, product }: ProductPropsUpdate) => {
    const [formData, setFormData] = useState({
        codeArticle: '',
        libelle: '',
        quantite: 0,
        unite: 'Pièce',
        prix: 0
    });

    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                codeArticle: product.codeArticle,
                libelle: product.libelle,
                quantite: product.quantite,
                unite: product.unite,
                prix: product.prix
            });
        }
    }, [product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product?._id) return;

        setLoading(true);
        try {
            await updateProduct(product._id, formData);
            onProductUpdated();
            onClose();
            addToast('Produit mis à jour avec succès', 'success');
        } catch (error) {
            addToast('Erreur lors de la mise à jour', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantite' || name === 'prix' ? Number(value) : value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-900 border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Edit3 size={24} className="text-yellow-400" />
                    Modifier le produit
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                            <Hash size={14} /> Code Article
                        </label>
                        <input 
                            type="text" 
                            name="codeArticle" 
                            value={formData.codeArticle} 
                            onChange={handleInputChange} 
                            className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" 
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                            <Type size={14} /> Libellé
                        </label>
                        <input 
                            type="text" 
                            name="libelle" 
                            value={formData.libelle} 
                            onChange={handleInputChange} 
                            className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                                <Info size={14} /> Quantité
                            </label>
                            <input 
                                type="number" 
                                name="quantite" 
                                value={formData.quantite} 
                                onChange={handleInputChange} 
                                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-white/90 mb-2 block">Unité</label>
                            <select 
                                name="unite" 
                                value={formData.unite} 
                                onChange={handleInputChange} 
                                className="w-full bg-slate-800 border-2 border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer"
                            >
                                <option value="Pièce">Pièce</option>
                                <option value="Mètre">Mètre</option>
                                <option value="Rouleau">Rouleau</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                            <DollarSign size={14} /> Prix (DT)
                        </label>
                        <input 
                            type="number" 
                            name="prix" 
                            value={formData.prix} 
                            onChange={handleInputChange} 
                            className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" 
                        />
                    </div>

                    <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3 rounded-xl font-bold text-white/70 hover:bg-white/5 border border-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Mise à jour...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModelUpdate;