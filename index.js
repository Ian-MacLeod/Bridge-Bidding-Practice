const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const pg = require('pg');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;

passport.use(new Strategy(
function(username, password, cb) {
  var user = {a: ""};
  var query = "SELECT * FROM users WHERE username='ian'";
  var tempfunc = function(err, client, done){
    console.log("in PG " + user.a);
    client.query(query, function(err, result){
      console.log("in Query " + user.a);
      done();
      if (err) {
        console.error(err);
        //res.send("error " + err);
      } else {
        user.a = result.rows[0];
        console.log(user);
      }
    }.bind(this));
  }.bind(this);
  pg.connect(DB_URL, tempfunc);
  console.log("Not reaching: " + user.a);
  if (!this.user) { return cb(null, false); }
  return cb(null, this.user);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  var user = null;
  var query = "SELECT * FROM users WHERE id=1";
  pg.connect(DB_URL, function(err, client, done){
    client.query(query, function(err, user){
      done();
      if (err) {
        console.error(err);
        //res.send("error " + err);
      } else {
        user = result.rows[0];
      }
    });
  });
  if (!user) {return cb(null, false); }
  cb(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
  // fake version
  /*
  passport.use(new Strategy(
    function(username, password, cb) {
      db.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));*/

function sqlQuery(query, action, values) {
  pg.connect(DB_URL, function(err, client, done){
    client.query(query, values, function(err, result){
      if (err) {
        console.error(err);
        //res.send("error " + err);
      } else {
        action(result);
      }
      done();
    });
  });
}

app.use(express.static("client/build"))

http.listen(PORT, function(){
  console.log(`Listening on port ${ PORT }`);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.to(msg.roomName).emit('chat message', msg.message);
  });
  socket.on('enter room', function(roomName){
    socket.join(roomName);
    socket.emit('enter room', roomName);
  });
  socket.on('leave room', function(roomName){
    socket.leave(roomName);
  });
  socket.on('test', function(credentials){
    console.log("Username is " + credentials.username);
    console.log("Password is " + credentials.password);
  });
  socket.on('get room list', function(){
    var query = 'SELECT room_name FROM rooms';
    function action(result) {
      const roomList = result.rows.map((row) => row.room_name);
      socket.emit('room list', roomList);
    }
    sqlQuery(query, action);
  });
  socket.on('create room', function(roomName){
    var query = "INSERT INTO rooms (room_name) VALUES ($1)";
    sqlQuery(query, function(){}, [roomName]);

    query = 'SELECT room_name FROM rooms';
    function action(result) {
      const roomList = result.rows.map((row) => row.room_name);
      socket.emit('room list', roomList);
    }
    setTimeout(function(){
      sqlQuery(query, action);
    }, 10);
  });
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.post('/login-user',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("Hello");
    res.redirect('/testing');
  });

app.get('/testing',
//  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.send('testing' + req.user);
  });

app.get('/login',
  function(req, res){
      res.send(`
        <div>
          <form action="/login-user" method="post">
            <div>
              <label>Username:</label>
              <input name="username" type="text"/>
            </div>
            <div>
              <label>Password:</label>
            </div>
            <input name="password" type="password"/>
            <div>
              <input type="submit" value="Log In"/>
            </div>
          </form>
        </div>`);
  });
