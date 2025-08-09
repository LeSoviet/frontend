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
  Activity
} from 'lucide-react';
import { Product, Category } from '../types';
import apiService from '../services/api';
import { getMockProducts, getMockCategories, getFeaturedProducts } from '../services/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadData = () => {
      try {
        // Cargar datos del JSON
        const mockProducts = getMockProducts();
        const mockCategories = getMockCategories();
        
        setProducts(mockProducts);
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error loading mock data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simular carga con delay para mostrar loading
    setTimeout(loadData, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.activeIngredient && product.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.manufacturer && product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (productId: string | number) => {
    const id = String(productId);
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const toggleCart = (productId: string | number) => {
    const id = String(productId);
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(id)) {
        newCart.delete(id);
      } else {
        newCart.add(id);
      }
      return newCart;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Cargando...</h2>
          <p>Preparando los productos para ti</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <img 
              src="/images/pharmacy-logo.svg" 
              alt="FarmaPlus Logo" 
              style={{
                height: '40px',
                width: 'auto'
              }}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <Phone size={16} />
              <span>+34 900 123 456</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <ShoppingCart size={16} />
              <span>Carrito ({cart.size})</span>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        
        <div style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 1,
          maxWidth: '800px',
          padding: '0 20px'
        }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}
          >
            Tu Salud, Nuestra Pasión
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}
          >
            Descubre una nueva experiencia farmacéutica con productos certificados, entregas express y el mejor servicio profesional.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              fontSize: '0.9rem'
            }}>
              <Shield size={16} />
              Productos Certificados
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              fontSize: '0.9rem'
            }}>
              <Truck size={16} />
              Entrega 24h
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              fontSize: '0.9rem'
            }}>
              <Users size={16} />
              Asesoría Profesional
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Bar */}
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '20px',
                height: '20px'
              }} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: showFilters ? '#3b82f6' : 'white',
                color: showFilters ? 'white' : '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Filter size={20} />
              Filtros
            </button>
            
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                  color: viewMode === 'grid' ? '#374151' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <Grid3X3 size={16} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                  color: viewMode === 'list' ? '#374151' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <List size={16} />
                Lista
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section style={{
        padding: '48px 16px'
      }} id="products">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '32px',
              gap: '16px'
            }}
          >
            <div>
              <h2 style={{
                fontSize: '30px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Productos Disponibles
              </h2>
              <p style={{
                color: '#4b5563',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Package style={{ width: '20px', height: '20px' }} />
                {filteredProducts.length} productos encontrados
                {searchTerm && (
                  <span style={{
                    color: '#3b82f6',
                    fontWeight: '500'
                  }}>
                    para "{searchTerm}"
                  </span>
                )}
              </p>
            </div>
            
            {/* Sort Options */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#4b5563'
              }}>Ordenar por:</span>
              <select style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}>
                <option>Más relevantes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Nombre A-Z</option>
                <option>Más vendidos</option>
              </select>
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px'
            }}>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                width: '96px',
                height: '96px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Search style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                No se encontraron productos
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '24px',
                maxWidth: '400px',
                margin: '0 auto 24px'
              }}>
                Intenta ajustar tus filtros de búsqueda o explora nuestras categorías populares
              </p>
              <button 
                onClick={clearFilters}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' 
                ? 'repeat(auto-fill, minmax(300px, 1fr))' 
                : '1fr',
              gap: '24px'
            }}>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  {/* Product Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #e2e8f0',
                      overflow: 'hidden'
                    }}>
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            const nextSibling = target.nextElementSibling as HTMLElement;
                            target.style.display = 'none';
                            if (nextSibling) nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Package 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          color: '#64748b',
                          display: product.image ? 'none' : 'block'
                        }} 
                      />
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: favorites.has(String(product.id)) ? '#fef2f2' : '#f9fafb',
                          color: favorites.has(String(product.id)) ? '#ef4444' : '#6b7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Heart
                          size={16}
                          fill={favorites.has(String(product.id)) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div style={{
                    marginBottom: '16px'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {product.name}
                        </h3>
                        {product.category && (
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                          }}>
                            {typeof product.category === 'string' ? product.category : product.category?.name || 'Sin categoría'}
                          </span>
                        )}
                      </div>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        marginBottom: '12px'
                      }}>
                        {product.description}
                      </p>
                      
                      {/* Additional Product Info */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        {product.activeIngredient && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            <Activity size={12} />
                            {product.activeIngredient} {product.strength}
                          </div>
                        )}
                        {product.manufacturer && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            <Award size={12} />
                            {product.manufacturer}
                          </div>
                        )}
                        {product.form && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            <Package size={12} />
                            {product.form}
                          </div>
                        )}
                        {product.requiresPrescription && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fef2f2',
                            color: '#991b1b',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            <Shield size={12} />
                            Receta médica
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px'
                    }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#3b82f6'
                          }}>
                            €{product.price.toFixed(2)}
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                            textDecoration: 'line-through'
                          }}>
                            €{(product.price * 1.2).toFixed(2)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < 4 ? '#fbbf24' : 'none'}
                                color={i < 4 ? '#fbbf24' : '#d1d5db'}
                              />
                            ))}
                          </div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            (4.2)
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          color: product.stock > 10 ? '#059669' : '#dc2626',
                          fontWeight: '500'
                        }}>
                          {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                        </span>
                        
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCart(product.id);
                          }}
                          disabled={product.stock === 0}
                          whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }}
                          whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
                          style={{
                            padding: '10px 18px',
                            background: product.stock === 0 
                              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                              : cart.has(String(product.id)) 
                                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                            opacity: product.stock === 0 ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease',
                            boxShadow: product.stock > 0 ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <motion.div
                            animate={cart.has(String(product.id)) ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <ShoppingCart size={16} />
                          </motion.div>
                          {cart.has(String(product.id)) ? 'En carrito' : product.stock === 0 ? 'Sin stock' : 'Agregar'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '64px 16px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Main Footer Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}>
            {/* Company Info */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white'
                  }}>FarmaDigital</span>
                  <p style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    margin: 0
                  }}>Premium</p>
                </div>
              </div>
              
              <p style={{
                color: '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Líder en productos farmacéuticos y de salud. Más de 10 años brindando calidad, confianza y los mejores precios del mercado.
              </p>
              
              {/* Social Links */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {[
                  { icon: 'f', color: '#1877f2' },
                  { icon: 't', color: '#1da1f2' },
                  { icon: 'in', color: '#0077b5' },
                  { icon: 'ig', color: '#e4405f' }
                ].map((social, index) => (
                  <div
                    key={index}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: social.color,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>{social.icon}</span>
                  </div>
                ))}
              </div>
              
              {/* Certifications */}
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>Certificaciones:</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid #16a34a',
                    borderRadius: '8px',
                    padding: '4px 8px'
                  }}>
                    <span style={{
                      color: '#4ade80',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>ISO 9001</span>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid #2563eb',
                    borderRadius: '8px',
                    padding: '4px 8px'
                  }}>
                    <span style={{
                      color: '#60a5fa',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>AEMPS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '16px'
              }}>Enlaces Rápidos</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {[
                  'Productos',
                  'Categorías',
                  'Ofertas',
                  'Recetas',
                  'Consulta Online',
                  'Blog de Salud'
                ].map((link, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    <a
                      href="#"
                      style={{
                        color: '#d1d5db',
                        textDecoration: 'none',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'color 0.2s'
                      }}
                    >
                      <ChevronRight style={{
                        width: '14px',
                        height: '14px',
                        color: '#60a5fa'
                      }} />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '16px'
              }}>Información de Contacto</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                  </div>
                  <div>
                    <p style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0 0 4px 0'
                    }}>Dirección</p>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      margin: '0'
                    }}>Av. Salud 123, Centro Médico</p>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      margin: '0'
                    }}>Madrid, España 28001</p>
                  </div>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Phone style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                  </div>
                  <div>
                    <p style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0 0 4px 0'
                    }}>Teléfono</p>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      margin: '0'
                    }}>+34 900 123 456</p>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      margin: '0'
                    }}>Atención 24/7</p>
                  </div>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Mail style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                  </div>
                  <div>
                    <p style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0 0 4px 0'
                    }}>Email</p>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      margin: '0'
                    }}>info@farmadigital.es</p>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      margin: '0'
                    }}>Respuesta en 2h</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hours & Status */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                Horarios
              </h3>
              
              {/* Current Status */}
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#4ade80',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{
                    color: '#86efac',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Abierto Ahora</span>
                </div>
                <p style={{
                  color: '#bbf7d0',
                  fontSize: '12px',
                  margin: 0
                }}>Cierra a las 20:00 • Entrega a domicilio disponible</p>
              </div>
                
              {/* Schedule */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '14px'
              }}>
                {[
                  { day: 'Lun - Vie', hours: '8:00 - 20:00', isToday: true },
                  { day: 'Sábados', hours: '9:00 - 14:00', isToday: false },
                  { day: 'Domingos', hours: 'Cerrado', isToday: false },
                  { day: 'Feriados', hours: '10:00 - 14:00', isToday: false }
                ].map((schedule, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    backgroundColor: schedule.isToday ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    color: schedule.isToday ? '#93c5fd' : '#d1d5db'
                  }}>
                    <span style={{ fontWeight: '500' }}>{schedule.day}</span>
                    <span style={{ fontSize: '12px' }}>{schedule.hours}</span>
                  </li>
                ))}
              </ul>
              
              {/* Emergency Contact */}
              <div style={{
                backgroundColor: 'rgba(127, 29, 29, 0.2)',
                border: '1px solid rgba(185, 28, 28, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <Shield style={{ width: '16px', height: '16px', color: '#f87171' }} />
                  <span style={{
                    color: '#fca5a5',
                    fontWeight: '500',
                    fontSize: '12px'
                  }}>Emergencias 24h</span>
                </div>
                <p style={{
                  color: '#fecaca',
                  fontSize: '11px',
                  margin: 0
                }}>+34 112 • Servicio médico de urgencia</p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div style={{
            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px'
                }}>Mantente Informado</h3>
                <p style={{
                  color: '#d1d5db',
                  fontSize: '14px',
                  margin: 0
                }}>Recibe ofertas exclusivas, consejos de salud y novedades directamente en tu email</p>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                width: '100%',
                maxWidth: '400px'
              }}>
                <input 
                  type="email" 
                  placeholder="tu@email.com"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
                <button style={{
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Mail style={{ width: '16px', height: '16px' }} />
                  <span>Suscribirse</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid rgba(55, 65, 81, 0.5)',
            paddingTop: '32px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px',
                color: '#9ca3af'
              }}>
                <p style={{ margin: 0 }}>© 2024 FarmaDigital. Todos los derechos reservados.</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Shield style={{ width: '16px', height: '16px', color: '#4ade80' }} />
                  <span style={{
                    color: '#4ade80',
                    fontWeight: '500'
                  }}>Sitio Seguro SSL</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                fontSize: '14px',
                justifyContent: 'center'
              }}>
                {[
                  'Términos de Servicio',
                  'Política de Privacidad', 
                  'Política de Cookies',
                  'Devoluciones'
                ].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;