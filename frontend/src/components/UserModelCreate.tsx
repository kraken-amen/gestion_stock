import React from 'react'
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createUser } from '../services/userService';
import type { Props } from '../types';

const UserModelCreate = ({ isOpen, onClose, onUserCreated }: Props) => {
    const [formData, setFormData] = useState({
        email: '',  
        password: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createUser(formData);
            onUserCreated();
            handleClose();
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    //close modal
    const handleClose = () => {
        setFormData({ email: '', password: '', role: 'user' });
        setErrors({ email: '', password: '', role: 'user' });
        onClose(); 
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors.email) {
            setErrors(prev => ({
                ...prev,
                email: ''
            }));
        }
    };
    if (!isOpen) return null;
    return (
        <div className="min-h-screen overflow-hidden relative font-sans">
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
                    {/* Le Formulaire */}
                    <h2 className="text-2xl font-bold text-white mb-6">Ajouter un utilisateur</h2>

                    <form className="space-y-4">

                        {/* email */}
                        <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="user@tunisietelecom.com"
                                className={`w-full bg-white/5 backdrop-blur-sm border-2 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium`}
                            />
                            {errors.email && (
                                <p className="text-red-300 text-xs font-medium mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* password */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-white/90 mb-2">Password</label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                    className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium"
                                />
                                {errors.password && (
                                    <p className="text-red-300 text-xs font-medium mt-1">{errors.password}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">User Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:bg-white/10 focus:outline-none transition-all font-medium appearance-none cursor-pointer ">
                                <option value="user" className="bg-slate-900">User</option>
                                <option value="responsable_region" className="bg-slate-900">Regional Responsible</option>
                                <option value="admin" className="bg-slate-900">Administrator</option>
                            </select>
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
                                onClick={handleSubmit}
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

export default UserModelCreate