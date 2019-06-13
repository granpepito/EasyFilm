const express = require('express');
const router = express.Router();
const billet = require('../controllers/billets');

router
	//Obtenir tous les billets
	.get('/all', billet.getAll)

	.route('/:id')
	//Obtenir un billet
	.get(billet.findOne)

	//.put() //mettre à jour un billet

	//Supprimer un biller
	.delete(billet.deleteOne);

//Vendre un billet
router.post('/newBillet', billet.newOne);

module.exports = router;
