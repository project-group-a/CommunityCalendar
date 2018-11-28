/*
- to run: 'node server.js' in base directory
- https://expressjs.com/en/guide/database-integration.html#mysql
- https://www.terlici.com/2015/08/13/mysql-node-express.html
- https://www.w3schools.com/nodejs/nodejs_mysql.asp

Unit Tests:
  - https://stackoverflow.com/questions/37502809/what-are-the-spec-ts-files-generated-by-angular-cli-for
  - npm junit: https://www.npmjs.com/package/junit
*/

/* tslint:disable no-shadowed-variable */
const express = require('express');
const path = require('path');
const mysql = require('mysql');
/* TODO: use logging api? (https://github.com/log4js-node/log4js-node) */
/* TODO: confetti on adding event? (https://github.com/daniel-lundin/dom-confetti) */
/* TODO: send email invitation: (https://www.w3schools.com/nodejs/nodejs_email.asp) */

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

// https://coderwall.com/p/0itzzw/prevent-node-mysql-connection-closed-error
app.get('/api/getUsers', (req, res) => {
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query('SELECT * FROM User', (err, rows) => {
      connection.release();
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json(rows);
    });
  });
});

// https://stackoverflow.com/questions/704194/how-to-hash-passwords-in-mysql
// https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_sha2
app.post('/api/addUser', (req, res) => {
  console.log('hit addUser api; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`INSERT INTO User (User_Name, User_Pass, Is_Admin, User_Email) VALUES ('${req.body.username}',sha2('${req.body.pass}',256),'0','${req.body.email}')`, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(200).json(result);
      }
    });
  });
});

app.post('/api/signIn', (req, res) => {
  console.log('hit sign in API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`SELECT * FROM User WHERE User_Name = '${req.body.username}' AND User_Pass = sha2('${req.body.pass}',256)`, (err, result) => {
      if (err) {
        console.log('Error getting sign in data from database:');
        console.log(err);
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    }); // end connection/query()
    connection.release();
  });
});

app.post('/api/addEvent', (req, res) => {
  console.log('hit add event API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`INSERT INTO Event (Event_Name, Event_Description, Event_Owner, Event_Date_Start, Event_Date_End, Event_Type, Is_Approved) SELECT '${req.body.eventName}', '${req.body.eventDescription}', User_Name, '${req.body.startDate}', '${req.body.endDate}', '${req.body.type}', '1' FROM User WHERE User_Name = '${req.body.owner}';`, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  });
});

app.post('/api/editEvent', (req, res) => {
  console.log('hit edit event API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`UPDATE Event SET Event_Name = '${req.body.eventName}', Event_Date_Start = '${req.body.eventStart}', Event_Date_End = '${req.body.eventEnd}' WHERE Event_Id = '${req.body.eventId}'`, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  });
});

app.post('/api/deleteEvent', (req, res) => {
  console.log('hit delete event API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`DELETE FROM Event WHERE Event_Id = '${req.body.id}'`, (err, result) => {
      if (err) {
        res.status(500).json(err);
      }
      else {
        connection.query(`DELETE FROM Calendar WHERE Event_Id = '${req.body.id}'`, (err, result) => {
          connection.release();
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json(result);
          }
        });
      } 
    });
  });
});

app.post('/api/subscribeToEvent', (req, res) => {
  console.log('hit subscribe to event API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`DELETE FROM Calendar WHERE Calendar_Id = ${req.body.calendarid} AND Event_Id = ${req.body.eventid}`, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        connection.query(`INSERT INTO Calendar (Calendar_Id,Event_Id,Is_Subscribed) Values (${req.body.calendarid},${req.body.eventid},1)`, (err, result) => {
          connection.release();
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(200).json(result);
          }
        });
      } 
    });
  });
});

app.post('/api/unsubscribeFromEvent', (req, res) => {
  console.log('hit unsubscribe from event API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`DELETE FROM Calendar WHERE Calendar_Id = '${req.body.calendarid}' AND Event_Id = '${req.body.eventid}'`, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  });
});

app.get('/api/getCalendar', (req, res) => {
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`SELECT * FROM Event WHERE Event_Id IN (SELECT Event_Id FROM Calendar WHERE Calendar_Id = '${req.query.Calendar_Id}')`, (err, rows, fields) => {
      connection.release();
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(rows);
    });
  });
});

app.get('/api/getNotification', (req, res) => {

  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`SELECT * FROM Event WHERE Event_Id IN (SELECT Event_Id FROM Calendar WHERE Calendar_Id = '${req.query.Calendar_Id}' AND Is_Subscribed = '0')`, (err, rows, fields) => {
      connection.release();
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(rows);
    });
  });
});

app.get('/api/getEvents', (req, res) => {
  console.log('hit get events api...');
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`SELECT * FROM Event WHERE Event_Type <> 'private' AND Event_Name LIKE '%${req.query.search}%'`, (err, rows, fields) => {
      connection.release();
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(rows);
    });
  });
});

app.post('/api/inviteUser', (req, res) => {
  console.log('hit invite user API; request:');
  console.log(req.body);
  pool.getConnection(function(err, connection) {
    connection.on('error', function(err) {
      console.log('error getting connection:');
      console.log(err);
    });
    connection.query(`INSERT INTO Calendar (Calendar_Id,Event_Id,Is_Subscribed) Values ((SELECT Calendar_Id FROM User WHERE User_Name = ${req.body.user}),${req.body.eventid},0)`, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200);
      }
    });
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
