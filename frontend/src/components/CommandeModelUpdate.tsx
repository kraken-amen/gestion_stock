import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { updateCommande } from '../services/commandeService'; 
import { Region } from '../utils/region';
import type { PropsCommandeUpdate, Product } from '../types';
import { useToast } from '../context/ToastContext';
import Select from 'react-select';
import { Plus, X, Save } from 'lucide-react';
import customSelectStyles from './ui/selectStyles';

const CommandeModelUpdate = ({ isOpen, onClose, onCommandeUpdated, commande }: PropsCommandeUpdate) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<{ value: string; label: string }[]>([]);
    const [regions, setRegions] = useState<{ value: string; label: string }[]>([]);

    const [formData, setFormData] = useState({
        region: '',
        items: [{ product_id: '', quantite: '' }],
        description: ''
    });

    // 1. Fetch data (Products & Regions)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await getProducts();
                const prodData = prodRes.data || prodRes;
                setProducts(prodData.map((p: Product) => ({
                    value: p._id,
                    label: p.libelle
                })));

                setRegions(Region.map((r: { value: string; label: string }) => ({
                    value: r.value,
                    label: r.label
                })));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isOpen) fetchData();
    }, [isOpen]);

    // 2. Sync Form with Commande Data when Modal Opens
    useEffect(() => {
        if (isOpen && commande) {
            setFormData({
                region: commande.region || '',
                items: commande.items?.map((item: any) => ({
                    // Fix TypeScript error: handle both string ID or populated Object
                    product_id: typeof item.product_id === 'object' ? item.product_id?._id : item.product_id,
                    quantite: item.quantite.toString()
                })) || [{ product_id: '', quantite: '' }],
                description: commande.description || ''
            });
        }
    }, [isOpen, commande]);

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
        
        // Validation simple
        if (!formData.region || formData.items.some(i => !i.product_id || !i.quantite)) {
            addToast('Veuillez remplir tous les champs obligatoires', 'error');
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

            await updateCommande(commande._id, payload);
            addToast('Commande mise à jour avec succès', 'success');
            onCommandeUpdated();
            onClose();
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
    <div className="font-sans fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-white italic">Modifier Commande</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                        REF: {commande._id.slice(-8)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                >
                    <Plus size={16} /> Ajouter Produit
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Region Select */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">Région Destinataire</label>
                    <Select
                        options={regions}
                        placeholder="Sélectionner une région..."
                        styles={customSelectStyles}
                        value={regions.find(opt => opt.value === formData.region)}
                        onChange={(option) => setFormData({ ...formData, region: option?.value || '' })}
                    />
                </div>

                {/* Items List */}
                <div className="space-y-4">
                    {formData.items.map((item, index) => (
                        <div key={index} className="relative p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                            {formData.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg z-20 transition-transform hover:scale-110"
                                >
                                    <X size={14} />
                                </button>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-white/70 mb-1.5 italic">Produit #{index + 1}</label>
                                <Select
                                    options={products}
                                    placeholder="Choisir l'article..."
                                    styles={customSelectStyles}
                                    value={products.find(opt => opt.value === item.product_id)}
                                    onChange={(option) => updateItem(index, 'product_id', option?.value || '')}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase">Quantité</label>
                                <input
                                    type="number"
                                    value={item.quantite}
                                    onChange={(e) => updateItem(index, 'quantite', e.target.value)}
                                    placeholder="Ex: 100"
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500/50 focus:outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Description Area */}
                <div className="pt-2">
                    <label className="block text-sm font-semibold text-white/90 mb-2">Notes / Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Informations supplémentaires..."
                        rows={2}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-all resize-none text-sm"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-slate-900/10 backdrop-blur-md pb-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-white/50 hover:bg-white/5 border border-white/10 transition-all hover:text-white"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <><Save size={18}/> Enregistrer</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default CommandeModelUpdate;