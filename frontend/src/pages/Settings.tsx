import { useState,useEffect } from "react";
import {
  ArrowLeft, Bell, Shield, Globe, Sun, Moon, Trash2, Save, AlertTriangle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSettings, updateSettings } from "../services/settingsService";

export default function SettingsPage() {
  const navigate = useNavigate();

  // State Management
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [language, setLanguage] = useState("fr");
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);  
  const [stockThreshold, setStockThreshold] = useState(20);

  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      
      if (res && res.data) {
        const data = res.data;
        setSettings(data);
        if (data.business) {
          setStockThreshold(data.business.stockMin ?? 10); 
        }
        
        if (data.notifications) {
          setEmailNotif(data.notifications.demande ?? true);
        }
      }
    } catch (err) {
      console.error("Erreur Fetch Settings:", err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchSettings();
}, []);
  const handleSave = async () => {
    try {
      const updatedData = {
        notifications: { 
          demande: emailNotif,
        },
        business: { 
          stockMin: stockThreshold 
        }
      };
      await updateSettings(updatedData);
      alert("Paramètres enregistrés !");
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  return (
  <div className="min-h-screen relative font-sans text-white overflow-x-hidden">
    {/* 🔥 Background Fixed */}
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900" />

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      {/* HEADER */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ================= PROFILE & SECURITY ================= */}
        <div className="space-y-6">
          <Section title="Sécurité Compte" icon={<Shield size={18} className="text-blue-400" />}>
            <Input 
              label="ID Utilisateur" 
              placeholder="Chargement..." 
              value={settings?.user?.email || ""} 
              readOnly 
            />
            <div className="space-y-3 pt-2">
              <Input
                label="Mot de passe actuel"
                type="password"
                value={currentPassword}
                onChange={(e: any) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
              />
            </div>
          </Section>

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
                  className="flex-1 accent-blue-500 cursor-pointer"
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
        </div>

        {/* ================= NOTIFS & APPEARANCE ================= */}
        <div className="space-y-6">
          <Section title="Préférences Notifications" icon={<Bell size={18} className="text-purple-400" />}>
            <Toggle label="Notifications par Email" value={emailNotif} onChange={setEmailNotif} />
          </Section>

          <Section title="Interface & Langue" icon={<Globe size={18} className="text-emerald-400" />}>
            <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-400" />}
                <p className="text-sm font-medium">Mode Sombre</p>
              </div>
              <ToggleSimple value={darkMode} onChange={setDarkMode} />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[11px] uppercase tracking-wider text-white/40 font-bold px-1">Langue de l'interface</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none text-sm"
              >
                <option value="fr">Français (Standard)</option>
                <option value="en">English (US)</option>
                <option value="ar">العربية (TN)</option>
              </select>
            </div>
          </Section>

          {/* ================= DANGER ZONE ================= */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-4 shadow-xl shadow-red-950/10">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-tighter">
              <Trash2 size={18} />
              Maintenance & Risques
            </div>
            <button className="w-full py-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 text-sm font-bold transition-all active:scale-[0.98]">
              SUPPRIMER LES DEMANDES ACCEPTEES
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE SAVE BUTTON */}
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
);}
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

function Toggle({ label, value, onChange }: any) {
  return (
    <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors group">
      <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{label}</p>
      <ToggleSimple value={value} onChange={onChange} />
    </div>
  );
}

function ToggleSimple({ value, onChange }: any) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
        value ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-white/10"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-lg ${
          value ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}