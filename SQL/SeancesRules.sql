-- On ne supprime pas une séance si elle a déjà eu des billets vendus
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_delete_seances` BEFORE DELETE
    ON `seances` FOR EACH ROW
    BEGIN
        DECLARE i INT;
        SET i = (
            SELECT COUNT(billets.id_billet)
            FROM billets, seances
            WHERE seances.id_seance = billets.id_seance
              AND old.id_seance = billets.id_seance
            );
        IF i > 0
            THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Impossible de supprimer ces séances car il y a déjà eu des billets vendus.';
        END IF;
    END;
$$

-- On veut s'assurer que le type d'une séance soit égal à 0 ou 1;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_insert_seances` BEFORE INSERT
    ON `seances` FOR EACH ROW
    BEGIN
        IF (new.type != 0 AND new.type != 1)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur : le type est "0" pour le matin, "1" pour le soir.';
        END IF;
    END;
$$

-- On veut s'assurer que le type d'une séance soit égal à 0 ou 1;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_update_seances` BEFORE UPDATE
    ON `seances` FOR EACH ROW
    BEGIN
        IF (new.type != 0 AND new.type != 1)
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Erreur : le type est "0" pour le matin, "1" pour le soir.';
        END IF;
    END;
$$

-- On veut s'assurer que le premièr jour de projection d'un film soit un lundi
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_insert_seances_jour` BEFORE INSERT
    ON `seances` FOR EACH ROW
    BEGIN
        -- DECLARE d DATE;
        -- S'il n'y pas de seances pour ce film
        IF (SELECT COUNT(*) FROM seances WHERE seances.id_seance = new.id_film) = 0
            THEN
        -- Si la date de projection est antérieure ou égale à la date de sortie du film, on l'ajuste
                -- Le type de la première séance est 0.
                -- SET new.type = 0;
                -- SET d = (SELECT films.date_de_sortie FROM films WHERE films.id_film = new.id_film);
                -- IF DATEDIFF(d, new.date_projection <= 0)
                    -- THEN
                    -- 	IF WEEKDAY(d) = 2 -- Mercredi
                            -- THEN
                            -- 	SET new.date_projection = ADDDATE(d, INTERVAL 5 DAY);
                        -- ELSEIF WEEKDAY(d) = 4 -- Vendredi
                        -- 	THEN
                            -- 	SET new.date_projection = ADDDATE(d, INTERVAL 3 DAY);
                        -- END IF;
                -- END IF;
                IF WEEKDAY(new.date_projection) != 0
                    THEN
                        SIGNAL SQLSTATE '45000'
                            SET MESSAGE_TEXT = 'La première séance doit être un lundi.';
                END IF;
        END IF;
    END
$$

-- On veut s'assurer que le premièr jour de projection d'un film soit un lundi
-- DELIMITER $$
-- CREATE DEFINER=`root`@`localhost` TRIGGER `before_update_seances_jour` BEFORE UPDATE
 --   ON `seances` FOR EACH ROW
--    BEGIN
        -- DECLARE d DATE;
        -- S'il n'y pas de seances pour ce film
--        IF (SELECT COUNT(*) FROM seances WHERE seances.id_seance = new.id_film) = 0
--            THEN
        -- Si la date de projection est antérieure ou égale à la date de sortie du film, on l'ajuste
                -- Le type de la première séance est 0.
                -- SET new.type = 0;
                -- SET d = (SELECT films.date_de_sortie FROM films WHERE films.id_film = new.id_film);
                -- IF DATEDIFF(d, new.date_projection <= 0)
                    -- THEN
                    -- 	IF WEEKDAY(d) = 2 -- Mercredi
                            -- THEN
                            -- 	SET new.date_projection = ADDDATE(d, INTERVAL 5 DAY);
                        -- ELSEIF WEEKDAY(d) = 4 -- Vendredi
                        -- 	THEN
                            -- 	SET new.date_projection = ADDDATE(d, INTERVAL 3 DAY);
                        -- END IF;
                -- END IF;
 --               IF WEEKDAY(new.date_projection) != 0
   --                 THEN
  --                      SIGNAL SQLSTATE '45000'
 --                           SET MESSAGE_TEXT = 'La première séance doit être un lundi.';
--                END IF;
--        END IF;
--    END
-- $$

