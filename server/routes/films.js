const express = require('express');
const router = express.Router();
const db = require('./database/db.js');


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
    .get((req, res) => {//Afficher un film
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
    .delete((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'DELETE FROM ?? WHERE films.id_film = ?',
            [, req.params.id], (err, rows) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            });
    });


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