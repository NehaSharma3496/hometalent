const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client/clientController');

router.post('/contact-us', clientController.submitContactUs);
router.post('/lead', clientController.submitLead);
router.post('/feedback', clientController.submitFeedback);

module.exports = router; 