import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { ConfirmModalProps } from "../types";


const ConfirmModal = ({ config, onClose }: ConfirmModalProps) => {
    const [inputValue, setInputValue] = useState('');

    const isMatch = inputValue.trim() === String(config.confirmValue).trim();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                {/* Icon & Title */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <AlertTriangle size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{config.title}</h2>
                    <p className="text-white/60 text-sm mt-2 leading-relaxed">
                        Cette action est irréversible. Pour confirmer, veuillez saisir : 
                        <br />
                        <span className="font-mono font-black text-red-400 text-base">{config.confirmValue}</span>
                    </p>
                </div>

                {/* Input Section */}
                <div className="space-y-4">
                    <input
                        type="text"
                        autoFocus
                        className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-red-500/50 focus:bg-white/10 focus:outline-none transition-all font-medium text-center"
                        placeholder="Saisir la confirmation..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="relative flex-1 py-3 rounded-xl font-bold text-white/70 hover:bg-white/5 border border-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            disabled={!isMatch}
                            onClick={() => {
                                config.onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${
                                isMatch 
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-900/20' 
                                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                            }`}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;