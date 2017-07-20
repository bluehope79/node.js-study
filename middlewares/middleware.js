var express =require('express');
var app = express();
var session = require('express-session');
var bodyParser =require('body-parser');
var ejs = require('ejs');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var multer = require('multer');


module.exports = function(app){

  //body Parser 미들 웨어
  app.use(bodyParser.urlencoded({ extended: false }))
  //session 미들웨어
  app.use(session({
    secret: 'eifiofjw1234',
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({ mongooseConnection: mongoose.connection })
  }));
  //upload시 실행
  app.use('/upload', express.static('uploads'));
  //ejs 미들 웨어
  app.set('views', './views');
  app.set('view engine', 'ejs');

}
