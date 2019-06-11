const db = require('../models/database');
const moment = require('moment');
const axios = require('axios');
const Film = {
	getAll: (req, res) => {
		db.query('SELECT * FROM films', (err, rows) => {
			if (err) {
				res.sendStatus(500);
			}
			res.send(rows);
		});
	},
	search: (req, res) => {
		db.query(
			'SELECT * FROM films WHERE films.titre LIKE ' +
				db.escape('%' + req.query.q + '%'),
			(err, rows) => {
				if (err) {
					res.sendStatus(500).end();
				}
				res.send(rows);
			}
		);
	},
	findOne: (req, res) => {
		db.query(
			'SELECT * FROM films WHERE films.id_film = ?',
			[req.params.id],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	deleteOne: (req, res) => {
		db.query(
			'DELETE FROM ?? WHERE films.id_film = ?',
			['films', req.params.id],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	getBillets: (req, res) => {
		db.query(
			'SELECT billets.* FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND films.id_film = ?',
			['billets', 'films', 'seances', req.params.id],
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
			'SELECT COUNT(billets.id_billets) FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND films.id_film = ?',
			['billets', 'films', 'seances', req.params.id],
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
			'SELECT SUM(billets.prix_vente) FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND films.id_film = ?',
			['billets', 'films', 'seances', req.params.id],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	newOne: (req, res) => {
		db.getConnection((err, connection) => {
			const filmId = '';
			connection.beginTransaction(err => {
				if (err) throw err;
				connection.query(
					'INSERT INTO films(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
					[
						'titre',
						'duree',
						'date_de_sortie',
						'droit_diffusion',
						req.body.titreFilm,
						req.body.dureeFilm,
						req.body.dateDeSortie,
						req.body.droitDiffusion
					],
					(err, rows) => {
						if (err) {
							console.log(err);
							connection.rollback(() => {
								connection.release();
							});
						} else {
							//TODO:
							// const nombreSalle = axios.;
							connection.query(
								'SELECT count(??) FROM ??, ??  WHERE ?? = ?? AND ?? = ?',
								[
									'seances.id_seance',
									'films',
									'seances',
									'films.id_film',
									'seances.id_film',
									'seances.date_projection',
									req.body.dateSeance
								]
							);

							filmId = rows.insertId;
							var date = moment(req.body.dateSeance, 'YYYY-MM-DD');
							for (var jour = 0; jour < 7; jour++) {
								date.add(1, 'day');
								for (var type = 0; type <= 1; type++) {
									connection.query(
										'INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
										[
											'seances',
											'id_film',
											'type',
											'date_projection',
											'entrees_previsionnelle',
											filmId,
											type,
											date.format('YYYY-MM-DD'),
											req.body.entreesSeance
										],
										(err, rows) => {
											if (err) {
												connection.rollback(() => {
													connection.release();
												});
											}
										}
									);
								}
							}
						}
					}
				);
			});
			//TODO:
		});
	}
};

module.exports = Film;
