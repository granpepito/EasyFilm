-- On vérifie à chaque insertion de salle si la capacité de la nouvelle est comprise entre 50 et 500
DELIMITER $$
CREATE TRIGGER `before_insert_salles` BEFORE INSERT
    ON `salles` FOR EACH ROW
    BEGIN
        IF new.capacite < 50 OR new.capacite > 500
            THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'La capacité d\'une salle doit être comprise entre "50" et "500".';
        END IF;
    END;

$$

-- De même à chaque mise à jour des données d'une salle
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `before_update_salles` BEFORE UPDATE
    ON `salles` FOR EACH ROW
    BEGIN
        IF new.capacite < 50 OR new.capacite > 500
            THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'La capacité d\'une salle doit être comprise entre "50" et "500".';
        END IF;
    END;
$$