// Vercel Serverless Function for Scoreboard API
// File: /api/scoreboard.js

// In-memory storage (trong production thực tế nên dùng database)
let scores = [
    { name: "Demo Player", level: 8, timestamp: new Date('2024-01-01') },
    { name: "CAPTCHA Master", level: 12, timestamp: new Date('2024-01-02') },
    { name: "Human Fighter", level: 6, timestamp: new Date('2024-01-03') },
    { name: "AI Challenger", level: 15, timestamp: new Date('2024-01-04') },
    { name: "Robot Detector", level: 9, timestamp: new Date('2024-01-05') }
];

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Get leaderboard - return top 10 scores sorted by level
            const sortedScores = scores
                .sort((a, b) => {
                    if (b.level !== a.level) {
                        return b.level - a.level; // Sort by level descending
                    }
                    return new Date(a.timestamp) - new Date(b.timestamp); // Then by timestamp ascending
                })
                .slice(0, 10);

            res.status(200).json(sortedScores);
        } 
        else if (req.method === 'POST') {
            // Add new score
            const { name, level } = req.body;

            // Validation
            if (!name || !level) {
                return res.status(400).json({ 
                    error: 'Name and level are required',
                    received: { name, level }
                });
            }

            if (typeof level !== 'number' || level < 1) {
                return res.status(400).json({ 
                    error: 'Level must be a positive number',
                    received: { level }
                });
            }

            if (typeof name !== 'string' || name.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'Name must be a non-empty string',
                    received: { name }
                });
            }

            // Create new score entry
            const newScore = {
                name: name.trim().substring(0, 20), // Limit name length
                level: parseInt(level),
                timestamp: new Date()
            };

            // Add to scores array
            scores.push(newScore);

            // Keep only latest 100 scores to prevent memory issues
            if (scores.length > 100) {
                scores = scores.slice(-100);
            }

            res.status(201).json({ 
                message: 'Score added successfully',
                score: newScore
            });
        } 
        else {
            // Method not allowed
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ error: `Method ${req.method} not allowed` });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
}