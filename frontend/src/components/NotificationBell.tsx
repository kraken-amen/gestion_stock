import { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck,Package,ShoppingCart,FileText} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../services/notifService";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "DEMANDE" | "COMMANDE" | "STOCK" | "INFO";
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifs(data);
    } catch (err) {
      console.error("Notif error:", err);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifs.filter(n => !n.isRead).length;
  const handleNotificationClick = async (notif: Notification) => {
    try {
      await markAsRead(notif._id);
      switch (notif.type) {
        case "DEMANDE":
          navigate("/demandes");
          break;
        case "COMMANDE":
          navigate("/commandes");
          break;
        case "STOCK":
          navigate("/products");
          break;
        default:
          console.log("Notif info simple");
      }
      await deleteNotification(notif._id);
      setNotifs(prev => prev.filter(n => n._id !== notif._id));
      setOpen(false); 

    } catch (err) {
      console.error("Error handling notif click:", err);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllAsRead();
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
      >
        <Bell size={22} className="text-white/80" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0f172a] animate-pulse" />
        )}
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 backdrop-blur-md bg-[#161b2c]/90 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-white/70">Notifications</h4>
              {unreadCount > 0 && (
                <button 
                  onClick={handleReadAll}
                  className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold transition-colors"
                >
                  <CheckCheck size={12} /> Tout marquer lu
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
              {notifs.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-xs text-white/30 italic">Aucune notification</p>
                </div>
              ) : (
                notifs.map(n => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)} 
                    className={`p-4 border-b border-white/5 cursor-pointer transition-all flex gap-3 group relative ${
                      n.isRead ? 'opacity-60' : 'bg-blue-500/5'
                    } hover:bg-white/5`}
                  >
                    {n.type === 'STOCK' && (<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-red-500/20 text-red-400">
                      <Package size={16} />
                    </div>)}
                    {n.type === 'COMMANDE' && (<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-500/20 text-blue-400">
                      <ShoppingCart size={16} />
                    </div>)}
                    {n.type === 'DEMANDE' && (<div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-500/20 text-green-400">
                      <FileText size={16} />
                    </div>)}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[13px] font-bold text-white/90 leading-tight">{n.title}</p>
                        {!n.isRead && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-white/50 leading-snug mb-1">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}