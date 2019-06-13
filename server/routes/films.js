const express = require('express');
const router = express.Router();
const film = require('../controllers/films');

router
	//Afficher tous les films
	.get('/all', film.getAll)

	//Rechercher des films (titre)
	.get('/search', film.search);

router
	.route('/:id')
	//Obtenir un film
	.get(film.findOne)
	.put()
	//supprimer un film
	.delete(film.deleteOne);

router
	//Obtenir tous les billets d'un film
	.get('/:id/billets', film.getBillets)

	//Obtenir le nombre de billets vendus
	.get('/:id/billets/count', film.countBillets)

	//Calculer le bénéfice/perte d'un film
	.get('/:id/billets/benef', film.getBenefice)

	//Calcul du bénéfice de tous les films
	.get('/benef', (req, res) => {
		db.query(
			'SELECT films.id_film, films.titre, SUM(billets.prix_vente) FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance',
			['billets', 'films', 'seances'],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	});

//Ajouter un film (et ses 7 premières séances!)
router.post('/newFilm', film.newOne);

module.exports = router;
