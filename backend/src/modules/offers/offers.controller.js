const offerService = require('./offers.service');
const { ErrorResponse } = require('../../common/errors/errorHandler');

exports.getMyOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getEligibleOffers(req.user.id);
    res.status(200).json({ success: true, data: offers });
  } catch (err) {
    next(err);
  }
};

exports.validateOffer = async (req, res, next) => {
  try {
    const { offerId, cartSubtotal, cartItems } = req.body;
    if (!offerId || !cartSubtotal) {
      return next(new ErrorResponse("offerId and cartSubtotal are required", 400));
    }
    
    const result = await offerService.validateAndCalculateDiscount(req.user.id, offerId, cartSubtotal, cartItems || []);
    
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.error });
    }
    
    res.status(200).json({ success: true, discountAmount: result.discountAmount });
  } catch (err) {
    next(err);
  }
};
