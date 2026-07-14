const express = require('express');
const router = express.Router();
const offersController = require('./offers.controller');
const { protect } = require('../auth/auth.middleware');

router.use(protect); 

router.get('/my-offers', offersController.getMyOffers);
router.post('/validate', offersController.validateOffer);

module.exports = router;
