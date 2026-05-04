import{ useEffect, useState } from "react";
import { getRecentMovements } from "../../../services/dashboardService";
import { useNavigate } from "react-router-dom";

interface Movement {
  _id: string;
  productName: string;
  quantity: number;
  time: string;
  region: string;
}

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

const StockMovements = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const data = await getRecentMovements();
        if (Array.isArray(data)) {
          setMovements(data);
        }
      } catch (error) {
        console.error("Error fetching movements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-xl h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-white font-medium text-sm uppercase tracking-wider opacity-60">Mouvements stock</h3>
        <button onClick={() => navigate("/historique")} className="text-[10px] text-white/40 hover:text-white transition-colors uppercase font-bold tracking-widest">
          voir tout →
        </button>
      </div>

      <div className="space-y-4">
        {movements.length > 0 ? (
          movements.map((item) => {
            const isEntry = item.quantity > 100;
            
            return (
              <div key={item._id} className="flex gap-3 relative group">
                <div className={`w-1 self-stretch rounded-full transition-all duration-300 ${
                  isEntry ? 'bg-emerald-500/40 group-hover:bg-emerald-500' : 'bg-red-500/40 group-hover:bg-red-500'
                }`} />
                
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white/90">
                    {isEntry ? `+${item.quantity}` : item.quantity} {item.productName}
                  </p>
                  <p className="text-[11px] text-white/40 italic">
                   Vers:  {item.region}
                  </p>
                  <span className="text-[10px] text-white/20 mt-1 block font-medium">
                    {formatTime(item.time)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white/20 text-xs text-center py-4 italic">Aucun mouvement récent</p>
        )}
      </div>
    </div>
  );
};

export default StockMovements;