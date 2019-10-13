# EasyFilm

Projet de semestre du cours Bases de Données Avancé 2019.

## Énoncé

Easyfilm est un complexe de salles de cinémas. Ce complexe est composé de plusieurs salles dont la capacité d’accueil peut varier sensiblement (entre 50 et 500 spectateurs). Les responsables de programmation cinématographique choisissent les films à projeter. Ces films sont programmés pendant des séances de projection. Il existe deux séances par jour, une matinale et une en début de soirée. Chaque séance est programmée pour une salle donnée et pour un film donné.

Chaque film est programmé pour une durée prévisionnelle qui ne peut pas être inférieure à deux semaines. Pour chacune des projections un nombre prévisionnel d’entrée est déterminé. Ce nombre peut être calculé en se basant sur un historique de nombre de places vendus ou fixé par le responsable. Les billets sont mis à la vente 6 jours à l’avance. Pour la planification d’un nouveau film, le film qui réalise le moins de bénéfices ou le maximum de pertes la semaine précédente est déprogrammé. La première semaine le prix de revient est calculé selon le nombre prévisionnel.

De la même sorte, Easyfilm affecte les salles selon le taux d’occupation. Les salles ne sont pas définies. Les salles sont allouées pour les séances selon le taux de vente de billets et la capacité des salles disponibles. L’affectation réelle des salles se fait selon la règle dernier rempli, premier affecté au minimum et premier rempli, premier affecté au maximum.

Les coûts de projections varient selon le film. Chaque film possède des droits d’auteur par diffusion. Les droits d’auteur sont facturés quotidiennement et sont dégressifs sur la durée. En effet les droits d’auteur baissent tous les jours de 2% du coût initial mais ne peut en aucun cas baisser de plus de 42%. A ces coûts s’ajoute le coût calculé par salle (Infrastructure). En effet l’entretien, le nettoyage et le personnel de salle soulèvent un coût fixe de fonctionnement pour chacune des séances programmées. Afin de simplifier le modèle de calcul du prix de revient d’un siège, on considère le coût par salle fixe et unique pour toutes les salles.

Easyfilm, adapte ses prix pour sa clientèle. Si un taux d’occupation d’une salle pendant une séance d’une journée est faible, Easyfilm réduit sa marge afin d’augmenter ce taux. Au contraire si un taux d’occupation est élevé, Easyfilm augmentera ses tarifs. Esyfilm fixe et adapte ses prix selon donc le taux de fréquentation quotidien et la date d’achat du billet.

1. Le prix de vente des billets de la première semaine est calculé selon le modèle suivant :

    - Du premier au cinquantième billet vendu: PV= 110% Prix_revient – ((date_de_projection – date_achat ) \* 0.5% Prix_revient )

    - Du cinquantième au centième billet vendu : PV =120% Prix_revient – ((date_de_projection – date_achat ) \* 0.5% Prix_revient )

    - du centième billet vendu : PV=140% Prix_revient – ((date_de_projection – date_achat ) \* 0.5% Prix_revient )

2. Les semaines suivantes, le modèle de calcul est le suivant :

    - Du premier au cinquantième billet vendu: PV = 110% Prix_revient – [((date_de_projection – date_achat ) * 0.5% Prix_revient ) / (0.1 + Taux_occupation)]

    - Du cinquantième au centième billet vendu : PV = 120% Prix_revient – [((date_de_projection – date_achat) * 0.5% Prix_revient ) / (0.1+ Taux_occupation)]

    - Du centième billet vendu : PV=140% Prix_revient – [((date _de_projection – date_achat ) * 0.5% Prix_revient ) / (0.1+ Taux_occupation)]

## Documentation

Téléchargez le projet, rendez vous sur le chemin du projet EasyFilm, et installer les dépendances npm:

    > cd server
    > npm install

Afin de lancer le serveur:

    > npm start

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

Le port sur lequel vous voulez que le serveur soit actif se spécifie avec la variable **PORT**. Sa valeur par défaut est 4000.
L'adresse à laquelle se trouve la base de donnée est indiquée avec **DB_HOST**, l'utilisateur de la base de donnée avec **DB_USER**, et le schéma avec **DB_DATABASE**.
Si vous avez ajouté un mot de passe, utilisez la variable: **DB_PASSWORD**, autrement il n'y a pas de mot de passe.

Téléchargez le logiciel Insomnia afin de pouvoir tester les différentes requêtes de l'API
sur le site de [Insomnia](https://insomnia.rest).

Importez le fichier _Insomnia_EasyFilm.json_ dans Insomnia. Vous aurez plusieurs requêtes (GET, POST, DELETE) disponibles ainsi que des exemples de données à fournir dans les méthodes POST.
