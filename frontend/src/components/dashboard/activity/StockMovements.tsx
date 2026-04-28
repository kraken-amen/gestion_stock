const StockMovements = () => {
  const data = [
    { id: "1", type: "entry", product: "+200 ONT Fibre XG", detail: "CMD-088 • Tunis", time: "1h" },
    { id: "2", type: "exit", product: "-120 Modem ADSL v2", detail: "DEM-112 • Gafsa", time: "2h" },
    { id: "3", type: "transfer", product: "+80 Décodeur IPTV", detail: "Tunis → Sousse", time: "4h" },
  ];

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white font-medium text-sm">Mouvements stock</h3>
        <button className="text-[10px] text-white/40 hover:text-blue-400 transition-colors uppercase font-bold tracking-widest">Voir tout</button>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="flex gap-3 relative">
            <div className={`w-1 self-stretch rounded-full ${item.type === 'entry' ? 'bg-emerald-500/40' : item.type === 'exit' ? 'bg-red-500/40' : 'bg-blue-500/40'}`} />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-white/90">{item.product}</p>
              <p className="text-[11px] text-white/40">{item.detail}</p>
              <span className="text-[10px] text-white/20 mt-1 block">{item.time} ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockMovements;