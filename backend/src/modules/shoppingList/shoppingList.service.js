const ShoppingList = require('../../models/ShoppingList.model');
const Order = require('../../models/Order.model');
const Product = require('../../models/Product.model');
const { ErrorResponse } = require('../../common/errors/errorHandler');

class ShoppingListService {
  
  async getListsByUser(userId) {
    return await ShoppingList.find({ userId }).populate('items.productId', 'name price discountedPrice images unit stock isActive');
  }

  async createList(userId, name) {
    return await ShoppingList.create({ userId, name, items: [] });
  }

  async deleteList(userId, listId) {
    const list = await ShoppingList.findOneAndDelete({ _id: listId, userId });
    if (!list) throw new ErrorResponse("List not found or unauthorized", 404);
    return list;
  }

  async renameList(userId, listId, newName) {
    const list = await ShoppingList.findOneAndUpdate(
      { _id: listId, userId },
      { name: newName },
      { new: true }
    );
    if (!list) throw new ErrorResponse("List not found or unauthorized", 404);
    return list;
  }

  async addItem(userId, listId, productId, quantity = 1) {
    const list = await ShoppingList.findOne({ _id: listId, userId });
    if (!list) throw new ErrorResponse("List not found or unauthorized", 404);

    const existingItem = list.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      list.items.push({ productId, quantity });
    }
    await list.save();
    return await list.populate('items.productId', 'name price discountedPrice images unit stock isActive');
  }

  async removeItem(userId, listId, productId) {
    const list = await ShoppingList.findOneAndUpdate(
      { _id: listId, userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId', 'name price discountedPrice images unit stock isActive');
    if (!list) throw new ErrorResponse("List not found or unauthorized", 404);
    return list;
  }

  async updateItemQuantity(userId, listId, productId, quantity) {
    const list = await ShoppingList.findOne({ _id: listId, userId });
    if (!list) throw new ErrorResponse("List not found or unauthorized", 404);

    const item = list.items.find(item => item.productId.toString() === productId);
    if (!item) throw new ErrorResponse("Item not found in list", 404);

    item.quantity = quantity;
    await list.save();
    return await list.populate('items.productId', 'name price discountedPrice images unit stock isActive');
  }

  // Generate smart suggestions based on user's past orders
  async getSmartSuggestions(userId) {
    // Fetch last 50 orders for the user
    const orders = await Order.find({ userId, status: { $in: ['delivered', 'confirmed', 'processing'] } })
      .select('items.productId items.quantity createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    if (orders.length === 0) return []; // Not enough history

    const productStats = {};
    const recentPurchaseWindow = new Date();
    recentPurchaseWindow.setDate(recentPurchaseWindow.getDate() - 7); // within 7 days is considered recent

    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.productId.toString();
        if (!productStats[id]) {
          productStats[id] = { count: 0, totalQty: 0, lastPurchased: order.createdAt };
        }
        productStats[id].count += 1;
        productStats[id].totalQty += item.quantity;
        if (order.createdAt > productStats[id].lastPurchased) {
          productStats[id].lastPurchased = order.createdAt;
        }
      });
    });

    // Score logic: 
    // - purchased frequently (count >= 2)
    // - not purchased super recently (to avoid suggesting things they just bought yesterday, though grocery behavior varies)
    
    const suggestedIds = Object.keys(productStats)
      .filter(id => productStats[id].count > 1) // repeat purchase
      .sort((a, b) => productStats[b].count - productStats[a].count)
      .slice(0, 10);

    if (suggestedIds.length === 0) return [];

    const products = await Product.find({ 
      _id: { $in: suggestedIds },
      isActive: true,
      stock: { $gt: 0 } // Only suggest in-stock items
    });

    return products;
  }
}

module.exports = new ShoppingListService();
