const express = require('express');
const router = express.Router();
const db = require('./database/db.js');

//Afficher toutes les séances
//Un peu inutiles, mieux vaut afficher toutes les séances qui n'ont pas encore été effectuées voire ne pas afficher du tout toutes les séances
router.get('/all', (req,res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query(
        'SELECT films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film '
        , (err,rows) => {
            if (err){
                res.sendStatus(500);
                res.end()
            }
            res.send(rows)
        })
})


    .get('/search', (req,res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        if (req.query.date){
            //Afficher toutes les séances après un jour donné
            if (req.query.when === 'after') {
                db.query(
                    'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection >= ?;',
                    [req.query.date], (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                            res.end()
                        }
                        res.send(rows)
                    })
            }
            else if (req.query.when === 'before') {
                //Afficher toutes les séances avant un jour donné
                db.query(
                    'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection <= ?;',
                    [req.query.date], (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                            res.end()
                        }
                        res.send(rows)
                    })
            }
            else if (req.query.type){
                //Chercher les séances à une heure donnée (un type de seance donné)
                db.query(
                    'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection = ? AND seances.type = ?;',
                    [req.query.date, req.query.type], (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                            res.end()
                        }
                        res.send(rows);
                    });
            }
            else {
                //Afficher toutes les séances pour un jour donné
                db.query(
                    'SELECT  films.titre, seances.* FROM films, seances WHERE films.id_film = seances.id_film AND seances.date_projection = ?;',
                    [req.query.date], (err, rows) => {
                        if (err) {
                            res.sendStatus(500);
                            res.end()
                        }
                        res.send(rows);
                    });
            }

        }
        
    });
    
//Afficher toutes les séances pour une semaine donnée






//get seance i
router.route('/:id')
    .get((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query('SELECT films.titre, seances.* FROM ??, ?? WHERE films.id_film = seances.id_film AND seances.id_seance = ?' ,
        ['films', 'seances', req.params.id], (err, rows, fields) => {
            if (err){
                res.sendStatus(500)
            }
            res.send(rows)
        })
    })
    .delete((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query('DELETE FROM ?? WHERE seances.id_seance = ?',
            ['seances', req.params.id], (err, rows, fields) => {
                if (err) {
                    res.sendStatus(500)
                }
                res.send(rows)
            })
    })

// .get('/seances', function(req, res){ //Chercher les salles affectées
//   db.query(
//       'SELECT seances.*, salles.* ' +
//       'FROM affectations, salles, seances ' +
//       'WHERE seances.id_seance = affectations.seance ' +
//       'AND affectations.salle = ? ' +
//       'AND seances.date_projection >= ?',
//       [req.query.salle, req.query.when], (err, results) =>{
//     if (err){
//       res.sendStatus(500);
//       res.end()
//     }
//     res.json(results);
//     res.end()
//   })
// })

module.exports = router;