const express = require('express');
const router = express.Router();
const clientLeadController = require('../../controllers/client/clientLeadController');

router.post('/lead', clientLeadController.submitLead);

module.exports = router; 