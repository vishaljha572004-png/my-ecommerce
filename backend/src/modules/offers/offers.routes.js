const express = require('express');
const router = express.Router();
const offersController = require('./offers.controller');
const { authenticate } = require('../auth/auth.middleware');

router.use(authenticate); 

router.get('/my-offers', offersController.getMyOffers);
router.post('/validate', offersController.validateOffer);

module.exports = router;
