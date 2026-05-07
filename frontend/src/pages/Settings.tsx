import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Shield, Trash2, Save, AlertTriangle, Loader2, Eye, EyeOff
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import {
  changePassword,
  getSettings,
  updateSettings,
  deleteAllDemandes,
  deleteAllNotif
} from "../services/settingsService";

interface SETTINGS {
  notifications: {
    demande: boolean;
  };
  business: {
    stockMin: number;
  };
  _id: string;
  user: {
    _id: string;
    email: string;
  };
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showConfirm } = useConfirm();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [stockThreshold, setStockThreshold] = useState(10);
  const [settings, setSettings] = useState<SETTINGS | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data: SETTINGS = await getSettings();
        if (data) {
          setSettings(data);
          setStockThreshold(data?.business?.stockMin ?? 10);
          setEmailNotif(data?.notifications?.demande ?? true);
        }
      } catch (err) {
        addToast("Impossible de charger les paramètres", "error");
      }
    };
    fetchSettings();
  }, [addToast]);

  const handleSave = async () => {
    try {
      if (newPassword && newPassword !== confirmPassword) {
        addToast("Les mots de passe ne correspondent pas", "error");
        return;
      }
      if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
        addToast("Veuillez remplir les deux champs du mot de passe", "error");
        return;
      }

      setSaving(true);

      const updatedData = {
        notifications: { demande: emailNotif },
        business: { stockMin: stockThreshold }
      };

      await updateSettings(updatedData);

      if (currentPassword && newPassword) {
        await changePassword({ currentPassword, newPassword });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      addToast("Paramètres enregistrés avec succès !", "success");
    } catch (err: any) {
      addToast(err?.response?.data?.message || "Une erreur est survenue", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotifications = () => {
    showConfirm(
      "Supprimer les notifications ?",
      "Toutes les notifications seront supprimées définitivement",
      async () => {
        try {
          await deleteAllNotif();
          addToast("Notifications supprimées", "success");
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          addToast("Erreur lors de la suppression", "error");
        }
      }
    );
  };

  const handleDeleteDemandes = () => {
    showConfirm(
      "Supprimer les demandes ?",
      "Toutes les demandes acceptées seront supprimées",
      async () => {
        try {
          await deleteAllDemandes();
          addToast("Demandes supprimées", "success");
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          addToast("Erreur lors de la suppression", "error");
        }
      }
    );
  };

  return (
    <div className="min-h-screen relative font-sans text-white overflow-x-hidden">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // max-w-7xl bech tji wide kima t7eb w px-10 bech tkhali chwaya hsebe 3la jnab
        className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-white/70"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Paramètres
              </h1>
              <p className="text-white/40 text-sm font-medium">Gestion globale du système</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Enregistrer
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left Column: Security */}
          <div className="space-y-6">
            <Section title="Sécurité Compte" icon={<Shield size={18} className="text-blue-400" />}>
              {/* Email - View Only */}
              <Input
                label="ID Utilisateur"
                value={settings?.user?.email || ""}
                disabled
                className="w-full px-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-white/40 cursor-not-allowed opacity-70"
              />

              <div className="space-y-4 pt-2">
                {/* Mot de passe actuel */}
                <div className="relative group">
                  <Input
                    label="Mot de passe actuel"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e: any) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-white/20 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Nouveau mot de passe */}
                <div className="relative group">
                  <Input
                    label="Nouveau mot de passe"
                    type={showConfirmPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e: any) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[38px] text-white/20 hover:text-blue-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirmation Mot de passe */}
                <div className="space-y-1">
                  <Input
                    label="Confirmer le nouveau mot de passe"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: any) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3.5 bg-[#0f172a]/40 border rounded-xl transition-all text-sm ${confirmPassword && newPassword !== confirmPassword
                        ? "border-red-500/50 focus:border-red-500 ring-1 ring-red-500/20"
                        : "border-white/5 focus:border-blue-500/50"
                      }`}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[10px] text-red-400 font-medium px-1 flex items-center gap-1">
                      <AlertTriangle size={10} /> Les mots de passe ne correspondent pas.
                    </p>
                  )}
                </div>
              </div>
            </Section>
          </div>

          {/* Right Column: Stock & Maintenance */}
          <div className="space-y-6">
            <Section title="Configuration Stock" icon={<AlertTriangle size={18} className="text-amber-400" />}>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-white/40 font-bold">
                  Seuil d'alerte global (Quantité)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="200"
                    value={stockThreshold}
                    onChange={(e) => setStockThreshold(parseInt(e.target.value))}
                    className="flex-1 accent-blue-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                  />
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-mono font-bold border border-blue-500/20 min-w-[45px] text-center">
                    {stockThreshold}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 italic">
                  Le système générera une notification automatique quand un produit descend en dessous de cette valeur.
                </p>
              </div>
            </Section>
            {JSON.parse(localStorage.getItem('user') || '{}').role==="administrateur"&& (
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 space-y-4 shadow-xl shadow-red-950/10">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-tighter opacity-80">
                  <Trash2 size={18} />
                  Maintenance & Risques
                </div>
                <button
                  onClick={handleDeleteDemandes}
                  className="w-full py-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 text-sm font-bold transition-all active:scale-[0.98]"
                >
                  SUPPRIMER LES DEMANDES ACCEPTEES
                </button>
                <button
                  onClick={handleDeleteNotifications}
                  className="w-full py-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 text-sm font-bold transition-all active:scale-[0.98]"
                >
                  SUPPRIMER LES NOTIFICATIONS
                </button>
              </div>)}
          </div>
        </div>

        {/* Mobile Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="md:hidden w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 size={20} className="animate-spin" />}
          ENREGISTRER TOUT
        </button>
      </motion.div>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-5 shadow-inner">
      <div className="flex items-center gap-3 text-white/90 font-black text-sm uppercase tracking-widest">
        {icon}
        {title}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="group">
      <label className="text-[11px] uppercase tracking-wider text-white/40 font-bold mb-2 block px-1 group-focus-within:text-blue-400 transition-colors">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3.5 bg-[#0f172a]/40 border border-white/5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm placeholder:text-white/20"
      />
    </div>
  );
}