import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCcw, X } from 'lucide-react';
import { verifyOTP, resendOTP } from '../services/otpServidce';

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'error' | 'success' }>>([]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ""; // login

  // Fonction pour ajouter une notification toast
  const addToast = (message: string, type: 'error' | 'success' = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Fonction de suppression manuel du toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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

  // Format du timer: affiche les minutes et secondes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      addToast('Complétez le code OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOTP(email, code);
      localStorage.setItem('token', data.token);
      addToast('Vérification réussie! Redirection...', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Code incorrect', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      setTimer(600); // Reset to 10 minutes
      setOtp(['', '', '', '', '', '']);
      addToast('Code renvoyé avec succès', 'success');
    } catch (err) {
      addToast('Erreur lors de l\'envoi du code', 'error');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative font-sans">
      {/* Background avec les couleurs Tunisie Telecom - Bleu sombre et Violet */}
      <div className="absolute inset-0">
        {/* Gradient principal: bleu sombre -> violet */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 opacity-100"></div>
        
        {/* Blob animé bleu */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-600 via-blue-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Blob animé violet */}
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-600 via-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Blob animé bleu-violet au centre */}
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-gradient-to-bl from-indigo-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-15" style={{ animationDelay: '1s' }}></div>

        {/* Effet de lignes ondulées */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" patternUnits="userSpaceOnUse" width="120" height="120">
                <path d="M 0 60 Q 30 40 60 60 T 120 60" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Conteneur principal du formulaire */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
            {/* Header avec icône */}
            <div className="mb-10 text-center">
              {/* Icône protection */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-white/40 to-white/10 mb-5 border-2 border-white/30 backdrop-blur-md shadow-lg">
                <ShieldCheck className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              
              {/* Titre principal */}
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Vérification</h1>
              
              {/* Sous-titre */}
              <p className="text-white/70 text-sm font-medium">
                Code envoyé à <span className="text-blue-300 font-bold">{email}</span>
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Champs OTP */}
              <div className="flex justify-between gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/15 rounded-xl text-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              {/* Bouton de vérification */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    Vérifier <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Section Timer / Resend */}
            <div className="mt-8 text-center text-sm">
              {timer > 0 ? (
                <p className="text-white/70 font-medium">
                  Renvoyer le code dans <span className="text-blue-300 font-bold">{formatTime(timer)}</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-300 hover:text-blue-200 font-bold flex items-center gap-2 mx-auto transition-colors hover:underline"
                >
                  <RefreshCcw size={16} /> Renvoyer un nouveau code
                </button>
              )}
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center text-white/60 text-xs font-medium">
            © 2026 Tunisie Telecom. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Conteneur des notifications Toast */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-4 p-4 rounded-lg backdrop-blur-xl border-2 shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500/20 border-green-400/50 text-green-100'
                : 'bg-red-500/20 border-red-400/50 text-red-100'
            }`}
          >
            {/* Indicateur de couleur */}
            <div
              className={`w-1 h-1 rounded-full mt-1.5 ${
                toast.type === 'success' ? 'bg-green-400' : 'bg-red-400'
              }`}
            ></div>

            {/* Message */}
            <p className="flex-1 font-medium text-sm leading-tight">{toast.message}</p>

            {/* Bouton fermer */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/50 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}