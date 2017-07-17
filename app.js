var express =require('express');
var ejs = require('ejs');
var session = require('express-session');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var bodyParser =require('body-parser');
var app = express();
var User = require('./models/user');
var multer = require('multer');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var server = require('http').createServer(app);



// Routes
require('./routes/router')(app);

//소켓 라우팅 ->라우터으로 옮기면 오류발생
app.get('/chating', function(req, res){
res.sendFile(__dirname + '/views/index.html'); //->요 부분 원인같음
});
//소켓 미들웨어
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});



//start server
http.listen(3003, function(){
  console.log('연결완료!');
});
