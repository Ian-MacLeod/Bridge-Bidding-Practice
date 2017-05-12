var Deck = require("./deck.js").Deck;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const pg = require('pg')

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL

function sqlQuery(query, action) {
  pg.connect(DB_URL, function(err, client, done){
    client.query(query, function(err, result){
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
  socket.on('get room list', function(){
    var query = 'SELECT room_name FROM rooms';
    function action(result) {
      const roomList = result.rows.map((row) => row.room_name);
      socket.emit('room list', roomList);
    }
    sqlQuery(query, action);
  });
  socket.on('deal hand', function(roomName){
    var deck = new Deck();
    console.log(deck.toString());
    console.log(deck.cards.length);
  });
  socket.on('create room', function(roomName){
    var query = "INSERT INTO rooms (room_name) VALUES ('" + roomName + "')";
    //var query = "INSERT INTO rooms (room_name) VALUES ('hello')";
    sqlQuery(query, function(){});

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
