-- Creation des tables
CREATE TABLE `easyfilm`.`Salles` (
    `numero_salle` INT(2) NOT NULL AUTO_INCREMENT ,
    `capacité` INT(3) NOT NULL ,
    PRIMARY KEY (`numero_salle`)
);

CREATE TABLE `easyfilm`.`films` (
    `id_film` INT(10) NOT NULL AUTO_INCREMENT ,
    `titre` VARCHAR(100) NOT NULL ,
    `duree` INT(3) NOT NULL ,
    `date_de_sortie` DATE NOT NULL ,
    `droit_diffusion` INT(10) NOT NULL ,
    PRIMARY KEY  (`id_film`)
);

CREATE TABLE `easyfilm`.`seances` (
    `id_seance` INT(10) NOT NULL AUTO_INCREMENT ,
    `id_film` INT(10) NOT NULL ,
    `type` TINYINT(1) NOT NULL ,
    `date_projection` DATE NOT NULL ,
    `entrees_previsionnel` INT(3),
    PRIMARY KEY (`id_seance`)
);

CREATE TABLE `easyfilm`.`affectations` (
    `salle` INT(2) NOT NULL ,
    `seance` INT(10) NOT NULL
);

CREATE TABLE `easyfilm`.`billets` (
    `id_billet` INT(3) NOT NULL AUTO_INCREMENT,
    `id_seance` INT(10) NOT NULL ,
    `prix_vente` DECIMAL(5,2) NOT NULL ,
    `heure_achat` TIME NOT NULL ,
    `date_achat` DATE NOT NULL ,
    PRIMARY KEY(`id_billet`)
);

-- Création des contraites
ALTER TABLE `seances`
    ADD FOREIGN KEY (`id_film`) REFERENCES `films`(`id_film`);

ALTER TABLE `billets`
    ADD FOREIGN KEY (`id_seance`) REFERENCES `seances`(`id_seance`);

ALTER TABLE `affectations`
    ADD FOREIGN KEY (`salle`) REFERENCES `salles`(`numero_salle`);

ALTER TABLE `affectations`
    ADD FOREIGN KEY (`seance`) REFERENCES `seances`(`id_seance`);
