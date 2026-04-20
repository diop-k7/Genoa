const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const authMiddleware = require('../middleware/authMiddleware');

// GET tous les membres
router.get('/', authMiddleware, async (req, res) => {
  try {
    const members = await Member.find();
    
    // Filtrer les données privées selon les droits
    const filteredMembers = members.map(member => {
      const memberObj = member.toObject();
      
      // Si pas admin/éditeur, masquer privateInfo
      if (req.user.role === 'reader') {
        delete memberObj.privateInfo;
      }
      
      return memberObj;
    });
    
    res.json(filteredMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET un membre par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    
    const memberObj = member.toObject();
    
    // Masquer les infos privées si nécessaire
    if (req.user.role === 'reader') {
      delete memberObj.privateInfo;
    }
    
    res.json(memberObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST créer un membre
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Vérifier les droits (éditeur ou admin)
    if (req.user.role === 'reader') {
      return res.status(403).json({ error: 'Droits insuffisants' });
    }
    
    const member = new Member({
      ...req.body,
      createdBy: req.user.userId
    });
    
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT modifier un membre
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'reader') {
      return res.status(403).json({ error: 'Droits insuffisants' });
    }
    
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        updatedBy: req.user.email,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE supprimer un membre
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'reader') {
      return res.status(403).json({ error: 'Droits insuffisants' });
    }
    
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    
    res.json({ message: 'Membre supprimé', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;