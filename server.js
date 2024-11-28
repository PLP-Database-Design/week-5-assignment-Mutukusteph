const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const app = express()

app.use(express.json())
dotenv.config()

// Database connection:
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Check if the connection was successfull.
db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database successfully as id:', db.threadId);
});

// Send message to the browser:

app.get('/', (req, res) => {
    res.send('By Gods grace I will compelete this programme')
})

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Question 1
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('patients', { results });
    });
});
// Question 2
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('providers', { results });
    });
});

// Question 3. Filter patients by the first name
app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) throw err;
        res.render('filter_patients', { results });
    });
});

// Question 4
app.get('/providers/filter', (req, res) => {
    const specialty = req.query.specialty;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) throw err;
        res.render('filter_providers', { results });
    });
});

const PORT = 3131
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})