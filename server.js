// to run: 'node server.js' in base directory
// https://expressjs.com/en/guide/database-integration.html#mysql
// https://www.terlici.com/2015/08/13/mysql-node-express.html
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const port = process.env.PORT || 3005;

app.use(express.static(__dirname + '/dist/my-project'));

app.get('/*', (req,res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port, () => console.log('Running...'));
