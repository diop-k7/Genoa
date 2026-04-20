const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['parent', 'couple'], 
    required: true 
  },

  from: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member' 
  },

  to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member' 
  },

  isBiological: Boolean
});

module.exports = mongoose.model('Relation', relationSchema);