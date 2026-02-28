import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCcw, X, Send } from 'lucide-react';
import { verifyOTP, resendOTP } from '../services/otpServidce'; // Vérifie l'orthographe du fichier

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'error' | 'success' }>>([]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  // --- LOGIQUE DU TIMER PERSISTANT ---
  useEffect(() => {
    // 1. Récupérer la fin de validité stockée ou en créer une nouvelle
    const savedExpiry = localStorage.getItem('otp_expiry');
    let expiryTime: number;

    if (savedExpiry) {
      expiryTime = parseInt(savedExpiry);
    } else {
      expiryTime = Date.now() + 600 * 1000; // 10 mins par défaut
      localStorage.setItem('otp_expiry', expiryTime.toString());
    }

    const calculateRemaining = () => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimer(remaining);
      if (remaining === 0) localStorage.removeItem('otp_expiry');
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const handleResend = async () => {
    try {
      setLoading(true);
      await resendOTP(email);
      
      // Reset du timer dans le localStorage (10 minutes)
      const newExpiry = Date.now() + 600 * 1000;
      localStorage.setItem('otp_expiry', newExpiry.toString());
      setTimer(600);
      
      setOtp(['', '', '', '', '', '']);
      addToast('Un nouveau code a été envoyé', 'success');
    } catch (err) {
      addToast('Erreur lors du renvoi du code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message: string, type: 'error' | 'success' = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      addToast('Veuillez saisir les 6 chiffres', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOTP(email, code);
      localStorage.setItem('token', data.token);
      localStorage.removeItem('otp_expiry'); // Nettoyage après succès
      addToast('Connexion réussie !', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Code invalide', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative font-sans text-white">
      {/* Background (Inchangé) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4 border border-white/20">
                <ShieldCheck className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold">Sécurité</h1>
              <p className="text-white/60 text-sm mt-2">Saisissez le code reçu sur <br/> <span className="text-blue-300">{email}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border-2 border-white/10 focus:border-blue-500 rounded-xl outline-none transition-all"
                  />
                ))}
              </div>

              {/* --- NOUVEAU BOUTON RESEND RAPIDE --- */}
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleResend}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <Send size={12} /> Renvoyer maintenant
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || timer === 0}
                className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Confirmer"} <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              {timer > 0 ? (
                <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                   <span>Expire dans :</span>
                   <span className="text-blue-400 font-mono font-bold">{formatTime(timer)}</span>
                </div>
              ) : (
                <button onClick={handleResend} className="text-blue-400 hover:underline flex items-center gap-2 mx-auto">
                  <RefreshCcw size={16} /> Demander un nouveau code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toasts (Inchangé) */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div key={toast.id} className={`p-4 rounded-lg border-2 backdrop-blur-md flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
            <p className="text-sm">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)}><X size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}