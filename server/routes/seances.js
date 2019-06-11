const express = require('express');
const router = express.Router();
const seance = require('../controllers/seances');

//Afficher toutes les séances
//Un peu inutiles, mieux vaut afficher toutes les séances qui n'ont pas encore été effectuées voire ne pas afficher du tout toutes les séances
router
	.get('/all', seance.getAll)

	.get('/search', seance.search);

//Afficher toutes les séances pour une semaine donnée

//get seance i
router
	.route('/:id')
	.get(seance.findOne) //Obtenir une seance
	.delete(seance.deleteOne);

//Obtenir tous les billets d'une séance
router
	.get('/:id/billets', seance.getBillets)

	//Obtenir le nombre de billets vendus pour une séance
	.get('/:id/billets/count', seance.countBillets)

	//Calculer le bénéfice/perte d'une séance
	.get('/:id/billets/benef', seance.getBenefice);

//.post('/newSeance', seance.newOne);

//Calculer le nombre d'entrées prévisionnel pour la semaine

// router.get('/:id/:id_film', (req, res) => {
//     const method = req.method; const routePath = req.route.path; const query = req.query;
//     console.log({ method, routePath, query });
//     db.query('SELECT FROM WHERE', [req.params.id, req.params.id_film], (err, rows, fields) => {
//         if (err){
//             res.sendStatus(500)
//         }
//         res.send(rows)
//     })
// })

// .get('/seances', function(req, res){ //Chercher les salles affectées
//   db.query(
//       'SELECT seances.*, salles.* ' +
//       'FROM affectations, salles, seances ' +
//       'WHERE seances.id_seance = affectations.seance ' +
//       'AND affectations.salle = ? ' +
//       'AND seances.date_projection >= ?',
//       [req.query.salle, req.query.when], (err, results) =>{
//     if (err){
//       res.sendStatus(500);
//       res.end()
//     }
//     res.json(results);
//     res.end()
//   })
// })

module.exports = router;
