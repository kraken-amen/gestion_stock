import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getStatutsStats } from "../../../services/dashboardService";

const statusColors: Record<string, string> = {
  "En attente": "#f59e0b",
  "En cours": "#3b82f6",
  "Livrées": "#10b981",
  "Rejetées": "#ef4444",
};

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const DemandStatusChart = () => {
  const [data, setData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await getStatutsStats();

      if (Array.isArray(result)) {
        const formattedData = result.map((item: any) => ({
          ...item,
          color: statusColors[item.name] || "#6366f1",
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
    fetchStats();
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (loading) return null;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full">
      <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-wider opacity-60">Statuts demandes</h3>
      
      <div className="h-[180px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              innerRadius={60} 
              outerRadius={80} 
              paddingAngle={5} 
              dataKey="value" 
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white">{total}</span>
          <span className="text-[10px] text-white/40 uppercase">Total</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-white/60">{item.name}</span>
            <span className="text-[10px] text-white font-bold ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemandStatusChart;