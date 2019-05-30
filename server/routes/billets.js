const express = require('express');
const router = express.Router();
const db = require('../database/db.js');

router
	.get('/all', (req, res) => {
		db.query('SELECT * FROM ??', ['billets'], (err, rows) => {
			if (err) res.sendStatus(500);
			res.send(rows);
		});
	})

	.route('/:id')
	.get((req, res) => {
		//Obtenir un billet
		db.query(
			'SELECT * FROM ?? WHERE ?? = ?',
			['billets', 'billets.id_billet', req.params.id],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	})

	.put() //mettre à jour un billet

	.delete((req, res) => {
		//Supprimer un billet
		db.query(
			'DELETE FROM ?? WHERE ?? = ?',
			['billets', 'billets.id_billet', req.params.id],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	});

//Vendre un billet
router.post('/newBillet', (req, res) => {
	db.query(
		'INSERT INTO ??(??) VALUES (?)',
		['billets', 'id_seance', req.body.idSeance],
		(err, rows) => {
			console.log(err);
			if (err) res.sendStatus(500);
			res.send(rows);
		}
	);
});

module.exports = router;
