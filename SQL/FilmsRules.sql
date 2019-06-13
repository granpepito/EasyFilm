-- Deprogrammation des films
DELIMITER  $$
create
    definer = root@localhost procedure PROGRAMMATION_SEANCES()
BEGIN
       DECLARE nombre_films BIGINT DEFAULT 0;
       DECLARE nombre_seances BIGINT DEFAULT 0;
       DECLARE delai_jour INT DEFAULT 1;
       DECLARE type_seance int DEFAULT 0;
       DECLARE prochaines_entrees INT DEFAULT 0;
       DECLARE offset INT DEFAULT 0;
       DECLARE film_id int(10);

       -- Nombre de films qui ont été diffusés la semaine où la procédure est appelée
       SET nombre_films = (
           SELECT COUNT(DISTINCT films.id_film)
           FROM films, seances
           WHERE films.id_film = seances.id_film
           AND WEEK(seances.date_projection,3) = WEEK(CURDATE(), 3)
           );
        SET offset = 0;
       boucle: WHILE offset < nombre_films DO
           -- Film à évaluer
           SET film_id = (
               SELECT films_a_projeter.id from (SELECT films.id_film as id, SUM(billets.prix_vente) AS benefice
               FROM films, billets, seances
               WHERE films.id_film = seances.id_film
                 AND seances.id_seance = billets.id_seance
               GROUP BY films.id_film
               ORDER BY benefice DESC LIMIT nombre_films) films_a_projeter LIMIT offset, 1
               );

           -- le nombre d'entrées prévisionnel dépendant des performances de la semaine où on appelle la procédure
           SET prochaines_entrees = (
               SELECT COUNT(billets.id_seance)/14
               FROM seances, billets, films
               WHERE seances.id_seance = billets.id_seance
                 AND seances.id_film = films.id_film
                 AND WEEK(seances.date_projection, 3) = WEEK(CURDATE(), 3)
                 AND films.id_film = film_id
               );

            -- le nombre de séances pour le film actuel (celui qu'on veut évaluer pour ajouter ou no des séances)
           SET nombre_seances = (
               SELECT count(seances.id_seance)
               FROM seances, films
               WHERE seances.id_film = films.id_film
                 AND seances.id_film = film_id
               );

            -- Le type de la séance à programmer
           SET type_seance = 0;
           -- le délai à ajouter au jour où la procédure est appelée
           SET delai_jour = 1;

-- Si le film actuel n'a pas fait les 2 semaines de séances obligatoires ou le film n'est pas le moins rentable, on crée des nouvelles séances.
           IF offset < nombre_films-1 OR nombre_seances < 28
            THEN
               WHILE delai_jour <= 7 DO
                   WHILE type_seance < 2 DO
                       INSERT INTO seances(id_film, type, date_projection, entrees_previsionnel) VALUES (film_id, MOD(type_seance, 2), DATE_ADD(CURDATE(), INTERVAL delai_jour DAY), prochaines_entrees);
                       SET type_seance = type_seance + 1;
                   END WHILE;
                   SET delai_jour = delai_jour + 1;
               END WHILE;

            -- Si on a atteini le dernier film est que ce dernier film a plus de 28 seances (plus de 14 jours de séances) alors on ne crée pas de nouvelle séances car c'est le moins rentable
            ELSEIF offset = nombre_films-1 AND nombre_seances > 28
               THEN
                leave boucle;
           END IF;
           SET offset = offset +1;
       end while;
    END

$$

-- Appel de la procédure de programmation des films tous les dimances
DELIMITER $$
    CREATE EVENT programmation_des_films
    ON SCHEDULE EVERY 7 DAY
        STARTS (TIMESTAMP('2019-06-16 23:00:00'))
        COMMENT 'Programmation des films'
        DO
            CALL PROGRAMMATION_SEANCES();
$$