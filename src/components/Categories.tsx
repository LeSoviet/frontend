import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  AlertTriangle,
  X,
  Package,
  Grid,
  List,
  Eye,
} from 'lucide-react';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import apiService from '../services/api';

const categorySchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  description: yup.string().required('La descripción es requerida'),
});

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateCategoryRequest | UpdateCategoryRequest>({
    resolver: yupResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (category?: Category) => {
    setEditingCategory(category || null);
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description);
    } else {
      reset();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      if (editingCategory) {
        const response = await apiService.updateCategory(Number(editingCategory.id), data);
        if (response.success) {
          setCategories(categories.map(c => c.id === editingCategory.id ? response.data : c));
        }
      } else {
        const response = await apiService.createCategory(data as CreateCategoryRequest);
        if (response.success) {
          setCategories([...categories, response.data]);
        }
      }
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      const response = await apiService.deleteCategory(Number(category.id));
      if (response.success) {
        setCategories(categories.filter(c => c.id !== category.id));
      }
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la categoría');
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
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h1 className="page-title">Gestión de Categorías</h1>
          <p className="page-subtitle">
            Organiza y administra las categorías de productos farmacéuticos
          </p>
        </div>
        <div className="categories-actions">
          <button
            onClick={() => openModal()}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="categories-filters">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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

      {/* Categories Grid */}
      <div className="categories-grid">
        {filteredCategories.length === 0 && !loading ? (
          <div className="empty-state">
            <FolderOpen className="empty-icon" />
            <h3 className="empty-title">No hay categorías</h3>
            <p className="empty-description">
              {searchTerm ? 'No se encontraron categorías con ese término' : 'Comienza creando una nueva categoría para organizar tus productos farmacéuticos.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="btn btn-primary mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Categoría
              </button>
            )}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-icon">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <div className="category-actions">
                  <button
                    onClick={() => openModal(category)}
                    className="action-btn"
                    title="Editar categoría"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="action-btn"
                    title="Ver productos"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category)}
                    className="action-btn danger"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                
                <div className="category-stats">
                  <div className="stat">
                    <span className="stat-label">Productos</span>
                    <span className="stat-value">{category.productCount || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Estado</span>
                    <span className="stat-value active">Activa</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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
                        placeholder="Nombre de la categoría"
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
                        rows={4}
                        className="input-field"
                        placeholder="Descripción de la categoría"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary sm:ml-3">
                    {editingCategory ? 'Actualizar' : 'Crear'}
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
                      Eliminar Categoría
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

export default Categories;