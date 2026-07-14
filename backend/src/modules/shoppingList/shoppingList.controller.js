const shoppingListService = require('./shoppingList.service');
const { ErrorResponse } = require('../../common/errors/errorHandler');

exports.getLists = async (req, res, next) => {
  try {
    const lists = await shoppingListService.getListsByUser(req.user.id);
    res.status(200).json({ success: true, data: lists });
  } catch (err) {
    next(err);
  }
};

exports.createList = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(new ErrorResponse("List name is required", 400));
    const list = await shoppingListService.createList(req.user.id, name);
    res.status(201).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.renameList = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) return next(new ErrorResponse("List name is required", 400));
    const list = await shoppingListService.renameList(req.user.id, id, name);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    await shoppingListService.deleteList(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return next(new ErrorResponse("productId is required", 400));
    const list = await shoppingListService.addItem(req.user.id, req.params.id, productId, quantity);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const list = await shoppingListService.removeItem(req.user.id, req.params.id, productId);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.updateItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return next(new ErrorResponse("Valid quantity is required", 400));
    const list = await shoppingListService.updateItemQuantity(req.user.id, req.params.id, productId, quantity);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.getSmartSuggestions = async (req, res, next) => {
  try {
    const suggestions = await shoppingListService.getSmartSuggestions(req.user.id);
    res.status(200).json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
};
