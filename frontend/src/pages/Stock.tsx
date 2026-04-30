import { useEffect, useState, useMemo } from 'react';
import {
  Search, Filter, ArrowLeft, Loader2, Box,
  Package2, Package, Ruler, MapPin,
  CheckCircle2, Clock, TrendingUp
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStockByRegion, registerStock } from '../services/stockService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockEntry {
  _id: string;
  product_id: {
    _id: string;
    codeArticle: string;
    libelle: string;
    prix: number;
    unite: string;
  };
  quantite: number;
  region: string;
  enregisted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getProductIcon = (unite: string) => {
  switch (unite) {
    case 'Rouleau': return <Package2 size={16} />;
    case 'Mètre':   return <Ruler size={16} />;
    default:        return <Package size={16} />;
  }
};

const getQuantiteColor = (q: number) => {
  if (q === 0)    return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  if (q <= 100)   return 'bg-red-500/20 text-red-400 border border-red-500/50';
  if (q <= 500)   return 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
  if (q <= 1000)  return 'bg-green-500/20 text-green-400 border border-green-500/50';
  return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StockRegionPage() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>(); // ✅ param من URL

  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'validated' | 'pending'>('all');
  const [filterQty, setFilterQty] = useState<'all' | 'rupture' | 'alerte' | 'disponible'>('all');

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchStocks = async (regionName: string) => {
    try {
      setLoading(true);

      const res = await getStockByRegion(regionName);

      setStocks(res.data || []);
    } catch (err) {
      console.error('Erreur chargement stock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    if (!name) {
      navigate('/dashboard');
      return;
    }

    fetchStocks(name);

  }, [navigate, name]);

  // ── Validate ───────────────────────────────────────────────────────────────

  const handleValidate = async (id: string) => {
    try {
      await registerStock(id);
      if (name) fetchStocks(name); // refresh
    } catch (err) {
      console.error('Erreur validation:', err);
    }
  };

  // ── Filters & stats ────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return stocks.filter(s => {
      const p = s.product_id;
      if (!p) return false;

      const matchSearch =
        p.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.libelle?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'validated' && s.enregisted) ||
        (filterStatus === 'pending' && !s.enregisted);

      const matchQty =
        filterQty === 'all' ||
        (filterQty === 'rupture' && s.quantite === 0) ||
        (filterQty === 'alerte' && s.quantite > 0 && s.quantite <= 100) ||
        (filterQty === 'disponible' && s.quantite > 100);

      return matchSearch && matchStatus && matchQty;
    });
  }, [stocks, searchTerm, filterStatus, filterQty]);

  const stats = useMemo(() => ({
    total: stocks.length,
    validated: stocks.filter(s => s.enregisted).length,
    pending: stocks.filter(s => !s.enregisted).length,
    rupture: stocks.filter(s => s.quantite === 0).length,
  }), [stocks]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen relative font-sans text-white">

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Stock de Région</h1>
                <p className="text-white/60 text-xs hidden md:block flex items-center gap-1">
                  <MapPin size={12} className="inline mr-1" />
                  {name || 'Région non définie'}
                </p>
              </div>
            </div>

            {/* Region badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-bold">
              <MapPin size={16} />
              {name || '—'}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

          {/* ── Stats Cards ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total produits',  value: stats.total,     icon: <TrendingUp size={18} />,   color: 'blue'   },
              { label: 'Validés',         value: stats.validated, icon: <CheckCircle2 size={18} />, color: 'green'  },
              { label: 'En attente',      value: stats.pending,   icon: <Clock size={18} />,        color: 'amber'  },
              { label: 'Rupture',         value: stats.rupture,   icon: <Box size={18} />,          color: 'red'    },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${color === 'blue'  ? 'bg-blue-500/20  text-blue-400'  : ''}
                  ${color === 'green' ? 'bg-green-500/20 text-green-400' : ''}
                  ${color === 'amber' ? 'bg-amber-500/20 text-amber-400' : ''}
                  ${color === 'red'   ? 'bg-red-500/20   text-red-400'   : ''}
                `}>
                  {icon}
                </div>
                <div>
                  <p className="text-white/50 text-xs">{label}</p>
                  <p className="text-2xl font-black">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher par code ou libellé..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all"       className="bg-slate-900">Tous les statuts</option>
                <option value="validated" className="bg-slate-900">Validés</option>
                <option value="pending"   className="bg-slate-900">En attente</option>
              </select>
            </div>

            {/* Qty filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterQty}
                onChange={e => setFilterQty(e.target.value as typeof filterQty)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all"        className="bg-slate-900">Tous les stocks</option>
                <option value="disponible" className="bg-slate-900">Disponible</option>
                <option value="alerte"     className="bg-slate-900">En alerte</option>
                <option value="rupture"    className="bg-slate-900">En rupture</option>
              </select>
            </div>
          </div>

          {/* ── Table ─────────────────────────────────────────────────────── */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                <Loader2 className="animate-spin" size={40} />
                <p>Chargement du stock...</p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Produit</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Quantité</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Prix Unitaire</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(stock => {
                    const p = stock.product_id;
                    return (
                      <tr key={stock._id} className="hover:bg-white/5 transition-colors group">

                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getQuantiteColor(stock.quantite)}`}>
                              {getProductIcon(p?.unite ?? '')}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm truncate max-w-[150px]">#{p?.codeArticle}</span>
                              <span className="text-white/50 text-xs truncate max-w-[200px]">{p?.libelle}</span>
                            </div>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap ${getQuantiteColor(stock.quantite)}`}>
                            {stock.quantite} {p?.unite}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p?.prix > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`} />
                            <span className={`text-xs font-bold ${p?.prix > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {p?.prix?.toLocaleString()} DT
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {stock.enregisted ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/50">
                              <CheckCircle2 size={11} /> Validé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/50">
                              <Clock size={11} /> En attente
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-center">
                          {!stock.enregisted ? (
                            <button
                              onClick={() => handleValidate(stock._id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg"
                            >
                              <CheckCircle2 size={14} /> Valider
                            </button>
                          ) : (
                            <span className="text-white/20 text-xs">—</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {!loading && filtered.length === 0 && (
              <div className="py-20 text-center text-white/40">
                <Box className="mx-auto mb-4 opacity-20" size={60} />
                <p>Aucun stock trouvé.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}