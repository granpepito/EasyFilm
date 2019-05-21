const express = require('express');
const router = express.Router();
const db = require('../database/db.js');


//Afficher tous les films
router.get('/all', (req,res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'SELECT * FROM films',
            (err, rows) => {
                if (err){
                    res.sendStatus(500)
                }
                res.send(rows)
            })
    })

//Rechercher des films (titre)
    .get('/search', (req,res) =>{
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'SELECT * FROM films WHERE films.titre LIKE ' + db.escape('%' + req.query.q + '%'),
             (err, rows) => {
                if (err){
                    res.sendStatus(500).end()
                }
                res.send(rows)
            })
    });

router.route('/:id')
    .get((req, res) => { //Obtenir un film
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'SELECT * FROM films WHERE films.id_film = ?',
            [req.params.id], (err,rows) => {
                if (err){
                    res.sendStatus(500)
                }
                res.send(rows)
            });
    })
    .put()
    .delete((req, res) => { //supprimer un film
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'DELETE FROM ?? WHERE films.id_film = ?',
            ['films', req.params.id], (err, rows) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            });
    });


//Obtenir tous les billets d'un film
router.get('/:id/billets', (req, res) => {
    db.query('SELECT billets.* FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND films.id_film = ?',
        ['billets', 'films', 'seances', req.params.id], (err, rows) => {
            if (err){
                res.sendStatus(500)
            }
            res.send(rows)
        })
    })

    //Obtenir le nombre de billets vendus
    .get('/:id/billets/count', (req, res) => {
        db.query('SELECT COUNT(billets.id_billets) FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND films.id_film = ?',
            ['billets', 'films', 'seances', req.params.id], (err, rows) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            }) 
    })

    //Calculer le bénéfice/perte d'un film 
    .get('/:id/billets/benef', (req, res) => {

        db.query('SELECT SUM(billets.prix_vente) FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND films.id_film = ?',
            ['billets', 'films', 'seances', req.params.id], (err, rows) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            })
    })



    //Calcul du bénéfice de tous les films
    .get('/benef', (req, res) => {
        db.query('SELECT films.id_film, films.titre, SUM(billets.prix_vente) FROM ??, ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance',
            ['billets', 'films', 'seances'], (err, rows) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            })
    })
    
    
    .get('/benef/')
//Calculer le bénéfice/perte d'un film à la semaine


//Calculer le bénéfice/perte pour tous les films qui ont eu des séances cette semaine




//Ajouter un film (Ajouter un film implique d'aussi ajouter la première séance!)
router.post('/newFilm', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('INSERT INTO films(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
        ['titre', 'duree', 'date_de_sortie', 'droit_diffusion', req.body.titre, req.body.duree, req.body.date_de_sortie, req.body.droit_diffusion], (err, rows) => {
            if (err){
                console.log(err)
                res.sendStatus(500)
            }
            res.send(rows)
        })
})



module.exports = router;