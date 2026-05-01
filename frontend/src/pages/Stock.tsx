import { useEffect, useState, useMemo } from 'react';
import {
  Search, Filter, ArrowLeft, Loader2, Box,
  Package2, Package, Ruler, MapPin,
  CheckCircle2, Clock, TrendingUp, ClipboardCheck, Calendar,
  Truck,
  Edit2,
  Trash2,
  Warehouse
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStockByRegion, registerStock, deleteStock } from '../services/stockService';
import { useToast } from "../context/ToastContext.tsx";
import ConfirmModal from '../components/ConfirmModel.tsx';
import StockModelCreate from '../components/StockModelCreate.tsx';
import StockModelUpdate from '../components/StockModelUpdate.tsx';
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
    case 'Mètre': return <Ruler size={16} />;
    default: return <Package size={16} />;
  }
};

const getQuantiteColor = (q: number) => {
  if (q === 0) return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  if (q <= 100) return 'bg-red-500/20 text-red-400 border border-red-500/50';
  if (q <= 500) return 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
  if (q <= 1000) return 'bg-green-500/20 text-green-400 border border-green-500/50';
  return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StockRegionPage() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQty, setFilterQty] = useState<'all' | 'rupture' | 'alerte' | 'disponible'>('all');
  const { addToast } = useToast();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockEntry | null>(null);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ id: '', confirmValue: '' });
  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchStocks = async (regionName: string) => {
    try {
      setLoading(true);

      const res = await getStockByRegion(regionName);

      setStocks(res || []);
    } catch (err) {
      console.error('Erreur chargement stock:', err);
    } finally {
      setLoading(false);
    }
  };
  const normalizeRegion = (r: string) => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
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

    fetchStocks(normalizeRegion(name));

  }, [navigate, name]);

  // ── Validate ───────────────────────────────────────────────────────────────

  const handleValidate = async (id: string) => {
    try {
      await registerStock(id);

      if (name) {
        const normalized = normalizeRegion(name);
        await fetchStocks(normalized);
      }

      addToast("Stock enregistré avec succès", "success");
    } catch (err) {
      console.error('Erreur validation:', err);
      addToast("Erreur lors de l'enregistrement", "error");
    }
  };
  const executeDelete = async () => {
    if (!deleteConfig.id) return;
    try {
      await deleteStock(deleteConfig.id);
      if (name) await fetchStocks(normalizeRegion(name));
      addToast("Stock supprimé", "success");
      setIsConfirmOpen(false);
    } catch (err) {
      addToast("Erreur lors de la suppression", "error");
    }
  };

  // ── Filters & stats ────────────────────────────────────────────────────────
  const applyBaseFilters = (s: StockEntry, searchTerm: string, filterQty: string) => {
    const p = s.product_id;
    if (!p) return false;

    const matchSearch =
      p.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.libelle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchQty =
      filterQty === 'all' ||
      (filterQty === 'rupture' && s.quantite === 0) ||
      (filterQty === 'alerte' && s.quantite > 0 && s.quantite <= 100) ||
      (filterQty === 'disponible' && s.quantite > 100);

    return matchSearch && matchQty;
  };

  const stocksEnregistres = useMemo(() => {
    return stocks.filter(s => s.enregisted && applyBaseFilters(s, searchTerm, filterQty));
  }, [stocks, searchTerm, filterQty]);

  const stocksEnAttente = useMemo(() => {
    return stocks.filter(s => !s.enregisted);
  }, [stocks, searchTerm, filterQty]);

  const stats = useMemo(() => ({
    total: stocks.length,
    validated: stocks.filter(s => s.enregisted).length,
    pending: stocks.filter(s => !s.enregisted).length,
    rupture: stocks.filter(s => s.quantite === 0).length,
  }), [stocks]);
  const totalQuantiteEnregistree = stocksEnregistres.reduce((acc, curr) => acc + (curr.quantite || 0), 0) || 0;

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
                onClick={() => navigate('/map')}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Stock de Région</h1>
                <p className="text-white/60 text-xs hidden md:block">
                  Gestion des inventaires et flux logistiques
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {JSON.parse(localStorage.getItem('role') || '""') === "responsable region" && (

                <button
                  onClick={() => setIsModalOpenCreate(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Package2 size={16} />
                  Nouveau Stock
                </button>
              )}

              {JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-bold">
                  <MapPin size={16} />
                  {name || '—'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

          {/* ── Stats Grid ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total produits', value: stats.total, icon: <TrendingUp size={18} />, color: 'blue' },
              { label: 'Validés', value: stats.validated, icon: <CheckCircle2 size={18} />, color: 'green' },
              { label: 'En attente', value: stats.pending, icon: <Clock size={18} />, color: 'amber' },
              { label: 'Stock Global', value: totalQuantiteEnregistree, icon: <Warehouse size={18} />, color: 'purple' }
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 transition-all hover:bg-white/10"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          ${color === 'blue' ? 'bg-blue-500/20   text-blue-400' : ''}
          ${color === 'green' ? 'bg-green-500/20  text-green-400' : ''}
          ${color === 'amber' ? 'bg-amber-500/20  text-amber-400' : ''}
          ${color === 'purple' ? 'bg-purple-500/20 text-purple-400' : ''}
          ${color === 'red' ? 'bg-red-500/20    text-red-400' : ''}
        `}>
                  {icon}
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-black text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {stocksEnAttente.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6 group">
                <div className="flex flex-col gap-1">
                  <h3 className="text-white text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full animate-pulse"></div>
                      <Truck
                        size={22}
                        className="text-amber-500 relative animate-[bounce_2s_infinite] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      />
                    </div>

                    <span>Stocks en cours de Réception</span>

                  </h3>

                  <div className="h-[2px] w-12 bg-gradient-to-r from-amber-500 to-transparent rounded-full mt-1"></div>
                </div>


                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest hidden md:block">
                  Flux Logistique Direct
                </span>
              </div>

              <div className="space-y-4">
                {stocksEnAttente.map((item) => {
                  const p = item.product_id;

                  return (
                    <div key={item._id} className="backdrop-blur-xl bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">

                      {/* Section 1: Produit & Info Livreur */}
                      <div className="flex items-center gap-4 min-w-[250px]">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-500/20 text-amber-500 shadow-inner">
                          <Box size={28} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-amber-200 font-bold">
                              NOUVEAU FLUX
                            </span>
                          </div>
                          <p className="text-white font-bold text-sm">{p?.libelle || 'Produit inconnu'}</p>
                          <span className="text-white/40 text-[10px]">Réf: {p?.codeArticle}</span>
                        </div>
                      </div>

                      {/* Section 2: Quantité Arrivée & État */}
                      <div className="flex-1 grid grid-cols-2 gap-4 w-full border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                        <div>
                          <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mb-1">Quantité Reçue</p>
                          <p className="text-lg font-black text-amber-400">
                            + {item.quantite} <span className="text-[10px] font-normal text-white/50">{p?.unite}</span>
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mb-1">État Colis</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                            <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest">En vérification</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Actions (Contrôle & Enregistrement) */}
                      {
                        JSON.parse(localStorage.getItem('role') || '""') === "responsable region" && (
                          <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                            <a
                              href={`mailto:admin@votre-domaine.tn?subject=Réception Stock: ${p?.libelle}&body=Bonjour,%0D%0A%0D%0AJe vous informe que le produit ${p?.libelle} (#${p?.codeArticle}) a été réceptionné par le livreur .%0D%0AQuantité: ${item.quantite} ${p?.unite}.%0D%0A%0D%0ACordialement.`}
                              className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-all border border-white/10"
                              title="Notifier l'Admin par Email"
                            >
                              <ClipboardCheck size={18} />
                            </a>
                            <button
                              onClick={() => handleValidate(item._id)}
                              className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-black transition-all active:scale-95 shadow-lg shadow-green-500/20"
                            >
                              Valider
                            </button>
                          </div>
                        )
                      }
                      {
                        JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && (
                          <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                            <Truck size={40} className="text-white transition-all" />
                          </div>
                        )
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Filters ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            {/* Search */}
            <div className="md:col-span-2 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher par code ou libellé..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
              />
            </div>
            {/* Qty filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterQty}
                onChange={e => setFilterQty(e.target.value as typeof filterQty)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all" className="bg-slate-900">Tous les stocks</option>
                <option value="disponible" className="bg-slate-900">Disponible</option>
                <option value="alerte" className="bg-slate-900">En alerte</option>
                <option value="rupture" className="bg-slate-900">En rupture</option>
              </select>
            </div>
          </div>

          {/* ── Table ─────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-medium tracking-widest uppercase text-xs">Chargement du stock...</p>
              </div>
            ) : stocksEnregistres.length > 0 ? (
              stocksEnregistres.map(stock => {
                const p = stock.product_id;
                const totalNet = (stock.quantite * p?.prix || 0);

                return (
                  <div key={stock._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/10 transition-all group">

                    {/* 1. Product Info */}
                    <div className="flex items-center gap-4 min-w-[250px]">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-lg ${getQuantiteColor(stock.quantite)}`}>
                        {getProductIcon(p?.unite ?? '')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/10 text-blue-300 font-bold w-fit mb-1">
                          #{p?.codeArticle}
                        </span>
                        <p className="text-white font-bold text-sm truncate max-w-[200px]">{p?.libelle}</p>
                      </div>
                    </div>

                    {/* 2. Metrics (Date MAJ & Quantité) */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <div>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mb-1.5">Date de MAJ</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                          <Calendar size={12} className="text-blue-400" />
                          {stock.updatedAt ? new Date(stock.updatedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mb-1.5">Quantité</p>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${getQuantiteColor(stock.quantite)}`}>
                          {stock.quantite} {p?.unite}
                        </span>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter mb-1.5">Valeur Stock</p>
                        <p className="text-sm font-black text-emerald-400 italic">
                          {new Intl.NumberFormat('fr-TN', { minimumFractionDigits: 3 }).format(totalNet)}
                          <span className="text-[10px] ml-1 not-italic opacity-60">DT</span>
                        </p>
                      </div>
                    </div>

                    {/* 3. Status & Action */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                      {
                        JSON.parse(localStorage.getItem('role') || '""') === "administrateur" && stock.enregisted && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Validé
                          </div>
                        )
                      }
                      {
                        JSON.parse(localStorage.getItem('role') || '""') === "responsable region" && stock.enregisted && (
                          <div className='flex items-center justify-center gap-2'>
                            <button
                              onClick={() => { setSelectedStock(stock); setIsModalOpenUpdate(true); }}
                              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setDeleteConfig({
                                  id: stock._id!,
                                  confirmValue: stock.product_id?.libelle.toUpperCase() || '',
                                });
                                setIsConfirmOpen(true);
                              }}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )
                      }
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <Box className="mx-auto mb-4 opacity-10" size={64} />
                <p className="text-white/40 font-medium">Aucun stock enregistré pour le moment.</p>
              </div>
            )}
            {isConfirmOpen && (
              <ConfirmModal
                config={{
                  title: "Supprimer le stock ?",
                  confirmValue: deleteConfig.confirmValue,
                  onConfirm: executeDelete
                }}
                onClose={() => setIsConfirmOpen(false)}
              />
            )}
            {/* Create Modal */}
            {isModalOpenCreate && (
              <StockModelCreate
                isOpen={isModalOpenCreate}
                onClose={() => setIsModalOpenCreate(false)}
                onStockCreated={() => name && fetchStocks(normalizeRegion(name))}
              />
            )}

            {/* Update Modal */}
            {isModalOpenUpdate && selectedStock && (
              <StockModelUpdate
                isOpen={isModalOpenUpdate}
                onClose={() => { setIsModalOpenUpdate(false); setSelectedStock(null); }}
                onStockUpdated={() => name && fetchStocks(normalizeRegion(name))}
                stock={selectedStock}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}