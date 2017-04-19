const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html')

app.get('/', function(req, res){
  res.sendFile(INDEX);
});

http.listen(PORT, function(){
  console.log('listening on ${ PORT }');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});