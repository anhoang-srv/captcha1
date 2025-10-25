require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Comment out MongoDB for now
// const mongoose = require('mongoose');
// const scoreboardRouter = require('./routes/scoreboard');

const app = express();

app.use(cors());
app.use(express.json());

// Simple in-memory storage for demo
let scores = [
    { name: "Demo User", level: 5 },
    { name: "Test Player", level: 3 },
    { name: "AI Fighter", level: 7 }
];

// Simple scoreboard routes
app.get('/scoreboard', (req, res) => {
    res.json(scores.sort((a, b) => b.level - a.level).slice(0, 10));
});

app.post('/scoreboard', (req, res) => {
    const { name, level } = req.body;
    if (name && level) {
        scores.push({ name, level, timestamp: new Date() });
        res.json({ message: 'Score added successfully' });
    } else {
        res.status(400).json({ error: 'Name and level are required' });
    }
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server running on port ${port} (in-memory mode)`);
});