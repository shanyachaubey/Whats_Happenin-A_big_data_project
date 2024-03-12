// importing the dependencies
//yoooo
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// defining the Express app
const app = express();

// using bodyParser to parse JSON in the request body into JS objects
app.use(bodyParser.json());

const pgp = require('pg-promise')();
require('dotenv').config();

const dbConfig = {
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

app.use(express.static(path.join(__dirname, '../frontend/public')));

// Define routes for different HTML files
app.get('/', (req, res) => {
  res.sendFile(path.resolve('../frontend/public/index.html'));
});

app.get('/MVP', (req, res) => {
  res.sendFile(path.resolve('../frontend/public/MVP.html'));
});

app.get('/About_US', (req, res) => {
  res.sendFile(path.resolve('../frontend/public/About_US.html'));
});

app.get('/Contact_US', (req, res) => {
  res.sendFile(path.resolve('../frontend/public/Contact_US.html'));
});
app.get('/images', (req, res) => {
  res.sendFile(path.resolve('../frontend/public/images'));
});
app.get('/getdata', function (req, res) {
  var query = "SELECT * FROM trails WHERE location = 'California' ORDER BY avg_rating DESC LIMIT 3;";
  db.any(query)
    .then(function (rows) {
      res.send(rows);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post('/add_review', function (req, res) {
  const query = 'insert into reviews (username, review, rating) VALUES ($1, $2, $3) returning *';
  db.any(query, [req.body.username, req.body.review, req.body.rating])
    .then(function (data) {
      res.status(201).json({
        status: 'success',
        data: data,
        message: 'data added successfully',
      });
    })
    .catch(function (err) {
      return console.log(err);
    });
});

// other routes...

// starting the server and keeping the connection open to listen for more requests
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if set, otherwise use 3000
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
