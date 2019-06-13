const db = require('../models/database');

const Seance = {
	getAll: (req, res) => {
		db.query(
			'SELECT films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film ',
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
					res.end();
				}
				res.send(rows);
			}
		);
	},
	search: (req, res) => {
		switch (req.query.date) {
			//Afficher toutes les séances après un jour donné
			case 'after':
				db.query(
					'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection >= ?;',
					[req.query.date],
					(err, rows) => {
						if (err) {
							res.sendStatus(500);
							res.end();
						}
						res.send(rows);
					}
				);
				break;
			case 'before':
				//Afficher toutes les séances avant un jour donné
				db.query(
					'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection <= ?;',
					[req.query.date],
					(err, rows) => {
						if (err) {
							res.sendStatus(500);
							res.end();
						}
						res.send(rows);
					}
				);
				break;
		}
		if (req.query.type) {
			//Chercher les séances à une heure donnée (un type de seance donné)
			db.query(
				'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection = ? AND seances.type = ?;',
				[req.query.date, req.query.type],
				(err, rows) => {
					if (err) {
						res.sendStatus(500);
						res.end();
					}
					res.send(rows);
				}
			);
		} else {
			//Afficher toutes les séances pour un jour donné
			db.query(
				'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection = ?;',
				[req.query.date],
				(err, rows) => {
					if (err) {
						res.sendStatus(500);
						res.end();
					}
					res.send(rows);
				}
			);
		}
	},
	findOne: (req, res) => {
		db.query(
			'SELECT films.titre, seances.* FROM ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = ?',
			['films', 'seances', req.params.id],
			(err, rows, fields) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	deleteOne: (req, res) => {
		//Supprimer une séance

		db.query(
			'DELETE FROM ?? WHERE seances.id_seance = ?',
			['seances', req.params.id],
			(err, rows, fields) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	getAffectation: (req, res) => {
		db.query(
			'SELECT ?? FROM ??, ?? WHERE ?? = ?? AND ?? = ?',
			[
				'salle',
				'affectations',
				'seances',
				'seances.id_seance',
				'affectations.seance',
				'seances.id_seance',
				req.params.id
			],
			(err, rows) => {
				if (err) res.sendStatus(500);
				res.send(rows);
			}
		);
	},
	getBillets: (req, res) => {
		db.query(
			'SELECT billets.* FROM ??, ?? WHERE seances.id_seance = billets.id_seance AND seances.id_seance = ?',
			['billets', 'seances', req.params.id],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	countBillets: (req, res) => {
		db.query(
			'SELECT COUNT(??) AS billetsVendus FROM ??, ?? WHERE ?? = ?? AND ?? = ?',
			[
				'billets.id_billet',
				'billets',
				'seances',
				'seances.id_seance',
				'billets.id_seance',
				'seances.id_seance',
				req.params.id
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	getBenefice: (req, res) => {
		db.query(
			'SELECT SUM(??) AS benefice FROM ??, ?? WHERE ?? = ?? AND ?? = ?',
			[
				'billets.prix_vente',
				'billets',
				'seances',
				'seances.id_seance',
				'billets.id_seance',
				'seances.id_seance',
				req.params.id
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	}
};

module.exports = Seance;
