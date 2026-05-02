import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
const data = [
  { name: "Modem ADSL v2", stock: 2450, color: "#3b82f6" },
  { name: "ONT Fibre XG", stock: 1800, color: "#8b5cf6" },
  { name: "Carte SIM Pro", stock: 4200, color: "#10b981" },
  { name: "Routeur WiFi 6", stock: 950, color: "#06b6d4" },
  { name: "Décodeur IPTV", stock: 600, color: "#f59e0b" },
  { name: "Câble Optique", stock: 3100, color: "#6366f1" },
];

const StockByProductChart = () => {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-medium text-sm">Stock par produit</h3>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Top 6 Produits</span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 9}} 
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
            />
            <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={25}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockByProductChart;