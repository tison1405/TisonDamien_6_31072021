const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
var cryptoJs = require('crypto-js');

exports.signup = (req, res, next) => {
  if (req.body.password.match( /[0-9]/g) && //password doit contenir un chiffre//
  req.body.password.match( /[A-Z]/g) && //password doit contenir une majuscule//
  req.body.password.match(/[a-z]/g) && //password doit contenir une minuscule//
  req.body.password.match( /[^a-zA-Z\d]/g) &&//password doit contenir un caractère special//
  req.body.password.length >= 10) {//password doit contenir 10 ou plus caractères//
  const mycryptoKey = process.env.cryptoKey;//variable d'env//
  const mycryptoIv = process.env.cryptoIv;//variable d'env//
  var key = cryptoJs.enc.Hex.parse(mycryptoKey);//clé de cryptage de l'adresse mail//
  var iv = cryptoJs.enc.Hex.parse(mycryptoIv);
  
  console.log(mycryptoKey,"coucou");
  const ciphertext = cryptoJs.AES.encrypt(JSON.stringify(req.body.email), key, {iv: iv}).toString();//cryptage de l'adresse mail//
    bcrypt.hash(req.body.password, 10)//hashage du mot de passe//
      .then(hash => {
        const user = new User({//nouvelle objet crypté et haché//
          email: ciphertext,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }else{
    then(() => res.status(201).json({message: 'mot de passe'}))
    .catch(error => res.status(500).json({ error }));
  }};

  exports.login = (req, res, next) => {
    const mycryptoKey = process.env.cryptoKey;//variable d'env//
    const mycryptoIv = process.env.cryptoIv;//variable d'env//
    var key = cryptoJs.enc.Hex.parse(mycryptoKey);
    var iv = cryptoJs.enc.Hex.parse(mycryptoIv);
    const ciphertext = cryptoJs.AES.encrypt(JSON.stringify(req.body.email), key, {iv: iv}).toString();
    User.findOne({ email: ciphertext })//trouver l'adresse mail//
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }//pas d'adresse mail identique dans la BD//
        bcrypt.compare(req.body.password, user.password)//adresse mail identique comparaison du MP/
          .then(valid => {
            if (!valid) {// mot de passe invalide//
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }const mytokenKey = process.env.tokenKey;//variable env//
            res.status(200).json({//mot de passe valide//
              userId: user._id,
              token: jwt.sign(//creation du token avec l'user._id//
                { userId: user._id },
                mytokenKey,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };