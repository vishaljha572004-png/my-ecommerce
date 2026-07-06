import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });

  const categories = data?.data?.categories || [];

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created successfully');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error creating category');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated successfully');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error updating category');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error deleting category');
    }
  });

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('isActive', formData.isActive);
    if (imageFile) {
      data.append('image', imageFile);
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 ml-2">All Categories</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-soft"
        >
          <Plus className="w-5 h-5" /> Add Category
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-full overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                          {cat.image ? (
                            <img src={cat.image || 'https://placehold.co/100x100?text=No+Img'} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Img'; }} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{cat.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{cat.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(cat)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 mr-2 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if(window.confirm('Delete this category?')) deleteMutation.mutate(cat._id) }} className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-100">
                <h3 className="text-2xl font-black text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 sm:p-8">
                <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                      rows="3" required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category Image</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <input 
                        type="file" accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input 
                      type="checkbox" id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-gray-900 cursor-pointer">
                      Category is Active
                    </label>
                  </div>
                </form>
              </div>
              
              <div className="p-6 sm:p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50 mt-auto">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">Cancel</button>
                <button form="category-form" type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-soft">
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-5 h-5 animate-spin" />}
                  Save Category
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
