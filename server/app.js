const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))


    .use('/api/seance', require('./routes/seances.js'))
    .use('/api/salle', require('./routes/salles.js'))
    .use('/api/films', require('./routes/films.js'))
    .use('/api/billet', require('./routes/billets.js'))

    .use((req, res) => {//Si l'adresse entrée n'existe pas on redirige vers la page d'accueil
        res.sendStatus(404)
    })
    .listen(PORT, () => {//App sur le port 4000
        console.log('Server port', PORT)
    });

//


//Ajouter un film (Ajouter un film implique d'aussi ajouter la première séance!)

//Programmer une séance / ou ajoute un nombre d'entrées prévisionnel

//Supprimer une séance

//Supprimer plusieurs séances (déprogrammer un film)

//Calculer le nombre d'entrées prévisionnel pour la semaine



