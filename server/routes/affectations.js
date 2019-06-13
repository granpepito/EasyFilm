const express = require('express');
const router = express.Router();
const affectation = require('../controllers/affectations');

router.get('/all', affectation.getAll);

module.exports = router;
