const express = require('express');
const router = express.Router();
const billet = require('../controllers/billets');

router
	.get('/all', billet.getAll)

	.route('/:id')
	.get(billet.findOne)

	.put() //mettre à jour un billet

	.delete(billet.deleteOne);

//Vendre un billet
router.post('/newBillet', billet.newOne);

module.exports = router;
