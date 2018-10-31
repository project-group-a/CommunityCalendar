// to run: 'node server.js' in base directory
// https://expressjs.com/en/guide/database-integration.html#mysql
// https://www.terlici.com/2015/08/13/mysql-node-express.html

/* tslint:disable no-shadowed-variable */
const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();

const port = process.env.PORT || 3005;

// https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
let pool = mysql.createPool({
  host: 'projectgroupa.ddns.net',
  port: '3306',
  user: 'testCalendar',
  password: 'calendarAppPass',
  database: 'calendarDbFull'
});

app.use(express.static(__dirname + '/dist/my-project'));
app.use(express.json());

app.get('/api/data', (req, res) => {
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      throw err;
    } else {
      pool.query('SELECT * FROM User', (err, rows, fields) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.json(rows);
      });
    }
  });
});

// https://stackoverflow.com/questions/704194/how-to-hash-passwords-in-mysql
// https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_sha2
app.post('/api/addUser', (req, res) => {
  console.log('hit addUser api; request:');
  console.log(req.body);
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      res.status(500).json(err);
    } else {
      pool.query(`INSERT INTO User (User_Name, User_Pass, Is_Admin, User_Email) VALUES ('${req.body.username}',sha2('${req.body.pass}',256),'0','${req.body.email}')`, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(200);
        }
      });
    }
  });
});

app.post('/api/signIn', (req, res) => {
  console.log('hit sign in API; request:');
  console.log(req.body);
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      res.status(500).json(err);
    } else {
      pool.query(`SELECT * FROM User WHERE User_Name = '${req.body.username}' AND User_Pass = sha2('${req.body.pass}',256)`, (err, result) => {
        if (err) {
          console.log('Error getting sign in data from database:');
          console.log(err);
          res.status(500).json(err);
        } else {
          res.status(200).json(result);
        }
      });
    }
  });
});

app.post('/api/addEvent', (req, res) => {
  console.log('hit add event API; request:');
  console.log(req.body);
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      res.status(500).json(err);
    } else {
      pool.query(`INSERT INTO Event (Event_Name, Event_Date, Event_Type, Is_Approved) VALUES ('${req.body.name}', '${req.body.date}', '${req.body.type}', '0')`, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200);
        }
      });
    }
  });
});

app.post('/api/editEvent', (req, res) => {
  console.log('hit edit event API; request:');
  console.log(req.body);
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      res.status(500).json(err);
    } else {
      pool.query(`UPDATE Event SET Event_Name = '${req.body.eventName}', Event_Date = '${req.body.eventDate}', Event_Type = '${req.body.eventType}' WHERE Event_Id = '${req.body.eventId}'`, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200);
        }
      });
    }
  });
});

app.post('/api/deleteEvent', (req, res) => {
  console.log('hit delete event API; request:');
  console.log(req.body);
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      res.status(500).json(err);
    } else {
      pool.query(`DELETE FROM Event WHERE Event_Id = '${req.body.id}'`, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200);
        }
      });
    }
  });
});

app.get('/api/getEvents', (req, res) => {
  pool.getConnection(function(err) {
    if (err) {
      console.log('error getting connection');
      throw err;
    } else {
      pool.query('SELECT * FROM Event', (err, rows, fields) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.status(200).json(rows);
      });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname));
});

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
