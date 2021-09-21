const Thing = require('../models/Sauces');


exports.like = (req, res, next) =>{
  Thing.findOne({
    _id: req.params.id
  })
  .then(thing => {
    //ajouter un like//
    if(req.body.like===1 && !thing.usersLiked.includes(req.body.userId)){
        thing.usersLiked.push(req.body.userId);
        thing.likes += 1;
        thing.save()
        .then(() => res.status(201).json({ message: 'Like ajouté !'}))
        .catch(error => res.status(400).json({ error }));}
    //si like déjà ajouté//
    else if(req.body.like===1 && thing.usersLiked.includes(req.body.userId)){
      thing.save()
      .then(() => res.status(201).json({ message: 'Like déjà ajouté !'}))
      .catch(error => res.status(400).json({ error }));}
    //ajouter un dislike//
    else if(req.body.like===-1 && !thing.usersDisliked.includes(req.body.userId)){
         thing.usersDisliked.push(req.body.userId);
         thing.dislikes += 1;
         thing.save()
      .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
      .catch(error => res.status(400).json({ error }));}
    //si le dislike est déjà ajouté//
    else if(req.body.like===-1 && thing.usersDisliked.includes(req.body.userId)){
    thing.save()
    .then(() => res.status(201).json({ message: 'Dislike déjà ajouté !'}))
    .catch(error => res.status(400).json({ error }));}
    //supprimer un like// 
    else if(req.body.like===0 && thing.usersLiked.includes(req.body.userId)){
            thing.likes -= 1;
            thing.usersLiked.pull(req.body.userId);
            thing.save()
              .then(() => res.status(201).json({ message: 'Like supprimé!'}))
              .catch(error => res.status(400).json({ error })); }
    //supprimer un dislike//
    else if (req.body.like===0 && thing.usersDisliked.includes(req.body.userId)){
            thing.dislike -= 1;
            thing.usersDisliked.pull(req.body.userId);
            thing.save()
            .then(() => res.status(201).json({ message: 'Dislike supprimer !'}))
            .catch(error => res.status(400).json({ error }));}
    //problême de valeur//
    else {
            thing.save()
            .then(() => res.status(201).json({ message: 'like n\'a pas la bonne valeur!'}))
            .catch(error => res.status(400).json({ error }));

    }})
  .catch(
    (error) => {
      res.status(404).json({
        error: error
      })
    })
};