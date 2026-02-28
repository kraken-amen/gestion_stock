import { useState } from "react"
import { login } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff ,X} from "lucide-react"
import type { Toast } from "../types"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
 const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: 'success' | 'error' = 'error') => {
  const id = Date.now();
  // TypeScript accepte maintenant l'ajout car il sait que c'est un tableau de Toast
  setToasts((prev) => [...prev, { id, message, type }]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 5000);
};
// Fonction de suppression manuel du toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Conteneur principal du formulaire */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
            {/* Header avec logo et titre */}
            <div className="mb-10 text-center">
              {/* Logo circulaire TT */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-white/40 to-white/10 mb-5 border-2 border-white/30 backdrop-blur-md shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-4xl font-black text-white drop-shadow-lg">TT</span>
              </div>
              
              {/* Titre principal */}
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Tunisie Telecom</h1>
              
              {/* Sous-titre */}
              <p className="text-white/70 text-sm font-medium">Vérification de sécurité requise</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Champ Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@tunisietelecom.tn"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-white/20 focus:border-white/50 focus:outline-none transition-all bg-white/5 backdrop-blur-sm focus:bg-white/15 text-white placeholder-white/40 font-medium"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-white/20 focus:border-white/50 focus:outline-none transition-all bg-white/5 backdrop-blur-sm focus:bg-white/15 text-white placeholder-white/40 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi du code...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Lien support */}
            <p className="mt-8 text-center text-white/70 text-sm font-medium">
              Besoin d'aide ?{' '}
              <a href="#" className="text-white font-bold hover:text-amber-300 transition-colors">
                Support IT
              </a>
            </p>
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
            className={`flex items-start gap-4 p-4 rounded-lg backdrop-blur-xl border-2 shadow-lg animate-in slide-in-from-right transition-all duration-300 ${
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

export default Login;