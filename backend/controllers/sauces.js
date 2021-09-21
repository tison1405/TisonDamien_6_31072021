const Thing = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const thing = new Thing({//creation du nouvelle objet sauce//
      ...thingObject,//objet du reçu du frontend//
      //protolcol pour creer l'url de l'image importée//
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,//valeur de base du like//
      dislikes: 0,//valeur de base du dislike//
      usersLiked: [],//tableau des like userId//
      usersDisliked: [],//tableau des dislike userId//
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.getOneSauce = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id//recherche de l'objet sauce//
  }).then(
    (thing) => {//envoie de l'objet sauce  au frontend//
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const thingObject = req.file ?//le fichier image est il modifier?//
    {
      ...JSON.parse(req.body.sauce),//si oui protocole d'enregitrement du nouveau fichier//
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };//modification de l'objet sans fichier images//
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];//filename nom du fichier images à supprimer//
      fs.unlink(`images/${filename}`, () => {//suppretion du fichier de la BD//
        Thing.deleteOne({ _id: req.params.id })//suppretion de l'objet de la base de donnée//
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};