import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle2, PackageSearch } from 'lucide-react';
import { getRegionAlerts } from '../../services/dashregionService';

export default function AlertsRegion() {
  const { name } = useParams<{ name: string }>();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async (regionName: string) => {
      try {
        setLoading(true);
        const res = await getRegionAlerts(regionName);
        setAlerts(res);
      } catch (err) {
        console.error('Erreur Alerts Détails:', err);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      fetchAlerts(normalized);
    }
  }, [name]);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 min-h-[200px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Détails des Alertes
        </h2>
        {!loading && alerts.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
            {alerts.length} ARTICLES
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-white/20">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-xs italic">Analyse du stock en cours...</span>
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.01] ${
                item.status === "Rupture" 
                ? "bg-red-500/10 border-red-500/20 text-red-400" 
                : "bg-amber-500/5 border-amber-500/10 text-amber-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.status === "Rupture" ? "bg-red-500/20" : "bg-amber-500/20"}`}>
                  <PackageSearch size={16} />
                </div>
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {item.productName}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-xs font-black uppercase tracking-tighter">
                  {item.quantite} PIÈCES
                </span>
                <span className="text-[9px] opacity-60 font-bold">
                  {item.status === "Rupture" ? "À RECOMMANDER" : "STOCK FAIBLE"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-emerald-400/50">
            <CheckCircle2 size={32} strokeWidth={1.5} />
            <span className="text-xs font-medium">Stock parfaitement optimisé</span>
          </div>
        )}
      </div>
    </div>
  );
}