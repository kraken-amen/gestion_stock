import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Warehouse, AlertTriangle, FileText, MoreHorizontal, Loader2 } from 'lucide-react';
import { getRegionKPIs } from '../../services/dashregionService';

export default function KPISectionRegion() {
  const { regionName } = useParams<{ regionName: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    totalProduits: 0,
    stockGlobal: 0,
    stockFaible: 0,
    demandesAttente: 0
  });

  const fetchData = async (regionName: string) => {
    try {
      setLoading(true);
      const res = await getRegionKPIs(regionName);
      setData(res);
    } catch (err) {
      console.error('Erreur KPI:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
    return;
  }

  if (!regionName) {
    navigate('/dashboard');
    return;
  }

  fetchData(regionName);

}, [regionName, navigate]);

  const kpiConfig = [
    {
      label: 'TOTAL PRODUITS',
      value: data.totalProduits,
      subValue: 'dans le catalogue',
      icon: <Box size={20} />,
      color: 'blue'
    },
    {
      label: 'STOCK GLOBAL',
      value: loading ? '...' : data.stockGlobal.toLocaleString(),
      subValue: 'Unités totales',
      isTrend: true,
      icon: <Warehouse size={20} />,
      color: 'purple'
    },
    {
      label: 'STOCK FAIBLE',
      value: data.stockFaible,
      subValue: data.stockFaible > 0 ? 'Action requise' : 'Stock sain',
      isUrgent: data.stockFaible > 0,
      icon: <AlertTriangle size={20} />,
      color: 'red'
    },
    {
      label: 'DEMANDES',
      value: data.demandesAttente,
      subValue: 'En attente de validation',
      icon: <FileText size={20} />,
      color: 'amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiConfig.map((item) => (
        <div
          key={item.label}
          className="relative group backdrop-blur-2xl bg-[#1a1c3d]/50 border border-white/5 rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:bg-[#1a1c3d]/80"
        >
          <div className="flex justify-between items-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
              ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : ''}
              ${item.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : ''}
              ${item.color === 'red' ? 'bg-red-500/10 text-red-400' : ''}
              ${item.color === 'amber' ? 'bg-amber-500/10 text-yellow-500' : ''}
            `}>
              {item.icon}
            </div>
            <button className="text-white/20 hover:text-white/50">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
              {item.label}
            </p>

            {loading ? (
              <Loader2 className="animate-spin text-white/20" size={24} />
            ) : (
              <p className="text-4xl font-black text-white tracking-tight">
                {item.value}
              </p>
            )}

            <div className="flex items-center gap-1">
              {item.isTrend && !loading && (
                <span className="text-emerald-400 text-xs">↗</span>
              )}
              <p className={`text-[11px] font-medium ${item.isUrgent ? 'text-red-400' :
                  item.isTrend ? 'text-emerald-400' : 'text-white/30'
                }`}>
                {item.subValue}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}