import { useEffect, useState, useMemo } from 'react';
import { Search, Edit2, Plus, Filter, Mail, Power, ArrowLeft, Loader2, UserCircle, Trash2, Box } from 'lucide-react';
import { getProducts,createProduct, updateProduct, deleteProduct } from "../services/productService";
import { useNavigate } from 'react-router-dom';
import type { Product } from "../types";
// import ProductModelCreate from '../components/ProductModelCreate';
// import ProductModelUpdate from '../components/ProductModelUpdate';
export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState();
  const [filterStatus, setFilterStatus] = useState();
  const navigate = useNavigate();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    console.log(filteredProducts);
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

 const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter(product => {
        if (!product) return false;

        const matchesSearch = product.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || product.quantite === filterStatus;

        return matchesSearch && matchesStatus;
    });
}, [products, searchTerm, filterStatus]);

const Products = filteredProducts;

  const getQuantiteColor = (quantite: number) => {
    if (quantite<=100) {
      return 'bg-red-500/20 text-red-400 border border-red-400/50';
    } else if (quantite<=500) {
      return 'bg-amber-500/20 text-amber-400 border border-amber-400/50';
    } else if (quantite<=1000) {
      return 'bg-green-500/20 text-green-400 border border-green-400/50';
    } else {
      return 'bg-blue-500/20 text-blue-400 border border-blue-400/50';
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Responsive */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition-all">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-3xl font-black drop-shadow-lg">Gestion des Produits</h1>
                <p className="text-white/60 text-xs hidden md:block">Administration et gestion des produits</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpenCreate(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} /> Nouveau
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Barre de recherche */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher par email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:bg-white/10 focus:outline-none text-white placeholder-white/40 font-medium transition-all"
              />
            </div>

            {/* Sélecteur de rôle */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterRole}
                // onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all" className="bg-slate-900">Tous les produits</option>
                <option value="administrateur" className="bg-slate-900">Produits en stock</option>
                <option value="responsable region" className="bg-slate-900">Produits en rupture</option>
                <option value="utilisateur" className="bg-slate-900">Produits en alerte</option>
                <option value="Gestionnaire de Stock" className="bg-slate-900">Produits en surstock</option>
              </select>
            </div>

            {/* Sélecteur de statut */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={filterStatus}
                // onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-white/50 focus:outline-none text-white appearance-none cursor-pointer font-medium transition-all"
              >
                <option value="all" className="bg-slate-900">Tous les statuts</option>
                <option value="true" className="bg-slate-900">Actif</option>
                <option value="false" className="bg-slate-900">Bloqué</option>
              </select>
            </div>
          </div>

          {/* Table Container - Mobile Responsive */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-white/50">
                <Loader2 className="animate-spin" size={40} />
                <p>Chargement des utilisateurs...</p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Products.map((product) => (

                    <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getQuantiteColor(product.quantite)}`}>
                            <Box size={12} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm truncate max-w-[150px]">{product.codeArticle}</span>
                            <span className="text-white/50 text-xs flex items-center gap-1"><Box size={12} /> {product.libelle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap ${getQuantiteColor(product.quantite)}`}>
                          {product.quantite}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.prix ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`} />
                          <span className={`text-xs font-bold ${product.prix ? 'text-emerald-400' : 'text-red-400'}`}>
                            {product.prix}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setSelectedProduct(product); setIsModalOpenUpdate(true); }}
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id!)}
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && Products.length === 0 && (
              <div className="py-20 text-center text-white/40">
                <UserCircle className="mx-auto mb-4 opacity-20" size={60} />
                <p>Aucun utilisateur trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <ProductModelCreate
        isOpen={isModalOpenCreate}
        onClose={() => setIsModalOpenCreate(false)}
        onUserCreated={fetchProducts}
      />

      {isModalOpenUpdate && selectedUser && (
        <ProductModelUpdate
          isOpen={isModalOpenUpdate}
          onClose={() => { setIsModalOpenUpdate(false); setSelectedUser(null); }}
          onUserUpdated={fetchProducts}
          user={selectedUser}
        />
      )}
      {isModalOpenUpdateAdmin && selectedUser && (
        <ProductModelUpdateAdmin
          isOpen={isModalOpenUpdateAdmin}
          onClose={() => { setIsModalOpenUpdateAdmin(false); setSelectedUser(null); }}
          onUserUpdated={fetchProducts}
          user={selectedUser}
        />
      )} */}
    </div>
  );
}