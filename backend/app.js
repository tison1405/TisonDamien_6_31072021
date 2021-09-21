const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const likeRoutes = require('./routes/like');
const path = require('path');
const Thing = require('./models/Sauces');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const myconnection_mongoDb = process.env.connection_mongoDb;//variable d'environnement//
mongoose.connect(myconnection_mongoDb,
  { useNewUrlParser: true,
    useUnifiedTopology: true })//connexion a la BD//
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {//information du header du callback//
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use(express.json());//remplace body-parcer//



app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', likeRoutes);
 
module.exports = app;