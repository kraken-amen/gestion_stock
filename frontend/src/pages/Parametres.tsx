import { useState } from 'react';
import { ArrowLeft, Settings, Plus, Edit2, Trash2, Moon, Sun, Package, Tag, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';

// Types
interface Depot {
  id: string;
  name: string;
  location: string;
  manager: string;
  capacity: number;
  active: boolean;
}

interface Unit {
  id: string;
  name: string;
  abbreviation: string;
}

// Mock Data
const MOCK_DEPOTS: Depot[] = [
  { id: '1', name: 'Dépôt Central Tunis', location: 'Tunis', manager: 'Ahmed Ben Ali', capacity: 10000, active: true },
  { id: '2', name: 'Dépôt Sfax', location: 'Sfax', manager: 'Fatima Mansour', capacity: 5000, active: true },
  { id: '3', name: 'Dépôt Sousse', location: 'Sousse', manager: 'Mohamed Trabelsi', capacity: 3000, active: false },
];

const MOCK_UNITS: Unit[] = [
  { id: '1', name: 'Pièce', abbreviation: 'Pcs' },
  { id: '2', name: 'Kilogramme', abbreviation: 'kg' },
  { id: '3', name: 'Carton', abbreviation: 'Ctn' },
  { id: '4', name: 'Litre', abbreviation: 'L' },
  { id: '5', name: 'Paquet', abbreviation: 'Pkg' },
];

// Component
export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('configuration');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('fr');
  
  // Configuration Stock
  const [allowNegative, setAllowNegative] = useState(false);
  const [minStockAlert, setMinStockAlert] = useState('10');
  const [defaultWarehouse, setDefaultWarehouse] = useState('1');

  // Depots
  const [depots, setDepots] = useState<Depot[]>(MOCK_DEPOTS);
  const [showAddDepot, setShowAddDepot] = useState(false);
  const [newDepot, setNewDepot] = useState({ name: '', location: '', manager: '', capacity: '' });

  // Units
  const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);


  return (
  <div className="min-h-screen overflow-hidden relative font-sans bg-[#020617] p-6 text-slate-200">
    {/* Background Effects - "Light in the Darkness" style */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Cyan/Blue glow top right */}
      <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50"></div>
      {/* Deep purple glow bottom left */}
      <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>
      
      {/* Grid Pattern subtle overlays */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
    </div>

    <div className="relative z-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/dashboard')}
            className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-blue-400" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Paramètres
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Gérez l'infrastructure et l'apparence du système</p>
          </div>
        </div>
        
        {/* Quick Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
          Système Opérationnel
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-2">
          {[
            { id: 'configuration', label: 'Stock & Logique', icon: Package, desc: 'Règles et alertes' },
            { id: 'depots', label: 'Dépôts', icon: Inbox, desc: 'Entrepôts régionaux' },
            { id: 'units', label: 'Unités', icon: Tag, desc: 'Mesures de produits' },
            { id: 'appearance', label: 'Interface', icon: Sun, desc: 'Thèmes et langues' },
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 border ${
                  isActive
                    ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'bg-white/[0.02] border-white/5 text-slate-500 hover:bg-white/[0.05] hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5'}`}>
                  <TabIcon size={18} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{tab.label}</p>
                  <p className="text-[10px] opacity-50">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <Card className="bg-[#0f172a]/40 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-white uppercase tracking-wider">
                    {activeTab.replace('_', ' ')}
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">Configurez les options détaillées ci-dessous</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              {activeTab === 'configuration' && (
                <>
                  <div className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 h-fit">
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Stock Négatif</h3>
                        <p className="text-slate-500 text-xs mt-1 italic">Autorise les ventes sans stock physique</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAllowNegative(!allowNegative)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        allowNegative ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                        allowNegative ? 'left-7' : 'left-1'
                      }`}></div>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Seuil d'Alerte Minimum</label>
                    <Input
                      type="number"
                      value={minStockAlert}
                      onChange={(e) => setMinStockAlert(e.target.value)}
                      className="h-14 bg-white/[0.03] border-white/10 rounded-xl focus:border-blue-500/50 focus:bg-blue-500/[0.02] transition-all text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Dépôt Logistique Principal</label>
                    <Select value={defaultWarehouse} onValueChange={setDefaultWarehouse}>
                      <SelectTrigger className="h-14 bg-white/[0.03] border-white/10 rounded-xl text-white">
                        <SelectValue placeholder="Sélectionner un dépôt" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        {depots.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* ... Reste des onglets avec le même style de conteneur ... */}

              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-1">
                Mettre à jour la configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);
}