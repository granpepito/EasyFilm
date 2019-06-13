const express = require('express');
const router = express.Router();
const salle = require('../controllers/salles');

//Afficher les salles
router
	.get('/all', salle.getAll)
	.get('/countAll', salle.countAll)
	.post('/newSalle', salle.newOne)
	//Afficher une salle
	.route('/:id')
	.get(salle.findOne);

module.exports = router;
