import React, { useState } from 'react';
import { Plus, X, Trash2, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { PropsDemande } from '../types';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantite: number;
}

// Produits disponibles (mock data)
const AVAILABLE_PRODUCTS: Product[] = [
  { id: '1', name: 'iPhone 15 Pro', category: 'Téléphone', price: 1299, stock: 500 },
  { id: '2', name: 'Samsung Galaxy S24', category: 'Téléphone', price: 999, stock: 350 },
  { id: '3', name: 'AirPods Pro', category: 'Accessoire', price: 249, stock: 200 },
  { id: '4', name: 'iPad Air', category: 'Tablette', price: 599, stock: 150 },
  { id: '5', name: 'Apple Watch', category: 'Montre', price: 399, stock: 100 },
  { id: '6', name: 'Cable USB-C', category: 'Accessoire', price: 29, stock: 1000 },
  { id: '7', name: 'Chargeur Rapide', category: 'Accessoire', price: 49, stock: 500 },
  { id: '8', name: 'Coque Protection', category: 'Accessoire', price: 19, stock: 800 },
];

export default function CreateDemandePage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Produits filtrés
  const filteredProducts = AVAILABLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Catégories uniques
  const categories = ['all', ...new Set(AVAILABLE_PRODUCTS.map(p => p.category))];

  // Ajouter un produit au panier
  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantite: 1 }]);
    }
    setShowAddProduct(false);
    setSearchTerm('');
  };

  // Mettre à jour la quantité
  const handleQuantityChange = (productId: string, quantite: number) => {
    if (quantite <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const product = AVAILABLE_PRODUCTS.find(p => p.id === productId);
    if (product && quantite > product.stock) {
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantite }
        : item
    ));
  };

  // Supprimer du panier
  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Soumettre la demande
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }

    if (!description.trim()) {
      alert('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    try {
      // Appel API pour créer la demande
      const demandeData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantite: item.quantite
        })),
        description: description,
        status: 'EN_ATTENTE'
      };

      console.log('Demande créée:', demandeData);
      
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Demande créée avec succès!');
      navigate('/demandes');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la demande');
    } finally {
      setLoading(false);
    }
  };

  // Calcul du total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantite), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <div className="min-h-screen overflow-hidden relative font-sans bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-600 via-blue-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-600 via-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/demandes')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">Créer une Demande</h1>
            <p className="text-white/70 text-sm font-medium mt-1">Remplissez le formulaire pour soumettre une nouvelle demande</p>
          </div>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className="bg-slate-900/80 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Description de la Demande</CardTitle>
                <CardDescription className="text-white/70">Décrivez le contenu et l'objectif de votre demande</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Entrez la description de votre demande..."
                  className="w-full bg-white/5 border-2 border-white/20 focus:border-white/50 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none transition-all font-medium h-32"
                />
              </CardContent>
            </Card>

            {/* Products List */}
            <Card className="bg-slate-900/80 border-white/20 shadow-2xl">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Panier ({totalItems} articles)</CardTitle>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4"
                  >
                    <Plus size={16} className="mr-2" />
                    Ajouter Produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {cart.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-white/70 font-medium mb-2">Aucun produit ajouté</p>
                    <p className="text-white/50 text-sm">Cliquez sur "Ajouter Produit" pour commencer</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                        <div className="flex-1">
                          <h3 className="text-white font-bold">{item.name}</h3>
                          <p className="text-white/70 text-sm">{item.category}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Prix unitaire */}
                          <div className="text-right">
                            <p className="text-white/70 text-sm">Prix</p>
                            <p className="text-blue-300 font-bold">{item.price}€</p>
                          </div>

                          {/* Quantité */}
                          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 border border-white/20">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantite - 1)}
                              className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white flex items-center justify-center"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantite}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent text-center text-white font-bold outline-none"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantite + 1)}
                              disabled={item.quantite >= item.stock}
                              className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          {/* Sous-total */}
                          <div className="text-right">
                            <p className="text-white/70 text-sm">Sous-total</p>
                            <p className="text-emerald-300 font-bold">{(item.price * item.quantite).toLocaleString()}€</p>
                          </div>

                          {/* Bouton Supprimer */}
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all border border-red-400/50 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary & Modal Section */}
          <div className="space-y-6">
            {/* Résumé */}
            <Card className="bg-slate-900/80 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-white/70">Articles</span>
                  <span className="text-white font-bold">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-white/70">Total</span>
                  <span className="text-2xl font-black text-blue-300">{total.toLocaleString()}€</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-11"
                >
                  {loading ? 'Création en cours...' : 'Créer la Demande'}
                </Button>
              </CardContent>
            </Card>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                  onClick={() => setShowAddProduct(false)}
                ></div>

                {/* Modal */}
                <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
                  {/* Background Effects */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X size={24} />
                  </button>

                  {/* Content */}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-6">Sélectionner un Produit</h2>

                    {/* Search Bar */}
                    <div className="mb-6 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <Input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/5 border-white/20 focus:border-white/50 text-white placeholder:text-white/40"
                      />
                    </div>

                    {/* Categories */}
                    <div className="mb-6 flex gap-2 flex-wrap">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white border border-blue-400'
                              : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white'
                          }`}
                        >
                          {category === 'all' ? 'Tous' : category}
                        </button>
                      ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleAddToCart(product)}
                          className="p-4 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all text-left group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-white font-bold group-hover:text-blue-300">{product.name}</h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/50">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-300 font-bold">{product.price}€</span>
                            <span className="text-white/70 text-sm">
                              Stock: <span className="text-white font-bold">{product.stock}</span>
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {filteredProducts.length === 0 && (
                      <div className="py-12 text-center">
                        <p className="text-white/70 font-medium">Aucun produit trouvé</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}