import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Heart,
  Package,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Zap,
  Award,
  Users,
  Sparkles,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Grid3X3,
  List,
  X,
  Plus,
  Minus,
  Truck,
  Activity,
  Pill,
  Stethoscope,
  HeartPulse,
  Database,
  BarChart3,
  AlertTriangle,
  Microscope,
  Building2,
  Globe,
  Fingerprint
} from 'lucide-react';
import { Product, Category } from '../types';
import apiService from '../services/api';
import { getMockProducts, getMockCategories, getFeaturedProducts } from '../services/mockData';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<number | string>>(new Set());
  const [cart, setCart] = useState<Set<number | string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalPharmacies: 847,
    totalTransactions: 12543
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProducts = getMockProducts();
        const mockCategories = getMockCategories();
        
        setProducts(mockProducts);
        setCategories(mockCategories);
        setStats(prev => ({
          ...prev,
          totalProducts: mockProducts.length,
          totalCategories: mockCategories.length
        }));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleFavorite = (productId: number | string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const toggleCart = (productId: number | string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(productId)) {
        newCart.delete(productId);
      } else {
        newCart.add(productId);
      }
      return newCart;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setShowFilters(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-3xl mb-8 inline-block shadow-2xl">
            <Pill className="h-16 w-16 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Cargando PharmaCore</h2>
          <p className="text-gray-600 text-lg mb-8">Preparando tu catálogo farmacéutico...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Pill className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PharmaCore</h1>
                <p className="text-sm text-gray-600 font-medium">Sistema Integral Farmacéutico</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">+34 900 123 456</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="font-medium">soporte@pharmacore.com</span>
                </div>
              </div>
              
              <button className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold">Carrito</span>
                {cart.size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {cart.size}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  Tu Salud,
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse-slow">
                    Nuestra Pasión
                  </span>
                </h1>
                
                <p className="text-xl text-blue-100 leading-relaxed max-w-2xl font-light">
                  Plataforma integral para la gestión farmacéutica con tecnología de vanguardia, 
                  cumplimiento regulatorio y los más altos estándares de calidad y seguridad.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1">
                    Explorar Catálogo
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                    Ver Demo
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{stats.totalProducts.toLocaleString()}</div>
                  <div className="text-sm text-blue-200 font-medium">Productos</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{stats.totalCategories}</div>
                  <div className="text-sm text-blue-200 font-medium">Categorías</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{stats.totalPharmacies.toLocaleString()}</div>
                  <div className="text-sm text-blue-200 font-medium">Farmacias</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{stats.totalTransactions.toLocaleString()}</div>
                  <div className="text-sm text-blue-200 font-medium">Transacciones</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center space-x-6">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Control de Calidad</h3>
                      <p className="text-blue-200 text-lg">Certificación ISO 27001</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center space-x-6">
                    <div className="bg-gradient-to-r from-purple-400 to-violet-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Base de Datos Integral</h3>
                      <p className="text-blue-200 text-lg">Información farmacológica completa</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center space-x-6">
                    <div className="bg-gradient-to-r from-red-400 to-pink-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Fingerprint className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Seguridad Avanzada</h3>
                      <p className="text-blue-200 text-lg">Encriptación end-to-end</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Encuentra lo que necesitas</h2>
              <p className="text-gray-600 text-lg">Busca entre miles de productos farmacéuticos</p>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Buscar medicamentos, productos, laboratorios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400 bg-gray-50 focus:bg-white shadow-inner"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg bg-gray-50 focus:bg-white appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Clear Filters */}
              <div className="flex items-center">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-8 py-5 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                >
                  <Filter className="h-6 w-6 inline mr-3 group-hover:rotate-180 transition-transform duration-300" />
                  Limpiar Filtros
                </button>
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtros rápidos:</h3>
              <div className="flex flex-wrap gap-3">
                {['Analgésicos', 'Antibióticos', 'Vitaminas', 'Dermatología', 'Cardiología', 'Pediatría'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedCategory(filter)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === filter
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="mt-8 flex justify-end">
              <div className="flex bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="h-5 w-5" />
                  <span>Lista</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Productos Disponibles</h2>
              <p className="text-gray-600 text-lg">
                Mostrando <span className="font-semibold text-blue-600">{filteredProducts.length}</span> de <span className="font-semibold">{products.length}</span> productos
              </p>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 transform hover:-translate-y-2 ${
                    viewMode === 'list' ? 'flex items-center p-8' : 'p-0'
                  }`}
                >
                  <div className={`${viewMode === 'list' ? 'flex-shrink-0 mr-8' : 'mb-0'}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                          viewMode === 'list' ? 'w-32 h-32 rounded-2xl' : 'w-full h-56 rounded-t-3xl'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                          favorites.has(product.id)
                            ? 'bg-red-500 text-white shadow-2xl scale-110'
                            : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:scale-110'
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.has(product.id) ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                      
                      {viewMode === 'grid' && (
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3">
                            <p className="text-sm text-gray-700 font-medium truncate">{product.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
                    <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-4'}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1 mr-6' : ''}`}>
                        <div className="mb-4">
                          <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                            {typeof product.category === 'string' ? product.category : product.category?.name || 'Sin categoría'}
                          </span>
                        </div>
                        
                        <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 ${
                          viewMode === 'list' ? 'text-2xl mb-2' : 'text-xl mb-3 line-clamp-2'
                        }`}>
                          {product.name}
                        </h3>
                        
                        {viewMode === 'list' && (
                          <p className="text-gray-600 text-lg leading-relaxed mb-4">
                            {product.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(4.5) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              (4.5)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${viewMode === 'list' ? 'flex items-center space-x-6' : 'flex items-center justify-between'}`}>
                        <div className="text-right">
                          <div className={`font-bold text-gray-900 ${
                            viewMode === 'list' ? 'text-3xl' : 'text-3xl'
                          }`}>
                            €{product.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleCart(product.id)}
                          className={`flex items-center space-x-2 font-bold transition-all duration-300 transform hover:scale-105 ${
                            viewMode === 'list' ? 'py-4 px-8 rounded-2xl text-lg' : 'py-4 px-6 rounded-2xl text-lg'
                          } ${
                            cart.has(product.id)
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl hover:shadow-green-500/25'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-blue-500/25'
                          }`}
                        >
                          {cart.has(product.id) ? (
                            <>
                              <CheckCircle className="h-6 w-6" />
                              <span>En Carrito</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-6 w-6" />
                              <span>Agregar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-300 mb-6">
                <Search className="h-24 w-24 mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-gray-600 mb-4">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 text-lg mb-8">
                Intenta ajustar tus filtros de búsqueda o explora nuestras categorías
              </p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl"
              >
                Ver Todos los Productos
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">PharmaCore</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Sistema integral para la gestión farmacéutica con los más altos estándares de calidad y seguridad.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Medicamentos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suplementos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dispositivos Médicos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cosméticos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Consultoría Farmacéutica</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gestión de Inventario</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Auditorías</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Capacitación</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+34 900 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@pharmacore.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Madrid, España</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 PharmaCore. Todos los derechos reservados. | Cumplimiento GDPR | ISO 27001 Certificado</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;