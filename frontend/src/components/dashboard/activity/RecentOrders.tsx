interface Order {
  id: string;
  product: string;
  quantity: number;
  location: string;
  status: "delivered" | "pending" | "late";
}

const statusStyles = {
  delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  late: "text-red-400 bg-red-400/10 border-red-400/20",
};

const RecentOrders = () => {
  const data: Order[] = [
    { id: "CMD-088", product: "ONT Fibre XG", quantity: 200, location: "Tunis", status: "delivered" },
    { id: "CMD-089", product: "Carte SIM Pro", quantity: 500, location: "Sfax", status: "late" },
    { id: "CMD-090", product: "Routeur WiFi 6", quantity: 80, location: "Sousse", status: "pending" },
  ];

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full group relative overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white font-medium text-sm">Dernières commandes</h3>
        <button className="text-[10px] text-white/30 hover:text-white transition-colors uppercase font-bold tracking-widest">
          voir tout →
        </button>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center hover:bg-white/[0.06] transition-all duration-300">
            <div>
              <p className="text-[13px] font-bold text-white/90">
                {item.quantity} <span className="text-white/30 font-normal">×</span> {item.product}
              </p>
              <p className="text-[11px] text-white/40 mt-0.5">
                <span className="text-white/60 font-mono">{item.id}</span> • {item.location}
              </p>
            </div>

            <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${statusStyles[item.status]}`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;