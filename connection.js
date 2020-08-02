'user strict';
var mysql = require('mysql')
  var connection = mysql.createConnection({
    host: '148.72.232.149',
    user: 'SuperAdmin',
    password: '12345',
    database: 'earnMoney'
  });
  connection.query('select 1 + 1', (err, rows) => { /* */ });
module.exports = connection;