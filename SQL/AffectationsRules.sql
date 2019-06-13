-- Affectation des salles le matin
DELIMITER $$
create
    definer = root@localhost procedure AFFECTATION_SALLES_MATIN()
BEGIN
    DECLARE nombreSeances BIGINT DEFAULT 0;
    DECLARE today DATE;
    DECLARE seance_id INT(10);
    DECLARE salle_num INT(2);
    DECLARE offset INT DEFAULT 0;

    SET today = CURDATE();
    SET nombreSeances = (
        SELECT COUNT(id_seance)
        FROM seances
        WHERE date_projection = today
          AND type = 0
        );

    boucle: WHILE offset < nombreSeances DO
        SET seance_id = (
            SELECT seance.id_seance FROM (
                SELECT seances.id_seance AS id_seance, COUNT(billets.id_billet) AS billetsVendus
                FROM seances, billets
                WHERE seances.id_seance = billets.id_seance
                  AND seances.type = 0
                  AND seances.date_projection = today
                GROUP BY seances.id_seance
                ORDER BY billetsVendus DESC) seance
                LIMIT offset, 1
            );

        SET salle_num = (
            SELECT numero_salle
            FROM salles
            ORDER BY salles.capacite DESC
            LIMIT offset, 1
            );

        INSERT INTO affectations(salle, seance) VALUES (salle_num, seance_id);
        SET offset = offset + 1;
    end while;
END;
$$

-- Affectation des salles le soir
DELIMITER $$
create
    definer = root@localhost procedure AFFECTATION_SALLES_SOIR()
BEGIN
    DECLARE nombreSeances BIGINT DEFAULT 0;
    DECLARE today DATE;
    DECLARE seance_id INT(10);
    DECLARE salle_num INT(2);
    DECLARE offset INT DEFAULT 0;

    SET today = CURDATE();
    SET nombreSeances = (
        SELECT COUNT(id_seance)
        FROM seances
        WHERE date_projection = today
          AND type = 1
        );

    boucle: WHILE offset < nombreSeances DO
        SET seance_id = (
            SELECT seance.id_seance FROM (
                SELECT seances.id_seance AS id_seance, COUNT(billets.id_billet) AS billetsVendus
                FROM seances, billets
                WHERE seances.id_seance = billets.id_seance
                  AND seances.type = 1
                  AND seances.date_projection = today
                GROUP BY seances.id_seance
                ORDER BY billetsVendus DESC) seance
                LIMIT offset, 1
            );

        SET salle_num = (
            SELECT numero_salle
            FROM salles
            ORDER BY salles.capacite DESC
            LIMIT offset, 1
            );

        INSERT INTO affectations(salle, seance) VALUES (salle_num, seance_id);
        SET offset = offset + 1;
    end while;
END;
$$

-- Tous les jours à 10h30 on affecte les salles
DELIMITER $$
create definer = root@localhost event affectations_du_matin on schedule
    every '1' DAY
        starts '2019-06-16 10:30:00'
    enable
    comment 'Affectations des salles aux séances du matin.'
    do
    CALL AFFECTATION_SALLES_MATIN();

$$

-- Tous les jours à 19h30 on affecte les salles
DELIMITER $$
create definer = root@localhost event affectations_du_soir on schedule
    every '1' DAY
        starts '2019-06-16 19:30:00'
    enable
    comment 'Affectations des salles aux séances du soir.'
    do
    CALL AFFECTATION_SALLES_SOIR();
$$
