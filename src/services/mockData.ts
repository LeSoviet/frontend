import { Product, Category } from '../types';

// Importar datos del JSON
import mockData from '../DATOS_MOCK_SIMPLIFICADOS.json';

// Mapear categorías del JSON al formato de la aplicación
export const getMockCategories = (): Category[] => {
  return mockData.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    productCount: cat.productCount
  }));
};

// Mapear productos del JSON al formato de la aplicación
export const getMockProducts = (): Product[] => {
  return mockData.products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    activeIngredient: product.activeIngredient,
    strength: product.strength,
    form: product.form,
    manufacturer: product.manufacturer,
    requiresPrescription: product.requiresPrescription,
    image: `/images/products/${product.image.replace('.jpg', '.svg')}`,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }));
};

// Función para obtener productos por categoría
export const getProductsByCategory = (categoryName: string): Product[] => {
  const products = getMockProducts();
  return products.filter(product => product.category === categoryName);
};

// Función para buscar productos
export const searchProducts = (searchTerm: string): Product[] => {
  const products = getMockProducts();
  const term = searchTerm.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.activeIngredient?.toLowerCase().includes(term) ||
    product.manufacturer?.toLowerCase().includes(term)
  );
};

// Función para obtener productos destacados
export const getFeaturedProducts = (): Product[] => {
  const products = getMockProducts();
  // Retornar productos con mayor stock o más populares
  return products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8);
};

// Función para obtener estadísticas
export const getStatistics = () => {
  return mockData.statistics;
};

// Función para obtener formas de productos
export const getProductForms = () => {
  return mockData.productForms;
};

// Función para obtener rangos de precios
export const getPriceRanges = () => {
  return mockData.priceRanges;
};

// Función para obtener fabricantes
export const getManufacturers = () => {
  return mockData.manufacturers;
};

export default {
  getMockCategories,
  getMockProducts,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getStatistics,
  getProductForms,
  getPriceRanges,
  getManufacturers
};