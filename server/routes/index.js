const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

//peu utile
router.get('/', function(req, res) {
	//homepage
	res.sendStatus(200);
});

module.exports = router;
