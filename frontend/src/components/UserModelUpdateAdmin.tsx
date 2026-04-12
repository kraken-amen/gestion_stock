import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { updateUser } from '../services/userService';
import type { PropsUserUpdate } from '../types';
import { useToast } from '../context/ToastContext';

/**
 * Composant de mise à jour des informations utilisateur.
 * @param isOpen - État d'ouverture du modal.
 * @param onClose - Fonction pour fermer le modal.
 * @param onUserUpdated - Callback après une mise à jour réussie.
 * @param user - Les données de l'utilisateur à modifier.
 */
const UserModelUpdateAdmin = ({ isOpen, onClose, onUserUpdated, user }: PropsUserUpdate) => {
    // État local pour gérer les données du formulaire
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { addToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Synchroniser les données du formulaire avec l'utilisateur sélectionné
     * dès que le modal s'ouvre ou que l'utilisateur change.
     */
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                email: user.email || '',
                password: '', // Le mot de passe reste vide par défaut (sécurité)
            });
        }
    }, [user, isOpen]);

    /**
     * Gère la soumission du formulaire vers le backend.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email.trim()) {
            addToast('Veuillez remplir tous les champs', 'error');
            return;
        }
        // Validation format email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            addToast('Veuillez entrer un email valide', 'error');
            return;
        }
        if (formData.password.length < 8 && formData.password.length !== 0) {
            addToast('Le mot de passe doit contenir au moins 8 caractères', 'error');
            return;
        }
        setLoading(true);
        try {
            // Appel au service de mise à jour
            await updateUser(user._id,formData.email, formData.password);
            
            // Notification au composant parent pour rafraîchir la liste
            onUserUpdated(); 
            
            // Fermeture du modal
            onClose();      
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Gère les changements dynamiques des champs de saisie.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Si le modal n'est pas ouvert, on ne rend rien (optimisation)
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Arrière-plan sombre avec effet de flou */}
            <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" 
                onClick={onClose}
            ></div>

            {/* Contenu principal du Modal */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Modifier l'utilisateur</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Champ Email (Désactivé car c'est souvent l'identifiant unique) */}
                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Adresse Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white/50 font-medium"
                        />
                    </div>

                    {/* Champ Mot de passe avec option de visibilité */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-white/90 mb-2">Nouveau mot de passe (Optionnel)</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={handleInputChange}
                                placeholder="Laisser vide pour ne pas changer"
                                className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:border-blue-500/50 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {/* Actions : Annuler ou Enregistrer */}
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
                            onClick={handleSubmit}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Mise à jour...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserModelUpdateAdmin;