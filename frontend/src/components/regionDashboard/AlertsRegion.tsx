import { AlertTriangle } from 'lucide-react';

interface Props {
  rupture: number;
  alerte: number;
}

export default function AlertsRegion({ rupture, alerte }: Props) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">

      <h2 className="text-sm font-bold mb-4 text-white/70">
        Alertes
      </h2>

      <div className="space-y-3">

        {rupture > 0 && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle size={16} />
            {rupture} produit(s) en rupture
          </div>
        )}

        {alerte > 0 && (
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <AlertTriangle size={16} />
            {alerte} produit(s) en alerte
          </div>
        )}

        {rupture === 0 && alerte === 0 && (
          <p className="text-green-400 text-sm">
            ✔ Aucun problème détecté
          </p>
        )}

      </div>
    </div>
  );
}