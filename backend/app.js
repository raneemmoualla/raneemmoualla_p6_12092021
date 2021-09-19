const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const path = require('path');


mongoose.connect('mongodb+srv://raneem-moualla:<Z.zeze1171981>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// definition de headers pour eviterbles erreurs de cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
  app.use(bodyParser.json());

  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/sauces', sauceRoutes);
  app.use('/api/auth', userRoutes);
 

module.exports = app;
