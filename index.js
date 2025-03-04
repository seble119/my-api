const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,       // Use environment variable
    host: process.env.DB_HOST,       // Use environment variable
    database: process.env.DB_NAME,   // Use environment variable
    password: process.env.DB_PASSWORD,// Use environment variable
    port: process.env.DB_PORT,       // Use environment variable
});

app.use(express.json());

// API endpoint to get users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// API endpoint to create a user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});