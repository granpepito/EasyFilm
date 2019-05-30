const express = require('express');
const router = express.Router();
const db = require('../database/db.js');

//Afficher les salles
router.get('/all', (req, res) => {
	if (req.query.order) {
		switch (req.query.order) {
			case 'asc':
				db.query('SELECT * FROM salles ORDER by capacite ASC', (err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					res.send(rows);
				});
				break;
			case 'desc':
				db.query('SELECT * FROM salles ORDER by capacite DESC', (err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					res.send(rows);
				});
				break;
		}
	} else {
		db.query('SELECT * FROM salles ', (err, rows) => {
			if (err) {
				res.sendStatus(500);
			}
			res.send(rows);
		});
	}
});

//Afficher une salle
router.route('/:id').get((req, res) => {
	db.query(
		'SELECT * FROM salles WHERE salles.numero_salle = ?',
		[req.params.id],
		(err, rows) => {
			if (err) {
				res.sendStatus(500);
			}
			res.send(rows);
		}
	);
});

module.exports = router;
