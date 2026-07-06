import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Loader2, Filter, Image as ImageIcon } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: '1 pc',
    categoryId: ''
  });
  const [imageFiles, setImageFiles] = useState([]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { category: categoryFilter !== 'all' ? categoryFilter : null }],
    queryFn: () => productService.getAllProducts({ category: categoryFilter !== 'all' ? categoryFilter : null }),
  });

  const categories = categoriesData?.data?.categories || [];
  const products = productsData?.data?.products || [];

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product created successfully');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error creating product');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product updated successfully');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error updating product');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error deleting product');
    }
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        categoryId: product.categoryId?._id || product.categoryId
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', unit: '1 pc', categoryId: categories[0]?._id || '' });
    }
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('unit', formData.unit);
    data.append('categoryId', formData.categoryId);
    
    Array.from(imageFiles).forEach(file => {
      data.append('images', file);
    });

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Filter className="w-5 h-5" />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none font-bold text-gray-700 outline-none focus:ring-0 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-soft"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                          {prod.images && prod.images[0] ? (
                            <img src={prod.images[0] || 'https://placehold.co/100x100?text=No+Img'} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Img'; }} alt={prod.name} className="w-full h-full object-contain" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{prod.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{prod.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {categories.find(c => c._id === (prod.categoryId?._id || prod.categoryId))?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">₹{prod.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${prod.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(prod)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 mr-2 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if(window.confirm('Delete this product?')) deleteMutation.mutate(prod._id) }} className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-100">
                <h3 className="text-2xl font-black text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 sm:p-8">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select 
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                      <input 
                        type="number" required min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                      <input 
                        type="number" required min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Unit (e.g., 1 kg)</label>
                      <input 
                        type="text" required
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <input 
                        type="file" accept="image/*" multiple
                        onChange={(e) => setImageFiles(e.target.files)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 sm:p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50 mt-auto">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">Cancel</button>
                <button form="product-form" type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-soft">
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-5 h-5 animate-spin" />}
                  Save Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
