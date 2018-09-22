// to run: 'node server.js' in base directory
// https://expressjs.com/en/guide/database-integration.html#mysql
// https://www.terlici.com/2015/08/13/mysql-node-express.html

/* tslint:disable no-shadowed-variable */
const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql');

const app = express();

const port = process.env.PORT || 3005;

// https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rootpass',
  database: 'sakila'
});

app.use(express.static(__dirname + '/dist/my-project'));

app.get('/api/data', (req, res) => {
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      throw err;
    } else {
      pool.query('SELECT * FROM sakila.actor LIMIT 10;', (err, rows, fields) => {
        if (err) {
          throw err;
        }
        res.json(rows);
      });
    }
  });
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));


app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
