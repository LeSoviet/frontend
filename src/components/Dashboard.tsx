import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Package,
  FolderOpen,
  AlertTriangle,
  TrendingUp,
  Users,
  ShoppingCart,
  Activity,
  DollarSign,
  Eye,
} from 'lucide-react';
import { DashboardStats, Product } from '../types';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError('Error al cargar las estadísticas');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="error-card">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
            <p className="mt-1 text-sm text-red-600">{error || 'Error al cargar los datos'}</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Productos',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-primary-600',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Categorías',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'bg-medical-600',
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Stock Bajo',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-yellow-600',
      change: '-8%',
      changeType: 'negative',
    },
    {
      name: 'Valor Total',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-600',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  const chartData = {
    labels: stats.recentProducts.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
    datasets: [
      {
        label: 'Stock',
        data: stats.recentProducts.map(p => p.stock),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const stockDistribution = {
    labels: ['Stock Normal', 'Stock Bajo', 'Sin Stock'],
    datasets: [
      {
        data: [
          stats.totalProducts - stats.lowStockProducts,
          stats.lowStockProducts,
          Math.floor(stats.totalProducts * 0.1), // Simulated out of stock
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock de Productos Recientes',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Stock',
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Control</h1>
          <p className="dashboard-subtitle">
            Gestión integral del sistema farmacéutico
          </p>
        </div>
        <div className="dashboard-actions">
          <Link to="/admin/products" className="btn btn-primary">
            <Package className="h-4 w-4 mr-2" />
            Gestionar Productos
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <Package className="h-6 w-6" />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Total Productos</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <p className="stat-change positive">+12% este mes</p>
          </div>
          <Link to="/admin/products" className="stat-link">
            Ver todos →
          </Link>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Categorías</h3>
            <p className="stat-value">{stats.totalCategories}</p>
            <p className="stat-change positive">Activas</p>
          </div>
          <Link to="/admin/categories" className="stat-link">
            Gestionar →
          </Link>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Stock Bajo</h3>
            <p className="stat-value">{stats.lowStockProducts}</p>
            <p className="stat-change negative">Requiere atención</p>
          </div>
          <div className="stat-link">
            Revisar inventario
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Valor Total</h3>
            <p className="stat-value">${stats.totalValue.toLocaleString()}</p>
            <p className="stat-change positive">Inventario completo</p>
          </div>
          <div className="stat-link">
            Ver detalles
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Productos por Categoría</h3>
            <div className="chart-actions">
              <button className="btn btn-ghost btn-sm">
                <Activity className="h-4 w-4 mr-1" />
                Ver detalles
              </button>
            </div>
          </div>
          <div className="chart-content">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Distribución de Stock</h3>
            <div className="chart-actions">
              <button className="btn btn-ghost btn-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Análisis
              </button>
            </div>
          </div>
          <div className="chart-content">
            <Doughnut data={stockDistribution} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">Acciones Rápidas</h3>
        <div className="actions-grid">
          <Link to="/admin/products" className="action-card">
            <Package className="h-8 w-8 text-primary-600" />
            <h4>Agregar Producto</h4>
            <p>Añadir nuevo medicamento al inventario</p>
          </Link>
          <Link to="/admin/categories" className="action-card">
            <FolderOpen className="h-8 w-8 text-success-600" />
            <h4>Nueva Categoría</h4>
            <p>Crear categoría de productos</p>
          </Link>
          <button className="action-card">
            <AlertTriangle className="h-8 w-8 text-warning-600" />
            <h4>Revisar Stock</h4>
            <p>Verificar productos con stock bajo</p>
          </button>
          <button className="action-card">
            <Activity className="h-8 w-8 text-info-600" />
            <h4>Generar Reporte</h4>
            <p>Crear informe de inventario</p>
          </button>
        </div>
      </div>

      {/* Recent Products */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Productos Recientes</h3>
          <p className="text-sm text-gray-500">Últimos productos agregados al sistema</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {typeof product.category === 'string' ? product.category : product.category?.name || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock < 10
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="text-primary-600 hover:text-primary-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;