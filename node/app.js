const express = require('express');
const app = express();
const db = require('./database/db.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res){//Si l'adresse entrée n'existe pas on redirige vers la page d'accueil
    res.redirect('/')
})
    .listen(4000, function(){//App sur le port 4000
        console.log('Server port 4000')
    });


//Chercher un film (selon l'année de sortie)




//


//Ajouter un film (Ajouter un film implique d'aussi ajouter la première séance!)

//Programmer une séance / ou ajoute un nombre d'entrées prévisionnel

//Supprimer une séance

//Supprimer plusieurs séances (déprogrammer un film)

//Calculer le nombre d'entrées prévisionnel pour la semaine



