'user strict';
var sql = require('./connection.js');
const express = require('express')
const app = express()
var cors = require('cors');
const port = process.env.PORT || 3003;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/getVideo', (req, res) => {
  sql.query('SELECT * FROM videoDetails', (err,rows) => {
    if(err) throw err;
    console.log('Data received from Db:');
    //console.log(rows);
    res.json(rows);
  });
  //res.send(rows);
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})