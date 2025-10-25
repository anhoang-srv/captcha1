// Local development server to test Vercel functions
// Run with: node dev-server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Import the Vercel function
const scoreboardHandler = require('./api/scoreboard.js').default;

// Wrapper to make Vercel function work with Express
app.all('/api/scoreboard', (req, res) => {
    scoreboardHandler(req, res);
});

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Development server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api/scoreboard`);
});

module.exports = app;