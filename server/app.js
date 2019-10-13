const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({
	path: './.env'
});

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: true }))
	.use(require('./routes/index'))
	.use('/affectation', require('./routes/affectations')) //routes concernant les affectations
	.use('/seance', require('./routes/seances')) //routes concernant les seances
	.use('/salle', require('./routes/salles')) //routes concernant les salles
	.use('/film', require('./routes/films')) //routes concernant les films
	.use('/billet', require('./routes/billets')) //routes concernant les billets
	.listen(PORT, () => {
		//App sur le port 4000
		console.log('Server port', PORT);
	});
