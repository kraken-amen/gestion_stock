import { useState } from "react"
import { login } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  // --- LOGIQUE DE CONNEXION ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    setIsLoading(true);

    try {
      // 1. Appel au service login (Backend)
      // Le backend doit renvoyer status 200 et le message "verification_required"
      const response = await login(email, password);

      // 2. Redirection vers la page OTP
      // On passe l'email dans le "state" pour que la page OTP puisse l'utiliser
      if (response) {
        navigate("/otp", { state: { email: email } });
      }

    } catch (error: any) {
      // Gestion des erreurs (Identifiants incorrects, compte bloqué, etc.)
      console.error("Erreur de connexion:", error);
      alert(error.response?.data?.message || "Identifiants invalides");
    } finally {
      setIsLoading(false); // Arrêter l'animation de chargement
    }
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background Decor (Inchangé) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-teal-500 to-yellow-400 opacity-90"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-green-500 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-md bg-white/95 rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-teal-500 to-green-400 mb-4 transform hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">TT</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                Tunisie Telecom
              </h1>
              <p className="text-gray-600 text-sm mt-2">Vérification de sécurité requise</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 hover:shadow-lg transition-all duration-300 disabled:opacity-75 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi du code...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-700 text-sm">
              Besoin d'aide ? <a href="#" className="font-bold text-teal-600">Support IT</a>
            </p>
          </div>
          <p className="mt-6 text-center text-white/80 text-xs">© 2026 Tunisie Telecom.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;