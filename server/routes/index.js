const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	//homepage
	res.sendStatus(200);
});

module.exports = router;
