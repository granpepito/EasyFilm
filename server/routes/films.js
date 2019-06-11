const express = require('express');
const router = express.Router();
const film = require('../controllers/films');

router
	.get('/all', film.getAll) //Afficher tous les films

	.get('/search', film.search); //Rechercher des films (titre)

router
	.route('/:id')
	.get(film.findOne) //Obtenir un film
	.put()
	.delete(film.deleteOne); //supprimer un film

//Obtenir tous les billets d'un film
router
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

//TODO:
//.get('/benef/');
//Calculer le bénéfice/perte d'un film à la semaine

//Calculer le bénéfice/perte pour tous les films qui ont eu des séances cette semaine

//Ajouter un film (Ajouter un film implique d'aussi ajouter la première séance!)
router.post('/newFilm', film.newOne);

module.exports = router;
