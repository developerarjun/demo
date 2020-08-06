'user strict';
const express = require('express')
const app = express()
var cors = require('cors');
const bodyParser = require("body-parser");
const port = process.env.PORT || 3004;
const cookieParser = require('cookie-parser');
const session = require('express-session');

var morgan = require('morgan');
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.send(200);
   } else {
       next();
   }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
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

app.get('/getUsers', (req, res) => {
  connection.query('SELECT * FROM user_details', (err,rows) => {

    if(err) throw err;
    console.log('Data received from Db:');
    //console.log(rows);
    res.json(rows);
  });
  //res.send(rows);
})
app.post('/addUser', (req, res) => {
  console.log(req.body);
  let msg = ''; 
  if(req.body.name != undefined && req.body.phoneNumber != undefined && req.body.email != undefined && req.body.password != undefined){
    let sq = 'INSERT INTO user_details( name, phone_number, email, password, total_earning) VALUES (?,?,?,?,?)';
    let values = [req.body.name,req.body.phoneNumber, req.body.email,req.body.password,'0'];
    connection.query(sq, values, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    // get inserted id
    
  res.status(200).json({
    status: 'succes',
    data: req.body,
  })
    });
  }
})


app.post('/addVideo', (req, res) => {
  console.log(req.body);
  let msg = ''; 
  if(req.body.Action == 'A'){
    let sq = 'INSERT INTO videoDetails( channelNAme, videoName, videoDescription, earningRate, url,uploadBy) VALUES (?,?,?,?,?,?)';
    let values = [req.body.channelNAme, req.body.videoName,req.body.videoDescription,req.body.earningRate, req.body.url,req.body.uploadBy];
    connection.query(sq, values, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    // get inserted id
    
  res.status(200).json({
    status: 'succes',
    data: "successfully added",
  })
    });
  }else if(req.body.Action == 'E'){
    let sq = 'UPDATE videoDetails SET channelNAme = ?, videoName = ?, videoDescription = ?, earningRate = ?, url = ?,uploadBy =? where videoID = ?';
    let values = [req.body.channelNAme, req.body.videoName,req.body.videoDescription,req.body.earningRate, req.body.url,req.body.uploadBy,req.body.videoID];
    connection.query(sq, values, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    // get inserted id
    
  res.status(200).json({
    status: 'succes',
    data: "successfully updated",
  })
    });
  }
})
app.post('/deleteVideo', (req, res) => {
  console.log(req.body);
  let msg = ''; 
  if(req.body.id != undefined){
    let sq = 'DELETE FROM videoDetails WHERE videoID = ?';
    let values = [req.body.id];
    connection.query(sq, values, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    // get deleted id
    
  res.status(200).json({
    status: 'succes',
    data: req.body,
  })
    });
  }
})
app.get('/', (req, res) => {
 // console.log(req);
  if (req.session.loggedin) {
    res.status(200).json({
    status: 'login',
    data: req.session.username,
  })
	} else { 
    res.status(200).json({
    status: 'unlogin',
    data: "Plz Login",
  })
	}
	res.end();
})
app.post('/getEarn', (req, res) => {
  console.log(req.body.user);
   connection.query('SELECT total_earning FROM user_details where email =? ',[req.body.user], (err,rows) => {
    res.status(200).json({
      status: 'data',
      data: rows
        })
  });
})
app.post('/addEarn', (req, res) => {
  console.log(req.body.user);
  
   connection.query('UPDATE user_details set total_earning = ? where email = ?',[req.body.earning,req.body.user], (err,rows) => {
    res.status(200).json({
      status: 'data',
      data: rows
        })
  });
})
app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    connection.query('SELECT * FROM user_details where email =? and password = ?',[username,password], (err,rows) => {
      if (rows.length > 0) {
				req.session.loggedin = true;
        req.session.username = username;
         res.status(200).json({
            status: 'loginsuccess',
            data: req.session.username,
              })
			} else {
        res.status(200).json({
            status: 'invalid',
            data: "Incorrect Username and/or password",
              })
			}			
			res.end();
    });
  }
  else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})
app.post('/adminlogin', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    connection.query('SELECT * FROM admin_details where admin_email =? and password = ?',[username,password], (err,rows) => {
      if (rows.length > 0) {
				req.session.loggedin = true;
        req.session.username = username;
         res.status(200).json({
            status: 'loginsuccess',
            data: req.session.username,
              })
			} else {
        res.status(200).json({
            status: 'invalid',
            data: "Incorrect Username and/or password",
              })
			}			
			res.end();
    });
  }
  else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})