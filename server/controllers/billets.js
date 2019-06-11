const db = require('../models/database');

const Billet = {
	getAll: (req, res) => {
		db.query('SELECT * FROM ??', ['billets'], (err, rows) => {
			if (err) res.sendStatus(500);
			res.send(rows);
		});
	},
	findOne: (req, res) => {
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
	},
	deleteOne: (req, res) => {
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
	},
	newOne: (req, res) => {
		db.query(
			'INSERT INTO ??(??) VALUES (?)',
			['billets', 'id_seance', req.body.idSeance],
			(err, rows) => {
				console.log(err);
				if (err) res.sendStatus(500);
				res.send(rows);
			}
		);
	}
};

module.exports = Billet;
