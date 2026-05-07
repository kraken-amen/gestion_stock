import { useState } from "react"
import { login } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, MessageSquare } from "lucide-react"
import { useToast } from "../context/ToastContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const { addToast } = useToast();
  // --- LOGIQUE DE CONNEXION ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page (important !)

    // 1. Validation locale (Avant d'appeler l'API)
    if (!email.trim() || !password.trim()) {
      addToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    // Validation format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Veuillez entrer un email valide', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Appel au service login (Backend) 
      // On utilise l'email et le password d'état
      const response = await login(email, password);

      // 3. Si succès : Redirection vers la page OTP
      // On passe l'email dans le "state" pour la vérification suivante
      if (response) {
        addToast('Identifiants valides. Code envoyé par email.', 'success');

        // Petit délai pour laisser l'utilisateur voir le Toast de succès
        setTimeout(() => {
          navigate("/otp", { state: { email: email } });
        }, 1000);
      }

    } catch (error: any) {
      // 4. Gestion des erreurs (401, 403, 404, etc.)
      console.error("Erreur de connexion:", error);

      // On affiche le message d'erreur du backend s'il existe
      const errorMsg = error.response?.data?.message || "Identifiants invalides";
      addToast(errorMsg, 'error');

    } finally {
      // 5. Arrêter l'animation de chargement dans tous les cas
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Wavy Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md transform transition-all duration-500">
          
          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 border border-white/20">
            
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="group relative inline-block mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl transform hover:scale-110 transition-all duration-500">
                  <img src="/tt.png" alt="TT Logo" className="w-12 h-12 object-contain filter drop-shadow-lg" />
                </div>
              </div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Tunisie Telecom</h1>
              <p className="text-white/60 text-sm font-medium italic">Vérification de sécurité requise</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest ml-1">Email Professionnel</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom.prenom@tunisietelecom.tn"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 focus:border-indigo-500/50 outline-none transition-all bg-white/5 text-white placeholder-white/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-white/10 focus:border-indigo-500/50 outline-none transition-all bg-white/5 text-white placeholder-white/20 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.01] active:scale-[0.98]"
              >
                {isLoading ? "Authentification..." : "Se connecter"}
              </button>
            </form>

            {/* Support Link */}
            <button 
              className="mt-8 w-full text-center text-white/50 text-sm font-medium hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Besoin d'aide ? <span className="font-bold underline decoration-indigo-500 underline-offset-4 text-white"><a href="https://support.tunisietelecom.tn/" target="_blank">Support IT</a></span>
            </button>
          </div>

          <p className="mt-8 text-center text-white/30 text-xs font-medium tracking-widest uppercase">
            © 2026 Tunisie Telecom · Infrastructure Réseau
          </p>
        </div>
      </div>

      {/* --- Support IT Modal --- */}
      
    </div>
  );
};

export default Login;
