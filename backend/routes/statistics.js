const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Relation = require('../models/Relation');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const members = await Member.find();
    const relations = await Relation.find({ type: 'child' });
    
    // Nombre total
    const totalMembers = members.length;
    
    // Hommes/Femmes
    const males = members.filter(m => m.sex === 'M').length;
    const females = members.filter(m => m.sex === 'F').length;
    const others = members.filter(m => m.sex === 'Other').length;
    
    // Espérance de vie moyenne
    const deceased = members.filter(m => m.deathDate && m.birthDate);
    const avgLifespan = deceased.length > 0
      ? deceased.reduce((sum, m) => {
          const age = (new Date(m.deathDate) - new Date(m.birthDate)) / (1000 * 60 * 60 * 24 * 365);
          return sum + age;
        }, 0) / deceased.length
      : 0;
    
    // Nombre moyen d'enfants
    const parentsChildren = {};
    relations.forEach(rel => {
      if (rel.parent1) {
        const key = rel.parent1.toString();
        parentsChildren[key] = (parentsChildren[key] || 0) + 1;
      }
      if (rel.parent2) {
        const key = rel.parent2.toString();
        parentsChildren[key] = (parentsChildren[key] || 0) + 1;
      }
    });
    
    const avgChildren = Object.keys(parentsChildren).length > 0
      ? Object.values(parentsChildren).reduce((a, b) => a + b, 0) / Object.keys(parentsChildren).length
      : 0;
    
    // Nombre de générations
    const generations = calculateGenerations(members, relations);
    
    res.json({
      totalMembers,
      males,
      females,
      others,
      avgLifespan: Math.round(avgLifespan * 10) / 10,
      avgChildren: Math.round(avgChildren * 10) / 10,
      generations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function calculateGenerations(members, relations) {
  const generations = {};
  
  // Trouver les membres sans parents (génération 0)
  const childIds = new Set(relations.map(r => r.childId?.toString()).filter(Boolean));
  const rootMembers = members.filter(m => !childIds.has(m._id.toString()));
  
  rootMembers.forEach(m => {
    generations[m._id.toString()] = 0;
  });
  
  // BFS pour assigner les générations
  let queue = [...rootMembers];
  let visited = new Set(rootMembers.map(m => m._id.toString()));
  
  while (queue.length > 0) {
    const current = queue.shift();
    const currentGen = generations[current._id.toString()] || 0;
    
    // Trouver les enfants
    const childRels = relations.filter(r => 
      r.parent1?.toString() === current._id.toString() ||
      r.parent2?.toString() === current._id.toString()
    );
    
    childRels.forEach(rel => {
      if (rel.childId && !visited.has(rel.childId.toString())) {
        const childMember = members.find(m => m._id.toString() === rel.childId.toString());
        if (childMember) {
          generations[rel.childId.toString()] = currentGen + 1;
          visited.add(rel.childId.toString());
          queue.push(childMember);
        }
      }
    });
  }
  
  return Object.keys(generations).length > 0 ? Math.max(...Object.values(generations)) + 1 : 0;
}

module.exports = router;