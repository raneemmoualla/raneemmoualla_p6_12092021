const express = require ('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

require('dotenv').config({ path: process.cwd() + '/.env' });

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
// Lancement de Express
const app = express();
app.use(helmet());

// Connexion à la base de données avec mongoose
mongoose.connect(process.env.MONGODB_PATH,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
// Configuration cors un système de sécurité qui, par défaut, bloque les appels HTTP d'être effectués entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles. 
//implémenté CORS pour vous assurer que le front-end pouvait effectuer des appels vers  application en toute sécurité.
//'accéder à notre API depuis n'importe quelle origine ( '*' )
//ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) 
//envoyer des requêtes avec les méthodes mentionnées ( GET, POST, PUT, DELETE, PATCH, OPTIONS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
});
// Parse le body des requetes en json
app.use(bodyParser.json());
/**
 * ROUTES
 */
 //indique à Express qu'il faut gérer la ressource images de manière statique
 // (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois 
 //qu'elle reçoit une requête vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app