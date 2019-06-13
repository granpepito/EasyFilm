const db = require('../models/database');

const Affectation = {
	getAll: (req, res) => {
		db.query('SELECT * FROM ??', ['affectations'], (err, rows) => {
			if (err) res.sendStatus(500);
			res.send(rows);
		});
	}
};

module.exports = Affectation;
