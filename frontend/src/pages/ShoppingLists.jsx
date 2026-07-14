import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingListService } from '../services/shoppingListService';
import { useCartStore } from '../stores/useCartStore';
import { Plus, Trash2, Edit2, ShoppingCart, Loader2, List, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SmartSuggestionCard = ({ product, onAddToList }) => (
  <div className="bg-white border border-accentYellow rounded-xl p-4 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 shrink-0">
        <img src={product.images?.[0] || 'https://placehold.co/100x100'} alt={product.name} className="w-full h-full object-contain" />
      </div>
      <div>
        <p className="font-bold text-sm text-gray-900">{product.name}</p>
        <p className="text-xs text-gray-500">₹{product.discountedPrice || product.price}</p>
      </div>
    </div>
    <button 
      onClick={() => onAddToList(product._id)}
      className="bg-accentYellow/10 text-accentYellow p-2 rounded-lg hover:bg-accentYellow hover:text-white transition-colors"
      title="Add to List"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>
);

const ShoppingLists = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const addToCart = useCartStore(state => state.addToCart);

  const { data: listsData, isLoading: loadingLists } = useQuery({
    queryKey: ['shoppingLists'],
    queryFn: shoppingListService.getLists
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ['smartSuggestions'],
    queryFn: shoppingListService.getSmartSuggestions
  });

  const createMutation = useMutation({
    mutationFn: shoppingListService.createList,
    onSuccess: () => {
      queryClient.invalidateQueries(['shoppingLists']);
      setNewListName('');
      toast.success('Shopping list created');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: shoppingListService.deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries(['shoppingLists']);
      setSelectedList(null);
      toast.success('Shopping list deleted');
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: ({ listId, productId }) => shoppingListService.removeItem(listId, productId),
    onSuccess: () => queryClient.invalidateQueries(['shoppingLists'])
  });

  const addItemMutation = useMutation({
    mutationFn: ({ listId, productId }) => shoppingListService.addItem(listId, productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries(['shoppingLists']);
      toast.success('Item added to list');
    }
  });

  const lists = listsData?.data?.data || [];
  const suggestions = suggestionsData?.data?.data || [];
  const activeList = lists.find(l => l._id === selectedList) || lists[0];

  useEffect(() => {
    if (!selectedList && lists.length > 0) {
      setSelectedList(lists[0]._id);
    }
  }, [lists, selectedList]);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      createMutation.mutate(newListName.trim());
    }
  };

  const handleAddAllToCart = (list) => {
    let addedCount = 0;
    list.items.forEach(item => {
      if (item.productId && item.productId.isActive && item.productId.stock > 0) {
        addToCart(item.productId, item.quantity);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} items to cart!`);
    } else {
      toast.error('No available items to add.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <List className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">{t('navbar.shoppingLists') || 'Shopping Lists'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Your Lists</h2>
            
            <form onSubmit={handleCreateList} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New list name..."
                className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button 
                type="submit"
                disabled={createMutation.isPending || !newListName.trim()}
                className="bg-primary text-white p-2 rounded-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>

            {loadingLists ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : lists.length > 0 ? (
              <div className="space-y-2">
                {lists.map(list => (
                  <button
                    key={list._id}
                    onClick={() => setSelectedList(list._id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex justify-between items-center ${
                      selectedList === list._id || activeList?._id === list._id
                        ? 'bg-primary text-white shadow-soft' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{list.name}</span>
                    <span className="opacity-70 text-xs">{list.items.length} items</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No lists created yet.</p>
            )}
          </div>

          {/* Smart Suggestions */}
          {suggestions.length > 0 && activeList && (
            <div className="bg-gradient-to-br from-accentYellow/10 to-transparent rounded-2xl p-6 border border-accentYellow/20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accentYellow" />
                <h2 className="font-bold text-gray-900">Smart Suggestions</h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">Based on your frequent purchases</p>
              <div className="space-y-3">
                {suggestions.map(product => (
                  <SmartSuggestionCard 
                    key={product._id} 
                    product={product} 
                    onAddToList={(id) => addItemMutation.mutate({ listId: activeList._id, productId: id })} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeList ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-gray-900">{activeList.name}</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAddAllToCart(activeList)}
                    disabled={activeList.items.length === 0}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add All to Cart
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this list?')) {
                        deleteMutation.mutate(activeList._id);
                      }
                    }}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete List
                  </button>
                </div>
              </div>

              {activeList.items.length > 0 ? (
                <div className="space-y-4">
                  {activeList.items.map(item => {
                    const product = item.productId;
                    if (!product) return null;
                    const isAvailable = product.isActive && product.stock > 0;

                    return (
                      <div key={item._id} className={`flex items-center justify-between p-4 rounded-xl border ${isAvailable ? 'border-gray-100 bg-white' : 'border-red-100 bg-red-50/30'} shadow-sm`}>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg p-1">
                            <img src={product.images?.[0] || 'https://placehold.co/100x100'} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{product.name}</p>
                            <div className="flex gap-3 items-center mt-1">
                              <span className="text-sm font-bold text-primary">₹{product.discountedPrice || product.price}</span>
                              <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              {!isAvailable && <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">Out of Stock</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => addToCart(product, item.quantity)}
                            disabled={!isAvailable}
                            className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => removeItemMutation.mutate({ listId: activeList._id, productId: product._id })}
                            className="bg-gray-100 text-gray-500 p-2 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <List className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium text-gray-500">This list is empty.</p>
                  <p className="text-sm">Search for products and add them here!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[500px] flex items-center justify-center text-gray-400">
              <p>Select or create a shopping list.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShoppingLists;
