const express = require('express');
const router = express.Router();
const db = require('./database/db.js');

//Afficher les salles
router.get('/all', (req,res) =>{
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    if (req.query.order){
        db.query(
            'SELECT * FROM salles ORDER by capacite ' + req.query.order,
            (err, rows) => {
                if (err){
                    res.sendStatus(500);
                }
                let salles = rows.map((row) => {
                    return {salle: row.numero_salle, capacite: row.capacite}
                });
                res.send(salles)
            })
    }
    else{db.query(
        'SELECT * FROM salles ',
        (err, rows) => {
            if (err){
                res.sendStatus(500);
            }
            res.send(rows)
        })}

})

//Afficher une salle
router.route('/:id')
    .get((req,res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'SELECT * FROM salles WHERE salles.numero_salle = ?',
            [req.params.id], (err, rows) => {
                if (err){
                    res.sendStatus(500)
                }
                res.send(rows)
            });
    });

module.exports = router;