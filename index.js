const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const pg = require('pg')

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL

app.get('/db', function(req, res){
  pg.connect(DB_URL, function(err, client, done){
    client.query('SELECT * FROM test_table', function(err, result){
      done();
      if (err) {
        console.error(err);
        res.send("error " + err);
      } else{
        res.setHeader('Content-Type', 'application/json');
        res.send(result.rows);
      }
    });
  });
});

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
});
