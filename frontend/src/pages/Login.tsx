import { useState } from "react"
import { login } from "../services/authService"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setIsLoading(true);
    const data = await login(email, password)
    loginUser(data)
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated gradient background with TT colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-teal-500 to-yellow-400 opacity-90"></div>
      
      {/* Geometric shapes animation */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-green-500 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-gradient-to-tl from-orange-400 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
            -webkit-text-fill-color: #1f2937 !important;
          }
        `}</style>

        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="backdrop-blur-md bg-white/95 rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Logo Area */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-teal-500 to-green-400 mb-4 transform hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">TT</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                Tunisie Telecom
              </h1>
              <p className="text-gray-600 text-sm mt-2">Connectez-vous à votre compte</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-gray-300 accent-teal-500 cursor-pointer"
                  />
                  <span className="text-gray-700">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Mot de passe oublié?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion...
                  </div>
                ) : (
                  'Connexion'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-gray-500 text-xs font-medium">OU</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-2 px-4 rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all hover:bg-gray-50 font-semibold text-gray-700">
                <span className="text-lg">f</span>
              </button>
              <button className="py-2 px-4 rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all hover:bg-gray-50 font-semibold text-gray-700">
                <span className="text-lg">G</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-gray-700">
              Vous n'avez pas de compte?{' '}
              <a href="#" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Inscrivez-vous
              </a>
            </p>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-white/80 text-xs">
            © 2024 Tunisie Telecom. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login