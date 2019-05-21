const express = require('express');
const router = express.Router();
const db = require('../database/db.js');

//peu utile
// router.get('/', function(req,res){ //homepage
//     const method = req.method; const routePath = req.route.path; const query = req.query;
//     console.log({ method, routePath, query });
//     //res.sendFile(__dirname + '/file.html');
// });

module.exports = router;