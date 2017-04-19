const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const pg = require('pg')

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html')

app.get('/', function(req, res){
  res.sendFile(INDEX);
});

app.get('/db', function(req, res){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    client.query('SELECT * FROM test_table', function(err, result){
      done();
      if (err) {
        console.error(err);
        res.send("error " + err);
      } else{
        res.setHeader('Content-Type', 'application/json');
        res.send({results.rows});
      }
    });
  });
});

http.listen(PORT, function(){
  console.log(`Listening on port ${ PORT }`);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
