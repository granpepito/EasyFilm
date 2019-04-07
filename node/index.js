//

const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')

let con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "easyfilm"
});

con.connect(function(err){
  if (err) throw err;
  console.log('Connected!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(4000, function(){
  console.log('Example app listening on port 4000')
})

app.get('/', function(req,res){
  res.sendFile(__dirname + '/file.html');
})

app.get('/films', function(req,res){
  con.query('SELECT * FROM films', (err,results) => {
    if (err)
      throw err
    res.end(JSON.stringify(results))
  });
});

app.get('/salles', function(req,res){
  con.query('SELECT * FROM salles', (err,results) => {
    if (err)
      throw err
    res.end(JSON.stringify(results))
  })
})

app.get('/seances', function(req,res){
  con.query('SELECT * FROM seance_projection', (err,results) => {
    if (err)
      throw err
    res.end(JSON.stringify(results))
  })
})
