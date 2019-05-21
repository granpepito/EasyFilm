const express = require('express');
const router = express.Router();
const db = require('../database/db.js');


router.route('/:id')
    .get((req, res) => { //Obtenir un billet 
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query('SELECT * FROM ?? WHERE billets.id_billet = ?',
        ['billets', req.params.id], (err, rows) => {
            if (err){
                res.sendStatus(500)
            }
            res.send(rows)
        })
    })
    .put() //mettre à jour un billet
    .delete((req, res) => { //Supprimer un billet
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query('DELETE FROM ?? WHERE billets.id_billet = ? ',
            ['billets', req.params.id], (err, rows) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            })
    })

//Vendre un billet
router.post('/newBillet', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('INSERT INTO billets(??) VALUES (??)',
        [req.body.id_seance], (err, rows) => {
            if (err) res.sendStatus(500)
            res.send(rows)
        })
})

module.exports = router;