const express = require('express');
const router = express.Router();
const seance = require('../controllers/seances');

router
	//Afficher toutes les séances
	.get('/all', seance.getAll)
	//Rechercher une séance
	.get('/search', seance.search);

router

	.route('/:id')
	.get(seance.findOne) //Obtenir une seance
	.delete(seance.deleteOne); // Supprimer une seance

router
	//Obtenir la salle affectée à la séance
	.get('/:id/affectation', seance.getAffectation)
	//Obtenir tous les billets d'une séance
	.get('/:id/billets', seance.getBillets)

	//Obtenir le nombre de billets vendus pour une séance
	.get('/:id/billets/count', seance.countBillets)

	//Calculer le bénéfice/perte d'une séance
	.get('/:id/billets/benef', seance.getBenefice);

module.exports = router;
