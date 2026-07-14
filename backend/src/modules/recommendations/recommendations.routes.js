const express = require('express');
const router = express.Router();
const recommendationsController = require('./recommendations.controller');
const { protect } = require('../auth/auth.middleware'); 


router.get('/personalized', protect, recommendationsController.getPersonalized);


router.get('/:productId/frequently-bought', recommendationsController.getFrequentlyBoughtTogether);
router.get('/:productId/similar', recommendationsController.getSimilar);




router.post('/interaction', protect, recommendationsController.logInteraction);

module.exports = router;
