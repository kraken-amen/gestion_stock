import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "En attente", value: 7, color: "#f59e0b" },
  { name: "En cours", value: 5, color: "#3b82f6" },
  { name: "Livrées", value: 43, color: "#10b981" },
  { name: "Rejetées", value: 2, color: "#ef4444" },
];

const DemandStatusChart = () => {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full">
      <h3 className="text-white font-medium text-sm mb-4">Statuts demandes</h3>
      
      <div className="h-[180px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
        {/* El Katiba eli fi west el Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white">62</span>
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