import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getStockByRegion } from "../../../services/dashboardService";

const rankColors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#6366f1"];

interface RegionData {
  name: string;
  stock: number;
  rankColor: string;
}

const StockByRegionChart = () => {
  const [data, setData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const result = await getStockByRegion();

      if (Array.isArray(result)) {
        const formattedData = result.map((item: any, index: number) => ({
          name: item._id,
          stock: item.value,
          rankColor: rankColors[index] || rankColors[5]
        }));
        
        setData(formattedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-medium text-sm uppercase tracking-wider opacity-60">Stock par région</h3>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
          Top {data.length}
        </span>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} 
              dy={10} 
            />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}} 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
            />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.rankColor} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockByRegionChart;