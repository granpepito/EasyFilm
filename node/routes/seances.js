const express = require('express');
const router = express.Router();
const db = require('./database/db.js');

//Afficher toutes les séances
//Un peu inutiles, mieux vaut afficher toutes les séances qui n'ont pas encore été effectuées voire ne pas afficher du tout toutes les séances
router.get('/seances', function(req,res){
    console.log('path: ' + req.route.path);
    console.log('query:', req.query);
    db.query(
        'SELECT films.titre, seances.* ' +
        'FROM films, seances ' +
        'WHERE films.id_film = seances.id_film '
        , (err,results) => {
            if (err){
                res.sendStatus(500);
                res.end()
            }
            res.send(results)
            //res.json(results);
            // res.end()
        })
})

//Afficher toutes les séances pour un jour donné
    .get('/seances/search', function(req,res){
        console.log('path: ' + req.route.path);
        console.log('query:', req.query);
        db.query(
            'SELECT  films.titre, seances.* ' +
            'FROM films, seances ' +
            'WHERE films.id_film = seances.id_film ' +
            'AND seances.date_projection = ?;',
            [req.query.date], (err,results) => {
                if (err){
                    res.sendStatus(500);
                    res.end()
                }
                res.json(results);
                res.end()
            });
        if (req.query.when === 'after'){
            db.query(
                'SELECT  films.titre, seances.* ' +
                'FROM films, seances ' +
                'WHERE films.id_film = seances.id_film ' +
                'AND seances.date_projection >= ?;',
                [req.query.date, req.query.when], (err,results) => {
                    if (err){
                        res.sendStatus(500);
                        res.end()
                    }
                    res.send(results)
                    //res.json(results);
                    // res.end()
                })
        }
    });
//Afficher toutes les séances pour une semaine donnée


//Chercher les séances à un jour donné

//Chercher les séances à un jour donné, à une heure donnée

//Chercher les séances à une heure donnée

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