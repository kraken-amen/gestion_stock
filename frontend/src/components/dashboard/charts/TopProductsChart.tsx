const TopProductsChart = () => {
  const data = [
    { name: "Modem ADSL v2", value: 72, color: "bg-blue-500" },
    { name: "ONT Fibre XG", value: 58, color: "bg-purple-500" },
    { name: "Carte SIM Pro", value: 45, color: "bg-cyan-500" },
    { name: "Décodeur IPTV", value: 31, color: "bg-emerald-500" },
  ];

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
