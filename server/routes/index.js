const express = require('express');
const router = express.Router();
const moment = require('moment');

//peu utile
router.get('/', function(req, res) {
	//homepage
	var a = moment('2016-01-05', 'YYYY-MM-DD').add(1, 'day');
	var b = a
		.clone()
		.add(2, 'day')
		.add(1, 'day');
	console.log(a.format());
	console.log(b.format('YYYY-MM-DD'));
	res.sendStatus(200);
	//res.sendFile(__dirname + '/file.html');
});

module.exports = router;
