const Sauce =require('../models/Sauce');
const fs = require('fs');

//logiques métier pour les sauces
//lecture de toutes les sauces dans la base de données
exports.getAllSauce =(req,res,next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .c
  
  //lecture d'un sauce avec son id (get)
  exports.getOneSauce =(req,res,next) => {
    Sauce.findOne({_id:req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  };
  //creation d'un nouvelle sauce(post)
exports.createSauce  =(req,res,next) => {
    const sauceObjet =JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    
    //creation d'un nouvel objet sauce
    const sauce = new Sauce({
      ...sauceObjet,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    
    //enregisrement de l objet sauce dans la base de donees
    sauce.save()
    .then(() => res.status(201).json({ message: 'objet enregistré'}))
    .catch(error => res.status(400).json({error}))
};

exports.modifyThing = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}
};
