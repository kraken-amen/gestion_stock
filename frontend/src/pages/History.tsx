import { useEffect, useState, useMemo, type JSX } from 'react';
import {
  ArrowLeft, Loader2, Search, ArrowRightLeft,
  ArrowDownCircle, ArrowUpCircle, RefreshCw, Package,
  User, Calendar, Clock, ChevronDown, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMovements } from '../services/historyServices';

interface Movement {
  _id: string;
  product_id: { _id: string; libelle: string; codeArticle: string } | null;
  from: { email: string } | null;
  to: { email: string } | null;
  type: 'entree' | 'sortie' | 'transfert' | string;
  quantite: number;
  dateMovement: string;
  region?: string;
  note?: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: JSX.Element }> = {
  entree: {
    label: 'Entrée',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    icon: <ArrowDownCircle size={14} />,
  },
  sortie: {
    label: 'Sortie',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/40',
    icon: <ArrowUpCircle size={14} />,
  },
  transfert: {
    label: 'Transfert',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/40',
    icon: <ArrowRightLeft size={14} />,
  },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type?.toLowerCase()] ?? {
    label: type,
    color: 'text-white/60',
    bg: 'bg-white/10',
    border: 'border-white/20',
    icon: <RefreshCw size={14} />,
  };

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const res = await getMovements();
      setMovements(Array.isArray(res) ? res : res.data ?? []);
    } catch (err) {
      console.error('Erreur chargement historique:', err);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchMovements();
  }, [navigate]);

  const filtered = useMemo(() => {
    const now = new Date();
    return movements.filter(m => {
      const matchSearch =
        m.product_id?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.product_id?.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.from?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.to?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.region?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchPeriod = true;
      if (filterPeriod !== 'all') {
        const d = new Date(m.dateMovement);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        if (filterPeriod === '7') matchPeriod = diffDays <= 7;
        if (filterPeriod === '30') matchPeriod = diffDays <= 30;
        if (filterPeriod === '90') matchPeriod = diffDays <= 90;
      }

      return matchSearch && matchPeriod;
    });
  }, [movements, searchTerm, filterPeriod]);


  return (
    <div className="min-h-screen relative font-sans text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Historique des Mouvements</h1>
                <p className="text-white/60 text-xs hidden md:block">Traçabilité complète des flux de stock</p>
              </div>
            </div>
            <button onClick={fetchMovements} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm font-bold transition-all active:scale-95">
              <RefreshCw size={16} /> Actualiser
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher produit, code, région..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all">
                <option value="all" className="bg-slate-900">Toute période</option>
                <option value="7" className="bg-slate-900">7 derniers jours</option>
                <option value="30" className="bg-slate-900">30 derniers jours</option>
                <option value="90" className="bg-slate-900">90 derniers jours</option>
              </select>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                <Loader2 className="animate-spin" size={40} />
                <p>Chargement de l'historique...</p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[850px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Produit</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Quantité</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Région</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">De → Vers</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(m => {
                    const cfg = getTypeConfig(m.type);
                    const { date, time } = formatDate(m.dateMovement);
                    const isExpanded = expandedRow === m._id;

                    return (
                      <Fragment key={m._id}>
                        <tr onClick={() => setExpandedRow(isExpanded ? null : m._id)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                                <Package size={16} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm">#{m.product_id?.codeArticle ?? '—'}</span>
                                <span className="text-white/50 text-xs truncate max-w-[160px]">{m.product_id?.libelle ?? '—'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-black ${cfg.color}`}>
                              +{m.quantite?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-white/30" />
                                <span className="text-xs font-bold text-white/80">{m.region}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="flex items-center gap-1 text-white/60">
                                <User size={11} />
                                <span className="truncate max-w-[80px]">{m.from?.email?.split('@')[0] ?? '—'}</span>
                              </span>
                              {m.to && (
                                <>
                                  <ArrowRightLeft size={10} className="text-white/30 flex-shrink-0" />
                                  <span className="flex items-center gap-1 text-white/60">
                                    <User size={11} />
                                    <span className="truncate max-w-[80px]">{m.to.email?.split('@')[0]}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-right pr-4">
                              <span className="text-xs font-bold text-white/80">{date}</span>
                              <span className="text-[10px] text-white/40 flex items-center justify-end gap-1">
                                <Clock size={10} /> {time}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-white/30 group-hover:text-white/60 transition-colors">
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-white/[0.03] border-l-2 border-blue-500/50">
                            <td colSpan={7} className="px-8 py-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div>
                                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Détails Produit</p>
                                  <p className="text-sm font-bold text-white/90">{m.product_id?.libelle || '—'}</p>
                                  <p className="text-xs text-white/40 mt-1">Code: {m.product_id?.codeArticle || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Expéditeur</p>
                                  <p className="text-sm font-bold text-white/90">{m.from?.email || 'Système'}</p>
                                  <p className="text-xs text-white/40 mt-1">Région Source: Responsable Centrale</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Destinataire</p>
                                  <p className="text-sm font-bold text-white/90">{m.to?.email || '—'}</p>
                                  <p className="text-xs text-white/40 mt-1">Région: <span className="capitalize">{m.region}</span></p>
                                </div>
                                <div className="col-span-full md:col-span-1">
                                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Note / Observation</p>
                                  <p className="text-xs text-white/70 italic leading-relaxed">
                                    {m.note ? `"${m.note}"` : "Aucune note jointe à ce mouvement."}
                                  </p>
                                  <p className="text-[9px] text-white/20 mt-3 font-mono">Ref: {m._id}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}

            {!loading && filtered.length === 0 && (
              <div className="py-20 text-center text-white/40">
                <ArrowRightLeft className="mx-auto mb-4 opacity-20" size={60} />
                <p>Aucun mouvement trouvé.</p>
              </div>
            )}
          </div>

          {!loading && filtered.length > 0 && (
            <p className="mt-4 text-right text-xs text-white/30 font-medium">
              {filtered.length} mouvement{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper pour Fragment (nécessaire pour React)
import { Fragment } from 'react';