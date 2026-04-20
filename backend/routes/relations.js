const express = require('express');
const router = express.Router();
const Relation = require('../models/Relation');
const authMiddleware = require('../middleware/authMiddleware');

// GET toutes les relations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const relations = await Relation.find()
      .populate('member1 member2 parent1 parent2 childId');
    res.json(relations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST créer une relation
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'reader') {
      return res.status(403).json({ error: 'Droits insuffisants' });
    }
    
    const relation = new Relation({
      ...req.body,
      createdBy: req.user.userId
    });
    
    await relation.save();
    await relation.populate('member1 member2 parent1 parent2 childId');
    
    res.status(201).json(relation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE supprimer une relation
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'reader') {
      return res.status(403).json({ error: 'Droits insuffisants' });
    }
    
    const relation = await Relation.findByIdAndDelete(req.params.id);
    
    if (!relation) {
      return res.status(404).json({ error: 'Relation non trouvée' });
    }
    
    res.json({ message: 'Relation supprimée', relation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;