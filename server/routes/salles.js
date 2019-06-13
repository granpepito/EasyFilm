const express = require('express');
const router = express.Router();
const salle = require('../controllers/salles');

router
	//Afficher les salles
	.get('/all', salle.getAll)

	//Compter toutes les salles
	.get('/countAll', salle.countAll)

	//Créer une nouvelle salle
	.post('/newSalle', salle.newOne)

	.route('/:id')
	//Obtenir une salle
	.get(salle.findOne);

module.exports = router;
