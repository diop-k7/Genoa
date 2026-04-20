const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  sex: { type: String, enum: ['M', 'F', 'Other'], required: true },
  photo: String,
  birthDate: Date,
  deathDate: Date,
  professions: [String],
  addresses: [String],
  phones: [String],
  emails: [String],
  privateInfo: String,
  publicInfo: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: String,
  updatedAt: Date
});

module.exports = mongoose.model('Member', memberSchema);