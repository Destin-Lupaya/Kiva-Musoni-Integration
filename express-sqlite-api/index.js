const express = require('express');
const bodyParser = require('body-parser');
const User = require('./User');

const app = express();
app.use(bodyParser.json());

// Routes
// Get all users
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Add a new user
app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});
