const db = require('../models/database.js');

const Salle = {
	getAll: (req, res) => {
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
			default:
				db.query('SELECT * FROM salles ', (err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					res.send(rows);
				});
		}
	},
	countAll: (req, res) => {
		db.query('SELECT COUNT(*) FROM ??', ['salles'], (err, rows) => {
			if (err) res.sendStatus(500);
			res.send(rows);
		});
	},
	findOne: (req, res) => {
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
	},
	newOne: (req, res) => {
		db.query(
			'INSERT INTO ??(??, ??) VALUES (?, ?)',
			[
				'salles',
				'numero_salle',
				'capacite',
				req.body.numeroSalle,
				req.body.capaciteSalle
			],
			(err, rows) => {
				if (err) res.sendStatus(500);
				res.send(rows);
			}
		);
	}
};

module.exports = Salle;
