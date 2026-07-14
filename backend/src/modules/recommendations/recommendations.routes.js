const express = require('express');
const router = express.Router();
const recommendationsController = require('./recommendations.controller');
const { protect } = require('../auth/auth.middleware'); // Assuming protect middleware exists

// User-specific personalized recommendations
router.get('/personalized', protect, recommendationsController.getPersonalized);

// Product-specific recommendations
router.get('/:productId/frequently-bought', recommendationsController.getFrequentlyBoughtTogether);
router.get('/:productId/similar', recommendationsController.getSimilar);

// Log an interaction
// Using protect here, or we could make it optional if we tracked anonymous sessions.
// For now, only authenticated users get behavior tracking.
router.post('/interaction', protect, recommendationsController.logInteraction);

module.exports = router;
