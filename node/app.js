const express = require('express');
const app = express();
const db = require('./db.js');
const bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




app.get('/', function(req,res){ //homepage
  res.sendFile(__dirname + '/file.html');
})
    .get('/films', function(req,res){ //Afficher tous les films
  db.query('SELECT * FROM films', (err,results) => {
    if (err){
      res.sendStatus(500);
      res.end()
    }
    res.json(results);
    res.end()
  })
})
    .get('/film/:id', function(req,res){//Afficher un film
  db.query('SELECT * FROM films WHERE films.id_film = ?', [req.params.id], (err,results) => {
    if (err){
      res.sendStatus(500);
      res.end()
    }
    res.json(results);
    res.end()
  });
})

//Afficher les salles
    .get('/salles/', function(req,res){
  db.query('SELECT * FROM salles', (err,results) => {
    if (err){
      res.sendStatus(500);
      res.end()
    }
    res.json(results);
    res.end()
  })
})
    .get('/salle/:id', function(req,res){//Afficher une salle
  db.query('SELECT * FROM salles WHERE salles.numero_salle = ?', [req.params.id], (err,results) => {
    if (err){
      res.sendStatus(500)
      res.end()
    }
    res.json(results);
    res.end()
  });
})

//Afficher toutes les séances
//Un peu inutiles, mieux vaut afficher toutes les séances qui n'ont pas encore été effectuées voire ne pas afficher du tout toutes les séances
    .get('/seances/', function(req,res){
  db.query('SELECT seances.*, films.titre FROM films, seances WHERE films.id_film = seances.id_film AND WHERE seances.date_projection >= CURDATE();', (err,results) => {
    if (err){
      res.sendStatus(500);
      res.end()
    }
    res.json(results);
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


.get('/seances', function(req, res){ //Chercher les salles affectées
  db.query('SELECT seances.*, salles.* FROM affectations, salles, seances WHERE seances.id_seance = affectations.seance AND affectations.salle = ? AND seances.date_projection >= ?', [req.query.salle, req.query.when], (err, results) =>{
    if (err){
      res.sendStatus(500);
      res.end()
    }
    res.json(results);
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

//Annuler la vente d'un billet

//Calculer le bénéfice (perte) d'un film à la semaine

//Calculer le bénéfice (perte) pour tous les films qui ont eu des séances cette semaine

//Obtenir le nombre de billets vendus

.use(function(req, res, next){//Si l'adresse entrée n'existe pas on redirige vers la page d'accueil
  res.redirect('/')
})
    .listen(4000, function(){//App sur le port 4000
  console.log('Server port 4000')
});
