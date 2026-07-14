const express = require('express');
const router = express.Router();
const shoppingListController = require('./shoppingList.controller');
const { protect } = require('../auth/auth.middleware');

router.use(protect); 

router.route('/')
  .get(shoppingListController.getLists)
  .post(shoppingListController.createList);

router.get('/suggestions', shoppingListController.getSmartSuggestions);

router.route('/:id')
  .put(shoppingListController.renameList)
  .delete(shoppingListController.deleteList);

router.route('/:id/items')
  .post(shoppingListController.addItem);

router.route('/:id/items/:productId')
  .put(shoppingListController.updateItemQuantity)
  .delete(shoppingListController.removeItem);

module.exports = router;
