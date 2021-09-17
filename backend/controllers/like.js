const Thing = require('../models/Sauces');


exports.like = (req, res, next) =>{
    Thing.findOne({
      _id: req.params.id
    })
    .then(thing => {
      
      if(req.body.like===1){
        if(!thing.usersLiked.includes(req.body.userId)){
          thing.usersLiked.push(req.body.userId);
          thing.likes += 1;
          thing.save()
          .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
          .catch(error => res.status(400).json({ error }));
      }}
       if(req.body.like===-1){
         if(!thing.usersDisliked.includes(req.body.userId)){
           thing.usersDisliked.push(req.body.userId);
           thing.dislikes += 1;
           thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
        }}
        if(req.body.like===0){
          for (let usersLiked of  thing.usersLiked){
            if (usersLiked === req.body.userId){
              thing.likes -= 1;
              thing.usersLiked.pull(req.body.userId);
              thing.save()
                .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
                .catch(error => res.status(400).json({ error }));
              }}
          for (let usersDisliked of thing.usersDisliked){
            if (usersDisliked === req.body.userId){
              thing.dislikes -= 1;
              thing.usersDisliked.pull(req.body.userId);
              thing.save()
              .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
              .catch(error => res.status(400).json({ error }));
            }}
        }
        })
    .catch(
      (error) => {
        res.status(404).json({
          error: error
        })
      })
  };