'user strict';
const express = require('express')
const app = express()
var cors = require('cors');
const port = process.env.PORT || 3003;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mysql = require('mysql')
  var db_config = {
    host: '148.72.232.149',
    user: 'SuperAdmin',
    password: '12345',
    database: 'earnMoney'
  };
  
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
handleDisconnect();
module.exports = connection;
app.get('/getVideo', (req, res) => {
  connection.query('SELECT * FROM videoDetails', (err,rows) => {

    if(err) throw err;
    console.log('Data received from Db:');
    //console.log(rows);
    res.json(rows);
  });
  //res.send(rows);
})
app.get('/', (req, res) => {
  res.json("HEllo");
  console.log("sads");
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})