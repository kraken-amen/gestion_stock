import { useEffect, useState } from "react";
import { getTopProducts } from "../../../services/dashboardService";

interface TopProductData {
  name: string;
  value: number;
  color: string;
}

const TopProductsChart = () => {
  const [data, setData] = useState<TopProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["bg-blue-500", "bg-purple-500", "bg-cyan-500", "bg-emerald-500", "bg-orange-500"];

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const result = await getTopProducts();
      
      if (Array.isArray(result)) {
        const formattedData: TopProductData[] = result.map((item, index) => ({
          name: item.name || "Inconnu",
          value: item.value || 0,
          color: colors[index % colors.length]
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error("Erreur TopProducts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] bg-white/[0.04] rounded-2xl flex items-center justify-center">
        <span className="text-white/20 text-xs animate-pulse">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl group relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
      
      <h3 className="text-white font-medium text-sm mb-6 uppercase tracking-wider opacity-60">Top produits demandés</h3>

      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/80 font-medium">{item.name}</span>
              <span className="text-white/40">{item.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsChart;
