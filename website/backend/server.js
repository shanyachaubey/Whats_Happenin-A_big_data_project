// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');

// defining the Express app
const app = express();

// using bodyParser to parse JSON in the request body into JS objects
app.use(bodyParser.json());

// starting the server and keeping the connection open to listen for more requests
app.listen(3000, () => {
    console.log('listening on port 3000');
  });
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

app.put('/update_review', async function (req, res) {
  const q1 = 'SELECT review FROM reviews WHERE review_id = $1';
  const q2 = 'SELECT image_url,image_caption FROM images WHERE image_id = $1';
  var error = 0;
  const resR = await db.query(q1, [req.body.review_id]);
  const resImage = await db.query(q2, [req.body.image_id]);

  if (resR[0].review != req.body.review) {
    var changeRev = 'UPDATE reviews SET review = $1 WHERE review_id = $2';
    await db.query[changeRev[req.body.review, req.body.review_id]];
    error = 1;
  }

  if (resImage[0].image_url != req.body.image_url) {
    var changeImage = 'UPDATE images SET image_url = $1 WHERE image_caption = $2 AND WHERE image_id = $3';
    await db.query[changeImage[req.body.image_url, req.body.image_caption, req.body.image_id]];
    error = 1;
  }

 if(error == 1){
  res.status(200).json({
    status: 'success',
    message: 'Data updated successfully',
  });
 }
 else{
  res.send[('message' | 'error')];
 }

});

app.delete('/delete_review/:review_id', function (req, res) {
  const review_id = req.params.review_id;
  const query = 'DELETE FROM reviews WHERE review_id = $1 ';
  const query2 = 'DELETE FROM trails_to_reviews WHERE review_id = $1 ';
  const query3 = 'DELETE FROM reviews_to_images WHERE review_id = $1 ';

  db.any(query2, [review_id])
  db.any(query3, [review_id])
  db.any(query, [review_id])
    .then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'data deleted successfully',
      });
    })
    .catch(function (err) {
      return console.log(err);
    });

    
});

app.get('/search', function (req, res) {
  var difficulty = String(req.body.difficulty);
  var location = String(req.body.location);
  var average = req.body.avg_rating;
  var elevation = req.body.elevation_gain;

  var query = "SELECT * FROM trails";
  var check1 = 0;
  var flag = 0;

  if(location != ""){
    query += " WHERE location = $1"
    flag = 1;
  }
  if(difficulty){
    if(check1 == 0){
      query += " ORDER BY";
    }
    query += " difficulty DESC"
    check1 = 1;
  }
  if(average){
    if(check1 == 0){
      query += " ORDER BY";
    }
    if(check1 == 1) query+=","
    query+= " avg_rating DESC"
    check1 = 1;
  }
  if(elevation){
    if(check1 == 0){
      query += " ORDER BY";
    }
    if(check1 == 1) query+=","
    query+= " elevation_gain DESC"
    check1 = 1;
  }

  query += ";";


  if(flag == 1){
    console.log(query);
    db.any(query, [location])
    .then(function (rows) {
      res.send(rows);
    })
    .catch(function (err) {
      console.log(err);
    });
  }
  else{
    db.any(query)
    .then(function (rows) {
      res.send(rows);
    })
    .catch(function (err) {
      console.log(err);
    });
  }
  
});

app.get('/reviewsForTrail', function (req, res) {
  var query = "SELECT * from reviews WHERE review_id IN (SELECT review_id FROM trails_to_reviews WHERE trail_id = (SELECT trail_id FROM trails WHERE name = $1)); ";

  db.any(query, [req.body.trailname])
    .then(function (rows) {
      res.send(rows);
    })
    .catch(function (err) {
      console.log(err);
    });
});


// // starting the server and keeping the connection open to listen for more requests
// app.listen(3000, () => {
//   console.log('listening on port 3000');
// });
// const pgp = require('pg-promise')();
// require('dotenv').config();


// const dbConfig = {
//   host: 'db',
//   port: 5432,
//   database: process.env.POSTGRES_DB,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
// };

// const db = pgp(dbConfig);