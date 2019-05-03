const mysql = require('mysql')

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "easyfilm"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});