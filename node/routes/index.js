const express = require('express');
const router = express.Router();
const db = require('./database/db.js');

router.get('/', function(req,res){ //homepage
    res.sendFile(__dirname + '/file.html');
});



module.exports = router;