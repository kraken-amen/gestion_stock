import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getRegionChartData } from "../../services/dashregionService";
import { Loader2 } from "lucide-react";
interface ChartData {
  quantite: number;
  product: string;
  color: string;
}

const StockByProductChart = () => {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#06b6d4", "#f59e0b", "#6366f1"];

  const fetchData = async (regionName: string) => {
    try {
      setLoading(true);
      const res = await getRegionChartData(regionName);
      
      const formattedData = res.map((item: any, index: number) => ({
        name: item.product.codeArticle, 
        stock: item.quantite, 
        color: colors[index % colors.length]
      }));
      setData(formattedData);
    } catch (err) {
      console.error("Erreur Chart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      fetchData(normalized);
    }
    
  }, [name]);

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl min-h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-medium text-sm">Stock par produit</h3>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
          {loading ? "Chargement..." : `Top ${data.length}`}
        </span>
      </div>

      <div className="h-[250px] w-full flex items-center justify-center">
        {loading ? (
          <Loader2 className="animate-spin text-white/20" size={32} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'rgba(255, 255, 255, 0.63)', fontSize: 9}} 
                interval={0} 
                angle={-20}  
                textAnchor="end"
                dy={10}
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fff' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={25}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StockByProductChart;