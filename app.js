var express =require('express');
var app = express();
var User = require('./models/user');
var http = require('http').Server(app);


// Middlewares
require('./middlewares/middleware')(app);

// Routes
require('./routes/router')(app);

// WebSocket
require('./sockets/index')(http);




//start server
http.listen(3003, function(){
  console.log('연결완료!');
});

module.exports = app;
