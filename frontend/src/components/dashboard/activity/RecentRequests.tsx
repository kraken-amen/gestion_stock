interface Request {
  id: string;
  product: string;
  from: string;
  to: string;
  status: "pending" | "preparing" | "delivered";
  time: string;
}

const statusStyles = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  preparing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

const RecentRequests = () => {
  const data: Request[] = [
    { id: "DEM-112", product: "Modem ADSL v2", from: "Sfax", to: "Gafsa", status: "pending", time: "12 min" },
    { id: "DEM-111", product: "ONT Fibre XG", from: "Tunis", to: "Bizerte", status: "preparing", time: "1h" },
    { id: "DEM-110", product: "Carte SIM Pro", from: "Sousse", to: "Sfax", status: "delivered", time: "3h" },
  ];

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white font-medium text-sm">Dernières demandes</h3>
        <button className="text-[10px] text-white/40 hover:text-white transition-colors uppercase font-bold tracking-widest">
          voir tout →
        </button>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div 
            key={item.id} 
            className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-1">
              <p className="text-[13px] font-bold text-white/90 group-hover:text-blue-400 transition-colors">
                {item.product}
              </p>
              <span className="text-[10px] text-white/20 font-medium">{item.time}</span>
            </div>
            
            <p className="text-[11px] text-white/40 mb-3">
              <span className="text-white/60">{item.id}</span> • {item.from} <span className="text-white/20">→</span> {item.to}
            </p>

            <div className="flex items-center">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${statusStyles[item.status]}`}>
                <div className={`w-1 h-1 rounded-full animate-pulse ${
                  item.status === 'pending' ? 'bg-yellow-400' : 
                  item.status === 'preparing' ? 'bg-blue-400' : 'bg-emerald-400'
                }`} />
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRequests;