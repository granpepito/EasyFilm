// get the client
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

module.exports = connection;
