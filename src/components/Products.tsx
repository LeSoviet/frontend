import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  X,
  Filter,
  Grid,
  List,
} from 'lucide-react';
import { Product, Category, CreateProductRequest, UpdateProductRequest } from '../types';
import apiService from '../services/api';

const productSchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  description: yup.string().required('La descripción es requerida'),
  price: yup.number().positive('El precio debe ser positivo').required('El precio es requerido'),
  stock: yup.number().min(0, 'El stock no puede ser negativo').required('El stock es requerido'),
  category_id: yup.number().positive('Debe seleccionar una categoría').required('La categoría es requerida'),
});

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateProductRequest | UpdateProductRequest>({
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.data);
      }
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    if (product) {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('stock', product.stock);
      setValue('category_id', product.category_id || 0);
    } else {
      reset();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    try {
      if (editingProduct) {
        const response = await apiService.updateProduct(Number(editingProduct.id), data);
        if (response.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
        }
      } else {
        const response = await apiService.createProduct(data as CreateProductRequest);
        if (response.success) {
          setProducts([...products, response.data]);
        }
      }
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      const response = await apiService.deleteProduct(Number(product.id));
      if (response.success) {
        setProducts(products.filter(p => p.id !== product.id));
      }
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h1 className="page-title">Gestión de Productos</h1>
          <p className="page-subtitle">
            Administra el inventario completo de medicamentos y productos farmacéuticos
          </p>
        </div>
        <div className="products-actions">
          <button
            onClick={() => openModal()}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="products-filters">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, principio activo o laboratorio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select
              className="filter-select"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="btn btn-ghost">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
        <div className="view-controls">
          <div className="view-toggle">
            <button className="view-btn active">
              <Grid className="h-4 w-4" />
            </button>
            <button className="view-btn">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package className="empty-icon" />
            <h3 className="empty-title">No hay productos</h3>
            <p className="empty-description">
              {searchTerm ? 'No se encontraron productos con ese criterio de búsqueda.' : 'Comienza agregando un nuevo producto al inventario.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="btn btn-primary mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Producto
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const category = categories.find(c => c.id === product.category_id);
            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <div className="product-icon">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => openModal(product)}
                      className="action-btn"
                      title="Editar producto"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="action-btn"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                      className="action-btn danger"
                      title="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description}
                  </p>
                  
                  <div className="product-category">
                    <span className="category-badge">
                      {category?.name || 'Sin categoría'}
                    </span>
                  </div>
                  
                  <div className="product-stats">
                    <div className="stat">
                      <span className="stat-label">Stock</span>
                      <span className={`stat-value ${
                        product.stock < 10 ? 'low' : 
                        product.stock < 50 ? 'medium' : 'high'
                      }`}>
                        {product.stock}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Precio</span>
                      <span className="stat-value">${product.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="product-status">
                    <span className={`status-badge ${
                      product.stock === 0 ? 'out-of-stock' :
                      product.stock < 10 ? 'low-stock' : 'in-stock'
                    }`}>
                      {product.stock === 0 ? 'Sin stock' :
                       product.stock < 10 ? 'Stock bajo' : 'Disponible'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="input-field"
                        placeholder="Nombre del producto"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="input-field"
                        placeholder="Descripción del producto"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio
                        </label>
                        <input
                          {...register('price')}
                          type="number"
                          step="0.01"
                          className="input-field"
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          {...register('stock')}
                          type="number"
                          className="input-field"
                          placeholder="0"
                        />
                        {errors.stock && (
                          <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                      </label>
                      <select {...register('category_id')} className="input-field">
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary sm:ml-3">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                  <button type="button" onClick={closeModal} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setDeleteConfirm(null)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminar Producto
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar "{deleteConfirm.name}"? Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;