//

const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "easyfilm"
});

connection.connect(function(err){
  if (err) throw err;
  console.log('Connected!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



//homepage
app.get('/', function(req,res){
  res.sendFile(__dirname + '/file.html');
})

//Afficher tous les films
app.get('/films', function(req,res){
  connection.query('SELECT * FROM films', (err,results) => {
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results)
    res.end()
  })
});

//Afficher un film
app.get('/film/:id', function(req,res){
  connection.query('SELECT * FROM films WHERE films.id_film = ?', [req.params.id], (err,results) => {
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results)
    res.end()
  });
});

//Afficher les salles
//Afficher toutes les salles et les projections qu'elles accueillent
app.get('/salles/', function(req,res){
  connection.query('SELECT * FROM salles', (err,results) => {
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results)
    res.end()
  })
})

//Afficher une salle
app.get('/salle/:id', function(req,res){
  connection.query('SELECT * FROM salles WHERE salles.numero_salle = ?', [req.params.id], (err,results) => {
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results)
    res.end()
  });
});

//Afficher toutes les séances
//Un peu inutiles, mieux vaut afficher toutes les séances qui n'ont pas encore été effectuées voire ne pas afficher du tout toutes les séances
app.get('/seances/', function(req,res){
  connection.query('SELECT seances.*, films.titre FROM films, seances WHERE films.id_film = seances.id_film;', (err,results) => {
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results)
    res.end()
  })
})

//Afficher toutes les séances pour un jour donné
// app.get('/seances/temps?', function(req, res){
//   connection.query()
// })

//Afficher toutes les séances pour une semaine donnée

//

//Chercher les films encore programmés
//app.get('/seance/')


//Chercher les films qui ne sont plus programmés

//Chercher un film (selon le titre / utilisation de mots-clés)

//Chercher un film (selon le réalisateur)

//Chercher un film (selon l'année de sortie)

//Chercher un film selon

//Chercher les salles affectées DEVRAIT ERE FAIT AVEC UN QUERY 
app.get('/seances/salles', function(req, res){
  connection.query('SELECT * FROM affectations', (err, results) =>{
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results)
    res.end()
  })
})

//

//Chercher les séances à un jour donné

//Chercher les séances à un jour donné, à une heure donnée

//Chercher les séances à une heure donnée

//Ajouter un film (Ajouter un film implique d'aussi ajouter la première séance!)

//Programmer une séance / ou ajoute un nombre d'entrées prévisionnel

//Supprimer une séance

//Supprimer plusieurs séances (déprogrammer un film)

//Calculer le nombre d'entrées prévisionnel pour la semaine

//Vendre un billet

//Calculer le bénéfice (perte) d'un film à la semaine

//Calculer le bénéfice (perte) pour tous les films qui ont eu des séances cette semaine

//Obtenir le nombre de billets vendus



//Si l'adresse entrée n'existe pas on redirige vers la page d'accueil
app.use(function(req, res, next){
  res.redirect('/')
})
//App sur le port 4000
app.listen(4000, function(){
  console.log('Serveur port 4000')
})
