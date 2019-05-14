const express = require('express');
const router = express.Router();
const db = require('./database/db.js');


//Afficher tous les films
router.get('/films', function(req,res){
    console.log('path: ' + req.route.path);
    console.log('query:', req.query);
    db.query(
        'SELECT * ' +
        'FROM films',
        (err,results) => {
            if (err){
                res.sendStatus(500);
                res.end()
            }
            res.send(results)
            //res.json(results);
            // res.end()
        })
})

//Rechercher des films (titre)
    .get('/films/search', function(req,res){
        console.log('path: ' + req.route.path);
        console.log('query:', req.query);
        db.query(
            'SELECT * ' +
            'FROM films ' +
            'WHERE films.titre LIKE ' +'"%' + req.query.q + '%"' + ';', (err,results) => {
                if (err){
                    res.sendStatus(500);
                    res.end()
                }
                res.send(results)
                //res.json(results);
                // res.end()
            })
    })
    .get('/film/:id', function(req,res){//Afficher un film
        console.log('path: ' + req.route.path);
        console.log('query:', req.query);
        db.query(
            'SELECT * ' +
            'FROM films ' +
            'WHERE films.id_film = ?',
            [req.params.id], (err,results) => {
                if (err){
                    res.sendStatus(500);
                    res.end()
                }
                res.send(results)
                //res.json(results);
                // res.end()
            });
    });

module.exports = router;