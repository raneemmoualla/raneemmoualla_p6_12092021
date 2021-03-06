const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const userValidator = require('./password');
// Logiques métiers pour les utilisateurs
// Création de nouveaux utilisateurs (Post signup)
exports.signup = (req, res, next) => {
    if (userValidator.isGoodPassword(req.body.password)){
    // Hash du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Masquage de l'adresse mail
        let buff = new Buffer(req.body.email);
        let emailInbase64 = buff.toString('base64');

        // Création du nouvel utilisateur
        const user = new User({
            email: emailInbase64,
            password: hash
        })
        // Sauvegarde dans la base de données
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}else{
    return res.status(404).json({ message: 'Le mot de passe doit contenir au moins un nombre, une minuscule, une majuscule et être composé de 6 caractères minimum !' });
    console.log('success');

  }
};

// Création de connexion d'utilisateur enregistré (Post login)
exports.login = (req, res, next) => {
    // Masquage de l'adresse mail
    let buff = new Buffer(req.body.email);
    let emailInbase64 = buff.toString('base64');

    // Recherche d'un utilisateur dans la base de données
    User.findOne({ email: emailInbase64 })
    .then(user => {
        // Si on ne trouve pas l'utilisateur
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        // On compare le mot de passe de la requete avec celui de la base de données
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
            res.status(200).json({
                userId: user._id,
                // Création d'un token pour sécuriser le compte de l'utilisateur
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',//chaîne secrète de développement temporaire pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
                    { expiresIn: '24h' }
                )}); })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};