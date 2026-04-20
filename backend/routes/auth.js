const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise_123';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Vérifier si c'est le premier utilisateur (devient admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role: isFirstUser ? 'admin' : 'reader',
      isValidated: isFirstUser // Le premier est auto-validé
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: isFirstUser 
        ? 'Compte administrateur créé avec succès' 
        : 'Compte créé. En attente de validation par un administrateur.',
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Vérifier si le compte est validé
    if (!user.isValidated) {
      return res.status(403).json({ error: 'Votre compte n\'a pas encore été validé par un administrateur' });
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Générer le token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;