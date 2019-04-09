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

//App sur le port 4000
app.listen(4000, function(){
  console.log('Example app listening on port 4000')
})

//homepage
app.get('/', function(req,res){
  res.sendFile(__dirname + '/file.html');
})

//Afficher tous les films
app.get('/films', function(req,res){
  con.query('SELECT * FROM films', (err,results) => {
    if (err)
      throw err
    res.end(JSON.stringify(results))
  });
});

//Afficher les salles
app.get('/salles', function(req,res){
  con.query('SELECT * FROM salles', (err,results) => {
    if (err)
      throw err
    res.end(JSON.stringify(results))
  })
})

//Afficher toutes les séances
//Un peu inutiles, mieux vaut afficher toutes les séances qui n'ont pas encore été effectuées voire ne pas afficher du tout toutes les séances
app.get('/seances', function(req,res){
  con.query('SELECT * FROM seance_projection', (err,results) => {
    if (err)
      throw err
    res.end(JSON.stringify(results))
  })
})

//Chercher les films encore programmés

//Chercher les films qui ne sont plus programméswitch

//Chercher un film (selon le titre / utilisation de mots-clés)

//Chercher un film (selon le réalisateur)

//Chercher un film (selon l'année de sortie)

//Chercher un film selon

//Chercher les salles affectées

//

//Chercher les séances à un jour donné

//Chercher les séances à un jour donné, à une heure donnée

//Chercher les séances à une heure donnée

//Ajouter un film
//Est-ce que ajouter un film implique aussi d'ajouter un nombre d'entrées prévisionnel dès l'ajout?
//Programmer une séance / ou ajoute un nombre d'entrées prévisionnel

//Vendre un billet
