import { useState } from "react";
import { ArrowLeft, Package, Inbox, Tag, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock Data
const MOCK_DEPOTS = [
  { id: "1", name: "Dépôt Central Tunis" },
  { id: "2", name: "Dépôt Sfax" },
  { id: "3", name: "Dépôt Sousse" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("configuration");

  // config
  const [allowNegative, setAllowNegative] = useState(false);
  const [minStock, setMinStock] = useState("10");
  const [defaultDepot, setDefaultDepot] = useState("1");

  return (
    <div className="min-h-screen relative font-sans text-white">
      
      {/* 🔥 Background SAME as Demandes */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                Paramètres
              </h1>
              <p className="text-white/50 text-sm">
                Configuration du système
              </p>
            </div>
          </div>

          <div className="hidden md:flex px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            ● Système OK
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: "configuration", label: "Stock", icon: Package },
              { id: "depots", label: "Dépôts", icon: Inbox },
              { id: "units", label: "Unités", icon: Tag },
              { id: "appearance", label: "Interface", icon: Sun },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-3 border transition ${
                    active
                      ? "bg-blue-600/20 border-blue-500 text-white shadow-lg"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-bold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* TITLE */}
              <div className="p-6 border-b border-white/10">
                <h2 className="font-black text-lg uppercase">
                  {activeTab}
                </h2>
              </div>

              <div className="p-6 space-y-6">

                {/* CONFIGURATION */}
                {activeTab === "configuration" && (
                  <>
                    {/* Toggle */}
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <div>
                        <p className="font-bold">Stock négatif</p>
                        <p className="text-xs text-white/50">
                          Autoriser vente sans stock
                        </p>
                      </div>

                      <button
                        onClick={() => setAllowNegative(!allowNegative)}
                        className={`w-12 h-6 rounded-full relative transition ${
                          allowNegative
                            ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                            allowNegative ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Input */}
                    <div>
                      <label className="text-xs text-white/50">
                        Seuil minimum
                      </label>
                      <input
                        type="number"
                        value={minStock}
                        onChange={(e) => setMinStock(e.target.value)}
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border-2 border-white/20 focus:border-white/50 text-white"
                      />
                    </div>

                    {/* Select */}
                    <div>
                      <label className="text-xs text-white/50">
                        Dépôt principal
                      </label>
                      <select
                        value={defaultDepot}
                        onChange={(e) => setDefaultDepot(e.target.value)}
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-white/5 border-2 border-white/20 text-white"
                      >
                        {MOCK_DEPOTS.map((d) => (
                          <option key={d.id} value={d.id} className="bg-slate-900">
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* DEPOTS */}
                {activeTab === "depots" && (
                  <div className="space-y-3">
                    {MOCK_DEPOTS.map((d) => (
                      <div
                        key={d.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* UNITS */}
                {activeTab === "units" && (
                  <div className="space-y-3">
                    {["Pièce", "Kg", "Carton"].map((u) => (
                      <div
                        key={u}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        {u}
                      </div>
                    ))}
                  </div>
                )}

                {/* APPEARANCE */}
                {activeTab === "appearance" && (
                  <div className="space-y-4">
                    <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                      Dark Mode / Light Mode
                    </button>
                  </div>
                )}

                {/* SAVE BUTTON */}
                <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold shadow-lg transition active:scale-95">
                  Enregistrer
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}