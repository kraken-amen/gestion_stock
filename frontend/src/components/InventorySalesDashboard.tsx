import { useState } from 'react';
import { TrendingUp, Package, DollarSign, Activity, X as CloseIcon, AlertCircle, Check, Bell } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/Badge';

interface Transaction {
    id: string;
    product: string;
    amount: number;
    status: 'success' | 'pending' | 'failed';
    date: string;
    region: string;
}

interface TopItem {
    name: string;
    sales: number;
    revenue: number;
    growth: number;
}

export default function InventorySalesDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRegion, setFilterRegion] = useState('all');

    // Sales Trends Data
    const salesTrendsData = [
        { month: 'Janvier', ventes: 4000, stocks: 2400 },
        { month: 'Février', ventes: 3200, stocks: 1398 },
        { month: 'Mars', ventes: 2800, stocks: 9800 },
        { month: 'Avril', ventes: 2780, stocks: 3908 },
        { month: 'Mai', ventes: 1890, stocks: 4800 },
        { month: 'Juin', ventes: 2390, stocks: 3800 },
        { month: 'Juillet', ventes: 3490, stocks: 4300 }
    ];

    // Sales by Category
    const categoryData = [
        { name: 'Téléphones', value: 35, color: '#3B82F6' },
        { name: 'Accessoires', value: 25, color: '#10B981' },
        { name: 'Services', value: 20, color: '#F59E0B' },
        { name: 'Équipements', value: 20, color: '#8B5CF6' }
    ];

    // Regional Performance
    const regionalPerformance = [
        { region: 'Tunis', ventes: 4500, objectif: 5000 },
        { region: 'Sfax', ventes: 3200, objectif: 3500 },
        { region: 'Sousse', ventes: 2800, objectif: 3000 },
        { region: 'Gabès', ventes: 1800, objectif: 2000 },
        { region: 'Kairouan', ventes: 2200, objectif: 2500 }
    ];

    // Top Selling Items
    const topItems: TopItem[] = [
        { name: 'iPhone 15 Pro Max', sales: 1250, revenue: 1875000, growth: 12.5 },
        { name: 'Samsung Galaxy S24', sales: 980, revenue: 1470000, growth: 8.3 },
        { name: 'AirPods Pro', sales: 750, revenue: 225000, growth: 15.2 },
        { name: 'iPad Air', sales: 620, revenue: 434000, growth: 5.8 }
    ];

    // Recent Transactions
    const transactions: Transaction[] = [
        { id: 'TXN001', product: 'iPhone 15 Pro', amount: 1500, status: 'success', date: '2024-03-08', region: 'Tunis' },
        { id: 'TXN002', product: 'Samsung S24', amount: 1200, status: 'pending', date: '2024-03-08', region: 'Sfax' },
        { id: 'TXN003', product: 'iPad Air', amount: 700, status: 'success', date: '2024-03-07', region: 'Sousse' },
        { id: 'TXN004', product: 'AirPods Pro', amount: 300, status: 'success', date: '2024-03-07', region: 'Tunis' },
        { id: 'TXN005', product: 'Samsung S24', amount: 1200, status: 'failed', date: '2024-03-06', region: 'Gabès' }
    ];

    const filteredTransactions = transactions.filter(txn =>
        (filterRegion === 'all' || txn.region === filterRegion) &&
        (searchTerm === '' || txn.product.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/50 flex items-center gap-1.5"><Check size={12} /> Succès</Badge>;
            case 'pending':
                return <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/50 flex items-center gap-1.5"><AlertCircle size={12} /> En attente</Badge>;
            case 'failed':
                return <Badge className="bg-red-500/20 text-red-400 border-red-400/50 flex items-center gap-1.5"><CloseIcon size={12} /> Échoué</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="relative z-10 w-full">
            {/* Header */}
            <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-white drop-shadow-lg">Tableau de Bord</h2>
                        <p className="text-white/70 text-sm font-medium mt-2">Gestion des stocks et ventes en temps réel</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Bell size={20} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Sales */}
                    <Card className="bg-slate-900/50 border-white/10 hover:border-white/20 transition-all">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold flex items-center justify-between">
                                <span>Ventes Totales</span>
                                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/50">
                                    <DollarSign className="text-blue-400" size={18} />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-white drop-shadow-lg">2.45M</p>
                            <Badge className="mt-3 bg-emerald-500/20 text-emerald-400 border-emerald-400/50">+12.5% ce mois</Badge>
                        </CardContent>
                    </Card>

                    {/* Total Stock */}
                    <Card className="bg-slate-900/50 border-white/10 hover:border-white/20 transition-all">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold flex items-center justify-between">
                                <span>Stock Total</span>
                                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/50">
                                    <Package className="text-amber-400" size={18} />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-white drop-shadow-lg">45.8K</p>
                            <p className="text-white/70 text-xs font-medium mt-3">8.2K articles</p>
                        </CardContent>
                    </Card>

                    {/* Net Profit */}
                    <Card className="bg-slate-900/50 border-white/10 hover:border-white/20 transition-all">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold flex items-center justify-between">
                                <span>Bénéfice Net</span>
                                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/50">
                                    <TrendingUp className="text-emerald-400" size={18} />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-emerald-400 drop-shadow-lg">580K</p>
                            <Badge className="mt-3 bg-emerald-500/20 text-emerald-400 border-emerald-400/50">+8.3% mois dernier</Badge>
                        </CardContent>
                    </Card>

                    {/* Active Regions */}
                    <Card className="bg-slate-900/50 border-white/10 hover:border-white/20 transition-all">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white/70 text-sm font-semibold flex items-center justify-between">
                                <span>Régions Actives</span>
                                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/50">
                                    <Activity className="text-purple-400" size={18} />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black text-purple-400 drop-shadow-lg">6</p>
                            <p className="text-white/70 text-xs font-medium mt-3">100% de couverture</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="trends" className="mb-10">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-white/10">
                        <TabsTrigger value="trends" className="text-white/70 data-[state=active]:text-white">Tendances</TabsTrigger>
                        <TabsTrigger value="category" className="text-white/70 data-[state=active]:text-white">Catégories</TabsTrigger>
                        <TabsTrigger value="region" className="text-white/70 data-[state=active]:text-white">Régions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trends">
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Tendances des Ventes</CardTitle>
                                <CardDescription className="text-white/70">Evolution des ventes et stocks sur 7 mois</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={salesTrendsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="ventes" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                                        <Line type="monotone" dataKey="stocks" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="category">
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Ventes par Catégorie</CardTitle>
                                <CardDescription className="text-white/70">Distribution des ventes par catégorie de produits</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {categoryData.map((cat, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                                <span className="text-white font-semibold">{cat.name}</span>
                                            </div>
                                            <Badge>{cat.value}%</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="region">
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Performance Régionale</CardTitle>
                                <CardDescription className="text-white/70">Comparaison ventes réalisées vs objectifs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={regionalPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="region" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                                        <Legend />
                                        <Bar dataKey="ventes" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="objectif" fill="#10B981" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Bottom Section - Lists & Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Selling Items */}
                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Articles les Plus Vendus</CardTitle>
                            <CardDescription className="text-white/70">Top 4 produits par volume de ventes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topItems.map((item, idx) => (
                                <div key={idx} className="flex items-start justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                    <div className="flex-1">
                                        <p className="text-white font-bold">{item.name}</p>
                                        <p className="text-white/70 text-sm mt-1">{item.sales.toLocaleString()} ventes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-blue-400 font-bold">{(item.revenue / 1000).toFixed(0)}K DA</p>
                                        <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-400/50">+{item.growth}%</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Transactions Récentes</CardTitle>
                            <CardDescription className="text-white/70">Dernières opérations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-3 mb-4">
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                                <Select value={filterRegion} onValueChange={setFilterRegion}>
                                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        <SelectItem value="all">Toutes</SelectItem>
                                        <SelectItem value="Tunis">Tunis</SelectItem>
                                        <SelectItem value="Sfax">Sfax</SelectItem>
                                        <SelectItem value="Sousse">Sousse</SelectItem>
                                        <SelectItem value="Gabès">Gabès</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="max-h-80 overflow-y-auto space-y-2">
                                {filteredTransactions.map((txn) => (
                                    <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                        <div className="flex-1">
                                            <p className="text-white font-semibold text-sm">{txn.product}</p>
                                            <p className="text-white/70 text-xs">{txn.region} • {txn.date}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-blue-400 font-bold text-sm">{txn.amount} DA</p>
                                            {getStatusBadge(txn.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}