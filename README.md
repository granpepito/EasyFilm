# EasyFilm

Projet de semestre EasyFilm du cours Bases de Données Avancé 2019

## Documentation

Téléchargez le projet, rendez vous sur le chemin du projet EasyFilm, et installer les dépendances npm:

    cd server
    npm install

Afin de lancer le serveur:

    npm start

Créez une base de données. Elle va accueillir les données que l'on veut ajouter. Vous pouvez la nommer _easyfilm_.

Ajoutez dans votre base de données le contenu des fichiers du dossier SQL dans l'ordre suivant:

1. [Tables.sql](https://github.com/granpepito/EasyFilm/blob/master/SQL/Tables.sql)
2. [SallesRules.sql](https://github.com/granpepito/EasyFilm/blob/master/SQL/SallesRules.sql)
3. [SeancesRules.sql](https://github.com/granpepito/EasyFilm/blob/master/SQL/SeancesRules.sql)
4. [BilletsRules.sql](https://github.com/granpepito/EasyFilm/blob/master/SQL/BilletsRules.sql)
5. [FilmsRules.sql](https://github.com/granpepito/EasyFilm/blob/master/SQL/FilmsRules.sql)
6. [AffectationsRules.sql](https://github.com/granpepito/EasyFilm/blob/master/SQL/AffectationsRules.sql)

Dans le dossier _server_, créez un fichier .env pour les variables d'environnements que vous voulez attribuer. Par exemple:

    PORT=3000
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_DATABASE=easyfilm

Pour le mot de passe: **DB_PASSWORD**

Téléchargez le logiciel Insomnia afin de pouvoir tester les différentes requêtes de l'API
sur le site de [Insomnia](https://insomnia.rest).

Importez le fichier _Insomnia_EasyFilm.json_ dans Insomnia. Vous aurez plusieurs requêtes (GET, POST, DELETE) disponibles ainsi que des exemples de données à fournir dans les méthodes POST.

## API
