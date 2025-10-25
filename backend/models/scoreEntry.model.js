const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreEntrySchema = new Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const ScoreEntry = mongoose.model('ScoreEntry', scoreEntrySchema);

module.exports = ScoreEntry;