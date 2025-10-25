const router = require('express').Router();
let ScoreEntry = require('../models/scoreEntry.model');

// GET all score entries (sorted by level descending, then by timestamp)
router.route('/').get((req, res) => {
    ScoreEntry.find()
        .sort({ level: -1, timestamp: 1 })
        .limit(10) // Giới hạn top 10
        .then(entries => res.json(entries))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST new score entry
router.route('/').post((req, res) => {
    const { name, level } = req.body;
    
    if (!name || !level) {
        return res.status(400).json('Name and level are required');
    }

    const newScoreEntry = new ScoreEntry({ name, level });
    
    newScoreEntry.save()
        .then(() => res.json('Score entry added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;