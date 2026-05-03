import { useEffect, useState } from "react";
import { getRecentDemandes } from "../../../services/dashboardService";
import type { Product, User } from "../../../types";

interface Request {
  id: string;
  product: Product;
  from: User;
  to: User;
  status: string;
  time: string;
}

// دالة بسيطة باش تحسب الوقت "il y a ..." من غير مكتبات
const formatTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);

  if (diffInMins < 1) return "À l'instant";
  if (diffInMins < 60) return `il y a ${diffInMins} min`;
  if (diffInHours < 24) return `il y a ${diffInHours}h`;
  return past.toLocaleDateString();
};

const statusStyles: Record<string, { label: string; style: string; dot: string }> = {
  EN_ATTENTE: { label: "EN_ATTENTE", style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400" },
  ACCEPTEE: { label: "ACCEPTEE", style: "text-blue-400 bg-blue-400/10 border-blue-400/20", dot: "bg-blue-400" },
  REJETEE: { label: "rejected", style: "text-red-400 bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
};

const RecentRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        const result = await getRecentDemandes();
        if (Array.isArray(result)) {
          const formatted = result.map((d: any) => ({
            id: d.id.slice(-6).toUpperCase(),
            product: d.productName,
            from: d.source || "Dépôt Central",
            to: d.destination || "Région",
            status: d.status,
            time: formatTime(d.time)
          }));
          setRequests(formatted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white font-medium text-sm uppercase tracking-wider opacity-60">Dernières demandes</h3>
        <button className="text-[10px] text-white/40 hover:text-white transition-colors uppercase font-bold tracking-widest">
          voir tout →
        </button>
      </div>

      <div className="space-y-3">
        {requests.map((item, index) => {
          const config = statusStyles[item.status] || statusStyles.EN_ATTENTE;
          return (
            <div key={index} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 group">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[13px] font-bold text-white/90 group-hover:text-blue-400 transition-colors truncate max-w-[140px]">
                  {item.product.codeArticle}
                </p>
                <span className="text-[10px] text-white/20 font-medium whitespace-nowrap ml-2">{item.time}</span>
              </div>
              
              <p className="text-[11px] text-white/40 mb-3">
                <span className="text-white/60">#{item.product.codeArticle}</span> • {item.from.email} <span className="text-white/20">→</span> {item.to.email}
              </p>

              <div className="flex items-center">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${config.style}`}>
                  <div className={`w-1 h-1 rounded-full animate-pulse ${config.dot}`} />
                  {config.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentRequests;