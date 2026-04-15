import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import { createCommande } from '../services/commandeService';
import { Region } from '../utils/region';
import type { PropsCommande, Product } from '../types';
import { useToast } from '../context/ToastContext';
import Select from 'react-select';
import { Plus, X } from 'lucide-react';
import customSelectStyles from './ui/selectStyles';

const CommandeModelCreate = ({ isOpen, onClose, onCommandeCreated }: PropsCommande) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<{ value: string; label: string }[]>([]);
    const [regions, setRegions] = useState<{ value: string; label: string }[]>([]);

    const [formData, setFormData] = useState({
        region: '',
        items: [{ product_id: '', quantite: '' }],
        description: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, regRes] = await Promise.all([
                    getAllProducts(),
                    Region
                ]);

                const prodData = prodRes.data || prodRes;
                setProducts(prodData.map((p: Product) => ({
                    value: p._id,
                    label: p.libelle
                })));

                // const regData: Region[] = regRes.data || regRes;
                // setRegions(regData.map((r: Region) => ({
                //     value: r._id,
                //     label: r.nom
                // })));
            } catch (error) {
                console.error("Erreur fetching data:", error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { product_id: '', quantite: '' }]
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const updateItem = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.region) {
            addToast('Veuillez sélectionner une région', 'error');
            return;
        }

        const isValid = formData.items.every(item => item.product_id && item.quantite);
        if (!isValid) {
            addToast('Veuillez remplir tous les produits et quantités', 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                region: formData.region,
                items: formData.items.map(item => ({
                    product_id: item.product_id,
                    quantite: Number(item.quantite)
                })),
                description: formData.description
            };

            await createCommande(payload);
            addToast('Commande créée avec succès', 'success');
            onCommandeCreated();
            handleClose();
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Erreur lors de la création', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ region: '', items: [{ product_id: '', quantite: '' }], description: '' });
        onClose();
    };

    return (
        <div className="font-sans">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={handleClose}></div>

                    <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-bold text-white">Nouvelle Commande Directe</h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-2 text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                            >
                                <Plus size={16} /> Ajouter Produit
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">

                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <label className="block text-xs font-semibold text-white/70 mb-1.5">Région Destinataire</label>
                                <Select
                                    options={regions}
                                    placeholder="Sélectionner la région..."
                                    styles={customSelectStyles}
                                    value={regions.find(opt => opt.value === formData.region)}
                                    onChange={(option) => setFormData({ ...formData, region: option?.value || '' })}
                                />
                            </div>

                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="relative p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-20"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}

                                        <div>
                                            <label className="block text-xs font-semibold text-white/70 mb-1.5">Produit #{index + 1}</label>
                                            <Select
                                                options={products}
                                                placeholder="Choisir un article..."
                                                styles={customSelectStyles}
                                                value={products.find(opt => opt.value === item.product_id)}
                                                onChange={(option) => updateItem(index, 'product_id', option?.value || '')}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-white/70 mb-1.5">Quantité</label>
                                            <input
                                                type="number"
                                                value={item.quantite}
                                                onChange={(e) => updateItem(index, 'quantite', e.target.value)}
                                                placeholder="Ex: 500"
                                                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:border-white/40 focus:outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-white/90 mb-2">Description (Optionnel)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Remarques éventuelles..."
                                    rows={2}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-white/50 focus:outline-none transition-all font-medium resize-none text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-transparent backdrop-blur-sm">
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
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Envoi...' : 'Créer Commande'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommandeModelCreate;