const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(bodyParser.json())

//Test Route
app.get('/', (req, res) => {
    res.send('Backend server is running!')
})

//Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.connect((err) => {
    if(err){
        console.error('Database connection failed', err)
        return;
    }
    console.log('Connected to MySQL database')
})

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });



// Get All Users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a New User
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name, email, age });
  });
});

// Update a User
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('User updated successfully');
  });
});

// Delete a User
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('User deleted successfully');
  });
});
