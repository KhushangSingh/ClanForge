const mongoose = require('mongoose');

const GlobalStatSchema = new mongoose.Schema({
  // Fixed ID so we always update the same document
  _id: { type: String, default: 'main_stats' }, 
  successfulSquads: { type: Number, default: 0 }
});

module.exports = mongoose.model('GlobalStat', GlobalStatSchema);