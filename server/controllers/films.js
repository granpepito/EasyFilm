const db = require('../models/database');
const moment = require('moment');
const axios = require('axios');
const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	waitForConnections: true,
	queueLimit: 0,
	dateStrings: true,
	supportBigNumbers: true
});

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
		db.getConnection((err, conn) => {
			conn.beginTransaction(err => {
				if (err) throw err;
				connection
					.promise()
					.execute(
						'INSERT INTO films(`titre`, `duree`, `date_de_sortie`, `droit_diffusion`) VALUES (?, ?, ?, ?)',
						[
							req.body.titreFilm,
							req.body.dureeFilm,
							req.body.dateDeSortie,
							req.body.droitDiffusion
						]
					)
					.then(([rows, fields]) => {
						const filmId = rows.insertId;
						axios
							.get(`http://localhost:${process.env.PORT}/salle/countAll`)
							.then(response => {
								//On regarde si c'est possible d'ajouter les séances compte tenu du nombre de salles disponibles et du nombre de séances déjà programmées
								const nombreDeSalle = response.data[0].nombreDeSalle;

								connection
									.promise()
									.execute(
										//On divise par 2 car il y a les types de séances qui doublent le résultat
										'SELECT count(`seances`.id_seance)/2 as nombreDeSeances FROM `films`, `seances`  WHERE `films`.id_film = `seances`.id_film AND `seances`.date_projection = ?',
										[req.body.dateSeance]
									)
									.then(([rows, fields]) => {
										const nombreDeSeances = rows[0].nombreDeSeances;
										if (nombreDeSeances < nombreDeSalle) {
											var datePremiere = moment(
												req.body.dateSeance,
												'YYYY-MM-DD'
											);

											for (var jour = 0; jour < 7; jour++) {
												const dateProjection = datePremiere
													.clone()
													.add(jour, 'day');

												for (let type = 0; type < 2; type++) {
													connection
														.promise()
														.execute(
															'INSERT INTO `seances`(`id_film`, `type`, `date_projection`, `entrees_previsionnel`) VALUES (?, ?, ?, ?)',
															[
																filmId,
																type,
																dateProjection.format('YYYY-MM-DD'),
																req.body.entreesSeance
															]
														)
														.then(([rows, fields]) => {
															//console.log(rows.insertId);
														})
														.catch(err => {
															conn.rollback(() => {
																//res.sendStatus(500);
																//connection.release();
															});
														});
												}
											}
										}
									})
									.catch(err => {
										console.log(err);
										conn.rollback(() => {
											conn.release();
										});
									});
							});
					});
				connection.commit(err => {
					if (err) {
						connection.rollback(() => {
							//res.sendStatus(500);
							//connection.release();
						});
					} else {
						res.sendStatus(200);
						//connection.release();
					}
				});
			});
		});
	}
};

module.exports = Film;
