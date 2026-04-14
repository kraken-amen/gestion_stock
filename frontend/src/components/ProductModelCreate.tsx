import React from 'react'
import { useState } from 'react';
import { createProduct } from '../services/productService';
import type { ProductProps } from '../types';
import { useToast } from '../context/ToastContext';
import { Box, Hash, Type, Info } from 'lucide-react';

const ProductModelCreate = ({ isOpen, onClose, onProductCreated }: ProductProps) => {
    const [formData, setFormData] = useState({
        codeArticle: '',
        libelle: '',
        quantite: 0,
        unite: 'Pièce',
        prix: 0
    });

    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation simple
        if (!formData.codeArticle.trim() || !formData.libelle.trim()) {
            addToast('Veuillez remplir les champs obligatoires', 'error');
            return;
        }

        if (formData.quantite < 0 || formData.prix < 0) {
            addToast('La quantité et le prix ne peuvent pas être négatifs', 'error');
            return;
        }

        setLoading(true);
        try {
            await createProduct(formData);
            onProductCreated();
            handleClose();
            addToast('Produit ajouté avec succès', 'success');
        } catch (error) {
            console.error("Erreur:", error);
            addToast('Erreur lors de l\'ajout du produit', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            codeArticle: '',
            libelle: '',
            quantite: 0,
            unite: 'Pièce',
            prix: 0
        });
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantite' || name === 'prix' ? Number(value) : value
        }));
    };

    return (
        <div className="relative font-sans">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Dark Overlay */}
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                        onClick={handleClose}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Box size={24} className="text-blue-400" />
                            Ajouter un produit
                        </h2>

                        <form className="space-y-4" onSubmit={handleSubmit}>

                            {/* Code Article */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                                    <Hash size={14} /> Code Article
                                </label>
                                <input
                                    type="text"
                                    name="codeArticle"
                                    value={formData.codeArticle}
                                    onChange={handleInputChange}
                                    placeholder="Ex: MOD-TT-01"
                                    className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium"
                                />
                            </div>

                            {/* Libelle */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                                    <Type size={14} /> Libellé
                                </label>
                                <input
                                    type="text"
                                    name="libelle"
                                    value={formData.libelle}
                                    onChange={handleInputChange}
                                    placeholder="Désignation du produit"
                                    className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Quantité */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                                        <Info size={14} /> Quantité
                                    </label>
                                    <input
                                        type="number"
                                        name="quantite"
                                        placeholder='0'
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium"
                                    />
                                </div>

                                {/* Unite */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                                        Unité
                                    </label>
                                    <select
                                        name="unite"
                                        value={formData.unite}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="Pièce" className="bg-slate-900">Pièce</option>
                                        <option value="Mètre" className="bg-slate-900">Mètre</option>
                                        <option value="Rouleau" className="bg-slate-900">Rouleau</option>
                                    </select>
                                </div>
                            </div>

                            {/* Prix */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                                    Prix (DT)
                                </label>
                                <input
                                    type="number"
                                    name="prix"
                                    onChange={handleInputChange}
                                    placeholder="0.000"
                                    className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="relative flex-1 py-3 rounded-xl font-bold text-white/70 hover:bg-white/5 border border-white/10 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Ajout en cours...' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductModelCreate;