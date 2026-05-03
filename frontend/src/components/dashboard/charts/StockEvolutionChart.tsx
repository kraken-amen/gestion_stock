import { useEffect, useState } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Area, AreaChart, CartesianGrid
} from "recharts";

import { getStockEvolution } from "../../../services/dashboardService";

interface DataType {
  date: string;
  stock: number;
}

const StockEvolutionChart = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvolution();
  }, []);

  const fetchEvolution = async () => {
    try {
      setLoading(true);
      const res = await getStockEvolution();
      setData(res);
    } catch (err) {
      console.error("Erreur chart:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-medium text-sm">
            Évolution du stock
          </h3>
          <p className="text-[10px] text-white/40">
            Données réelles
          </p>
        </div>

        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
          LIVE
        </span>
      </div>

      <div className="h-[200px] w-full">

        {loading ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Chargement...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>

              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                dy={10}
              />

              <YAxis hide />

              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#3b82f6' }}
              />

              <Area
                type="monotone"
                dataKey="stock"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorStock)"
              />

            </AreaChart>
          </ResponsiveContainer>
        )}

      </div>
    </div>
  );
};

export default StockEvolutionChart;