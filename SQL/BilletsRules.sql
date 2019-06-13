-- Il n'est pas possible de supprimer des billets après que la séance ait commencé (pour éviter de perdre des traces pour les revenus)
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_delete_billets` BEFORE DELETE
    ON `billets` FOR EACH ROW
    BEGIN
        DECLARE auj DATE;-- date de suppresion du billet
        DECLARE heure_auj TIME; -- heure de suppression du billet
        DECLARE date_projection DATE; -- date de projection de la séance à laquelle le billet est lié
        DECLARE type TINYINT(1);

        SET auj = CURDATE();
        SET heure_auj = CURTIME();
        SET date_projection = (
            SELECT seances.date_projection
            FROM billets, seances
            WHERE billets.id_seance = seances.id_seance
              AND billets.id_seance = old.id_seance
              AND billets.id_billet = old.id_billet
            );
        SET type = (
            SELECT seances.type
            FROM billets, seances
            WHERE billets.id_seance = seances.id_seance
              AND billets.id_seance = old.id_seance
              AND billets.id_billet = old.id_billet
            ) ;


        -- Cas où la date de suppression est après la date de la projection
        IF (datediff(auj, date_projection) >= 0)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être supprimé après la projection.';

        -- Cas où la séance est celle du matin
        ELSEIF (datediff(auj, date_projection) = 0 AND TIMEDIFF(heure_auj, TIME('11:45:00')) > TIME('00:00:00') AND type = 0)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être supprimé après le début de la projection.';

        -- Cas où la séance est celle du soir
        ELSEIF (datediff(auj, date_projection) = 0 AND TIMEDIFF(heure_auj, TIME('20:45:00')) > TIME('00:00:00') AND type = 1)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être supprimé après le début de la  projection.';

        END IF;
    END;
$$

-- Calcul du prix d'un billet
DELIMITER $$
CREATE DEFINER=`easyfilm`@`%` TRIGGER `before_insert_billets_calcul_prix` BEFORE INSERT
    ON `billets` FOR EACH ROW
    BEGIN

        DECLARE film_id INT(10);
        DECLARE pourcent DECIMAL(3,2);
        DECLARE droit_diff INT;
        DECLARE cout_salle INT DEFAULT 412;
        DECLARE entrees INT;
        DECLARE date_premiere DATE;
        DECLARE date_proj DATE;
        DECLARE semaine_proj INT;
        DECLARE auj DATE;
        DECLARE diff_date_proj_premiere INT;
        DECLARE prix_revient DECIMAL(5,2);
        DECLARE taux_occupation DECIMAL(3,2);
        DECLARE x INT;
        DECLARE nbr_billets INT;
        DECLARE coef DECIMAL(2,1);

        -- Cout des droits de diffusion
        SET droit_diff = (
            SELECT films.droit_diffusion
            FROM films, seances
            WHERE films.id_film = seances.id_film
              AND seances.id_seance = new.id_seance
            );
        -- SET droit_diff = (SELECT films.droit_diffusion FROM billets, films, seances WHERE films.id_film = seances.id_film AND seances.id_seance = billets.id_seance AND billets.id_seance = new.id_seance AND billets.id_billet = new.id_billet);

        -- Film de la seance
        SET film_id = (
            SELECT films.id_film
            FROM films, seances
            WHERE films.id_film = seances.id_film
              AND seances.id_seance = new.id_seance
            );

        -- Le nombre d'entrées prévisionnel
        SET entrees = (
            SELECT seances.entrees_previsionnel
            FROM seances
            WHERE seances.id_seance = new.id_seance
            );

        -- Date du jour d'achat
        SET auj = (SELECT CURDATE());

        -- Date de la premiere projection
        SET date_premiere = (
            SELECT seances.date_projection
            FROM seances, films
            WHERE film_id = films.id_film
              AND seances.id_film = films.id_film
            ORDER BY seances.date_projection, seances.type
            LIMIT 1
            );

        -- Date de projection de la seance
        SET date_proj = (
            SELECT seances.date_projection
            FROM seances
            WHERE new.id_seance = seances.id_seance
            );

        -- Calcul de la semaine de projection (semaine 0 = premiere semaine, semaine 1 = deuxieme semaine, etc.) (pour savoir quel formule utiliser pour le calcul du prix du billet)
        SET semaine_proj = (SELECT WEEK(date_proj,3) -  WEEK(date_premiere, 3));

        -- Calcul de la différence de date pour savoir s'il faut réduire les droits de diffusion
        SET diff_date_proj_premiere = datediff(date_proj, date_premiere);

        -- Nombre de billets vendus pour la seance "new.id_seance" en plus de celui qui va être vendu
        SET nbr_billets = (
            SELECT COUNT(billets.id_billet)+1
            FROM billets, seances
            WHERE billets.id_seance = seances.id_seance
              AND billets.id_seance = new.id_seance
            ) ;

        -- Calcul taux d'occupation pour la plus petite salle pouvant accueillir la seances au vue du nombre de billets vendus
        SET taux_occupation = (
            SELECT nbr_billets / salles.capacite AS taux
            FROM salles
            WHERE nbr_billets <= salles.capacite
            ORDER BY salles.capacite ASC
            LIMIT 1
            ); -- possibilité de order by taux

        -- Calcul du pourcentage du droit de diffusion à payer
        IF (diff_date_proj_premiere >= 21)
            THEN
                SET pourcent = 0.58;
        ELSE
            SET pourcent = 1 - diff_date_proj_premiere * 0.02;
        END IF;

        SET prix_revient = (droit_diff * pourcent + cout_salle)/ entrees;

        IF semaine_proj = 0
            THEN
                IF nbr_billets >=0 AND nbr_billets <50
                    THEN
                        SET coef = 1.1;
                ELSEIF nbr_billets >=50 AND nbr_billets <100
                    THEN
                        SET coef = 1.2;
                ELSEIF nbr_billets >=100
                    THEN
                        SET coef = 1.4;
                END IF;
                SET new.prix_vente = coef * prix_revient - datediff(date_proj, auj) * 0.05 * prix_revient;

        ELSEIF semaine_proj > 0
            THEN
                IF nbr_billets >=0 AND  nbr_billets <50
                    THEN
                        SET coef = 1.1;
                ELSEIF nbr_billets >=50 AND  nbr_billets <100
                    THEN
                        SET coef = 1.2;
                ELSEIF nbr_billets >=100
                    THEN
                        SET coef = 1.4;
                END IF;
                SET new.prix_vente = coef * prix_revient - (datediff(date_proj, auj) * 0.05 * prix_revient)/(0.1+ taux_occupation);
        END IF;

    END;
$$

-- Heure et Date des billets ajoutées automatiquement
-- Temps limite pour pouvoir acheter un billet
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_insert_billets_date_achat` BEFORE INSERT
    ON `billets` FOR EACH ROW
    BEGIN
        DECLARE date_projection DATE;
        DECLARE type TINYINT(1);

        SET date_projection = (
            SELECT date_projection
            FROM seances
            WHERE seances.id_seance = new.id_seance
            );
        SET type = (
            SELECT type
            FROM seances
            WHERE seances.id_seance = new.id_seance
            );
        SET new.heure_achat = CURTIME();
        SET new.date_achat = CURDATE();


        -- Si on veut vendre un billet plus de 6 jours avant la projection on refuse
        IF (datediff(new.date_achat, date_projection) < -6)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Un billet peut être vendu 6 jours avant la projection.';
        -- Si on veut vendre un billet après la projection
        ELSEIF (datediff(new.date_achat, date_projection) > 0)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être vendu après la projection.';
        -- Cas où la séance est celle du matin
        ELSEIF (datediff(new.date_achat, date_projection) = 0 AND TIMEDIFF(new.heure_achat, TIME('11:45:00')) > TIME('00:00:00') AND type = 0)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être vendu après la projection.';
        -- Cas où la séance est celle du soir
        ELSEIF (datediff(new.date_achat, date_projection) = 0 AND  TIMEDIFF(new.heure_achat, TIME('20:45:00')) > TIME('00:00:00') AND type = 1)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être vendu après la projection.';

        END IF;
    END;
$$

-- On vérifie qu'il n'y a pas plus de 500 billets vendus.
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_insert_billets_nbr_max` BEFORE INSERT
    ON `billets` FOR EACH ROW
    BEGIN
        -- Si il y a déjà 500 billets ou plus, on refuse la vente
        IF ((SELECT COUNT(*) FROM billets, seances WHERE seances.id_seance = billets.id_seance AND billets.id_seance = new.id_seance) >= 500)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Impossible de vendre plus de 500 billets';
                END IF;
    END

$$

-- On vérifie qu'il n'y a pas plus de 500 billets vendus.
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_update_billets_nbr_max` BEFORE UPDATE
    ON `billets` FOR EACH ROW
    BEGIN
        -- Si il y a déjà 500 billets ou plus, on refuse la vente
        IF ((SELECT COUNT(*) FROM billets, seances WHERE seances.id_seance = billets.id_seance AND billets.id_seance = new.id_seance) >= 500)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Impossible de vendre plus de 500 billets';
                END IF;
    END

$$
--
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_update_billets_date_achat` BEFORE UPDATE
    ON `billets` FOR EACH ROW
    BEGIN
        DECLARE date_projection DATE;
        DECLARE type TINYINT(1);

        SET date_projection = (
            SELECT date_projection
            FROM seances
            WHERE seances.id_seance = new.id_seance
            );
        SET type = (
            SELECT type
            FROM seances
            WHERE seances.id_seance = new.id_seance
            );
        SET new.heure_achat = CURTIME();
        SET new.date_achat = CURDATE();


        -- Si on veut vendre un billet plus de 6 jours avant la projection on refuse
        IF (datediff(new.date_achat, date_projection) < -6)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Un billet peut être vendu 6 jours avant la projection.';
        -- Si on veut vendre un billet après la projection
        ELSEIF (datediff(new.date_achat, date_projection) > 0)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être vendu après la projection.';
        -- Cas où la séance est celle du matin
        ELSEIF (datediff(new.date_achat, date_projection) = 0 AND new.heure_achat > '11:45:00' AND type = 0)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être vendu après la projection.';
        -- Cas où la séance est celle du soir
        ELSEIF (datediff(new.date_achat, date_projection) = 0 AND new.heure_achat > '20:45:00' AND type = 1)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur: un billet ne peut pas être vendu après la projection.';

        END IF;
    END;
$$
