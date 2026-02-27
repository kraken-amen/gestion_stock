import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { verifyOTP, resendOTP } from '../services/otpServidce';

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // 1 minute
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ""; // login

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return alert("Complettez le code");

    setLoading(true);
    try {
      const data = await verifyOTP(email, code);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || "Code incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Vérification</h1>
        <p className="text-slate-400 text-center text-sm mb-8">
          Code envoyé à <span className="text-blue-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Vérification..." : "Vérifier"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          {timer > 0 ? (
            <p className="text-slate-500">Renvoyer le code dans <span className="text-blue-400">{timer}s</span></p>
          ) : (
            <button onClick={handleResend} className="text-blue-400 hover:underline font-bold flex items-center gap-2 mx-auto">
              <RefreshCcw size={14} /> Renvoyer un nouveau code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}