const express = require('express');
const router = express.Router();
const recommendationsController = require('./recommendations.controller');
const { authenticate } = require('../auth/auth.middleware'); 


router.get('/personalized', authenticate, recommendationsController.getPersonalized);


router.get('/:productId/frequently-bought', recommendationsController.getFrequentlyBoughtTogether);
router.get('/:productId/similar', recommendationsController.getSimilar);




router.post('/interaction', authenticate, recommendationsController.logInteraction);

module.exports = router;
