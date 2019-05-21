const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))


    .use('/api/seance', require('./routes/seances.js')) //routes concernant les seances
    .use('/api/salle', require('./routes/salles.js')) //routes concernant les salles
    .use('/api/film', require('./routes/films.js')) //routes concernant les films
    .use('/api/billet', require('./routes/billets.js')) //routes concernant les billets

    .use((req, res) => {//Si l'adresse entrée n'existe pas on envoie le statut http 404
        res.sendStatus(404)
    })
    .listen(PORT, () => {//App sur le port 4000
        console.log('Server port', PORT)
    });