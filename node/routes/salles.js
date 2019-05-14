const express = require('express');
const router = express.Router();
const db = require('./database/db.js');

//Afficher les salles
.get('/salles', function(req,res){
    console.log('path: ' + req.route.path);
    console.log('query:', req.query);
    if (req.query.order){
        db.query(
            'SELECT * ' +
            'FROM salles ' +
            'ORDER by capacite ' + req.query.order,
            (err,results) => {
                if (err){
                    res.sendStatus(500);
                    res.end()
                }
                let salles = results.map((row) => {
                    return {salle: row.numero_salle, capacite: row.capacite}
                });
                //console.log(salles);
                res.send(salles)
                //res.json(results);
                // res.end()
            })
    }
    else{db.query(
        'SELECT * ' +
        'FROM salles ',
        (err,results) => {
            if (err){
                res.sendStatus(500);
                res.end()
            }
            console.log(results);
            res.send(results)
            //res.json(results);
            // res.end()
        })}

})

//Afficher une salle
    .get('/salle/:id', function(req,res){
        console.log('path: ' + req.route.path);
        console.log('query:', req.query);
        db.query(
            'SELECT * ' +
            'FROM salles ' +
            'WHERE salles.numero_salle = ?',
            [req.params.id], (err,results) => {
                if (err){
                    res.sendStatus(500)
                    res.end()
                }
                res.send(results)
                //res.json(results);
                // res.end()
            });
    });

module.exports = router;