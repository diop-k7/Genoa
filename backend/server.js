const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const membersRoutes = require('./routes/members');
const relationsRoutes = require('./routes/relations');
const statisticsRoutes = require('./routes/statistics');

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/members', membersRoutes);
app.use('/relations', relationsRoutes);
app.use('/statistics', statisticsRoutes);

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/genoa';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    
    app.listen(3000, '0.0.0.0', () => {
      console.log('API Genoa démarrée sur le port 3000');
    });
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB:', err);
    process.exit(1);
  });