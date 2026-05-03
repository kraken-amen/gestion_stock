import { useEffect, useState } from "react";
import { getRecentCommandes } from "../../../services/dashboardService";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  product: string;
  quantity: number;
  location: string;
  status: string;
}

const statusMapping: Record<string, { label: string; style: string }> = {
  LIVREE: { label: "livree", style: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  EXPEDIEE: { label: "expediee", style: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  EN_PREPARATION: { label: "en preparation", style: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
};

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getRecentCommandes();
        if (Array.isArray(result)) {
          const formatted = result.map((c: any) => ({
            id: c.id.slice(-7).toUpperCase(),
            product: c.productName,
            quantity: c.qty,
            location: c.region || "Tunis",
            status: c.status
          }));
          setOrders(formatted);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full group relative overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white font-medium text-sm uppercase tracking-wider opacity-60">Dernières commandes</h3>
        <button onClick={() => navigate("/commandes")} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase font-bold tracking-widest">
          voir tout →
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((item, index) => {
          const config = statusMapping[item.status] || statusMapping.EN_ATTENTE;
          
          return (
            <div key={index} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center hover:bg-white/[0.06] transition-all duration-300">
              <div>
                <p className="text-[13px] font-bold text-white/90">
                  {item.quantity} <span className="text-white/30 font-normal">×</span> {item.product}
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  <span className="text-white/60 font-mono">#{item.id}</span> • {item.location}
                </p>
              </div>

              <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${config.style}`}>
                {config.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrders;