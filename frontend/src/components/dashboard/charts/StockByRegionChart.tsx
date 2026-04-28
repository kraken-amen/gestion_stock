import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Tunis", stock: 12400, color: "#3b82f6" },
  { name: "Sfax", stock: 9800, color: "#8b5cf6" },
  { name: "Sousse", stock: 8200, color: "#06b6d4" },
  { name: "Bizerte", stock: 6100, color: "#10b981" },
  { name: "Gabès", stock: 4300, color: "#f59e0b" },
  { name: "Gafsa", stock: 1520, color: "#ef4444" },
];

const StockByRegionChart = () => {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-medium text-sm">Stock par région</h3>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">6 Régions</span>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} dy={10} />
            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockByRegionChart;