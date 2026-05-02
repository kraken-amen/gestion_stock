import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

import KPISectionRegion from '../components/regionDashboard/KPISectionRegion';
import AlertsRegion from '../components/regionDashboard/AlertsRegion';

import { getStockByRegion } from '../services/stockService';
import StockByProductChart from '../components/regionDashboard/StockByProductChart';

interface Stock {
    _id: string;
    product_id: {
        codeArticle: string;
        libelle: string;
        unite: string;
        prix: number;
    };
    quantite: number;
    enregisted: boolean;
}

// ─── Page ─────────────────────────────────────

export default function RegionDashboardPage() {
    const navigate = useNavigate();
    const { name } = useParams();

    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch ───────────────────────────────────

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const res = await getStockByRegion(name!);
            setStocks(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!name) return;
        fetchStocks();
    }, [name]);

    // ── Stats ──────────────────────────────────

    const stats = useMemo(() => {
        const total = stocks.length;
        const validated = stocks.filter(s => s.enregisted).length;
        const pending = stocks.filter(s => !s.enregisted).length;
        const rupture = stocks.filter(s => s.quantite === 0).length;
        const alerte = stocks.filter(s => s.quantite > 0 && s.quantite <= 100).length;
        const disponible = stocks.filter(s => s.quantite > 100).length;

        return { total, validated, pending, rupture, alerte, disponible };
    }, [stocks]);

    // ── Render ─────────────────────────────────

    return (
        <div className="w-full min-h-screen font-sans text-white">

            {/* ─── HEADER ───────────────────────────────────────── */}
            <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30 h-16 flex items-center">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black tracking-tight drop-shadow-lg uppercase">
                                Région <span className="text-blue-500">{name || "Non Spécifiée"}</span>
                            </h1>
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Dashboard Régional</span>
                            </div>
                        </div>
                    </div>

                    {/* Status & Notifications */}
                    <button
                        onClick={() => navigate(`/region/${name}`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 transition-all active:scale-95 font-bold text-xs uppercase tracking-widest"
                    >
                        <LayoutGrid size={16} />
                        <span>Voir Détails</span>
                    </button>
                </div>
            </div>

            {/* ─── CONTENT (Organisation Global) ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 relative z-10">

                {/* 🔢 KPI SECTION (Grid 4 columns kima Global) */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <KPISectionRegion
                        total={stats.total}
                        stockGlobal={stats.validated}
                        lowStock={stats.pending}
                        value={stats.rupture}
                    />
                </section>

                {/*  CHARTS GRID  */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch auto-rows-fr">

                    {/* Stock par produit */}
                    <div>
                        <StockByProductChart />
                    </div>

                    {/* Chart 2: Alerts & Status Panels */}
                    <div>
                        <AlertsRegion
                            rupture={stats.rupture}
                            alerte={stats.alerte}
                        />
                    </div>
                </div>
                {/* ── Loading State ── */}
                {loading && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Sychronisation en cours...</p>
                    </div>
                )}

            </div>
        </div>
    );
}