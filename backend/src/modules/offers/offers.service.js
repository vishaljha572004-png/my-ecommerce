const PersonalizedOffer = require('../../models/PersonalizedOffer.model');
const Order = require('../../models/Order.model');
const UserInteraction = require('../../models/UserInteraction.model');

class OfferService {
  
  async getEligibleOffers(userId) {
    const now = new Date();
    
    
    const potentialOffers = await PersonalizedOffer.find({
      isActive: true,
      expiresAt: { $gt: now },
      $or: [
        { userId: userId },
        { userId: null }
      ]
    });

    const eligibleOffers = [];

    
    for (const offer of potentialOffers) {
      if (offer.userId && offer.userId.toString() === userId.toString()) {
        eligibleOffers.push(offer);
        continue;
      }

      if (offer.ruleType === "frequent_buyer") {
        
        const orderCount = await Order.countDocuments({ userId, status: 'delivered' });
        if (orderCount >= 5) eligibleOffers.push(offer);
      } 
      else if (offer.ruleType === "inactive_user") {
        
        const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
        if (!lastOrder) {
          eligibleOffers.push(offer);
        } else {
          const daysSinceLastOrder = (now - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24);
          if (daysSinceLastOrder > 30) eligibleOffers.push(offer);
        }
      }
      else if (offer.ruleType === "cart_abandonment") {
        
        const lastCartInteraction = await UserInteraction.findOne({ userId, type: 'cart' }).sort({ createdAt: -1 });
        if (lastCartInteraction) {
          const daysSinceCart = (now - new Date(lastCartInteraction.createdAt)) / (1000 * 60 * 60 * 24);
          if (daysSinceCart > 1 && daysSinceCart < 7) {
             const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
             if (!lastOrder || (now - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24) > 3) {
               eligibleOffers.push(offer);
             }
          }
        }
      }
      else {
        
        eligibleOffers.push(offer);
      }
    }

    return eligibleOffers;
  }

  async validateAndCalculateDiscount(userId, offerId, cartSubtotal, cartItems) {
    const offer = await PersonalizedOffer.findById(offerId);
    if (!offer || !offer.isActive || new Date() > offer.expiresAt) {
      return { valid: false, error: "Offer is invalid or expired." };
    }

    if (offer.userId && offer.userId.toString() !== userId.toString()) {
      return { valid: false, error: "Unauthorized offer." };
    }

    if (cartSubtotal < offer.minOrderValue) {
      return { valid: false, error: `Minimum order value of ₹${offer.minOrderValue} required.` };
    }

    
    let eligibleSubtotal = cartSubtotal;
    if (offer.eligibleCategory) {
      eligibleSubtotal = 0;
      cartItems.forEach(item => {
        
        if (item.product.category && item.product.category.toString() === offer.eligibleCategory.toString()) {
          eligibleSubtotal += (item.product.discountedPrice || item.product.price) * item.quantity;
        }
      });
      
      if (eligibleSubtotal === 0) {
        return { valid: false, error: "Cart does not contain items eligible for this offer." };
      }
    }

    let discountAmount = 0;
    if (offer.discountType === 'fixed') {
      discountAmount = Math.min(offer.discountValue, eligibleSubtotal);
    } else {
      discountAmount = (eligibleSubtotal * offer.discountValue) / 100;
      if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
        discountAmount = offer.maxDiscount;
      }
    }

    return { valid: true, discountAmount };
  }
}

module.exports = new OfferService();
