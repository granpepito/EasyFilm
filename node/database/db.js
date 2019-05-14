const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "easyfilm",
    password: "*sC3MUX82%",
    database: "easyfilm",
    dateStrings: true
});

pool.getConnection((function (err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection){
        console.log("Database connection has been accepted");
        connection.release()
    }
}));

module.exports = pool;
