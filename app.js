var express =require('express');
var ejs = require('ejs');
var session = require('express-session');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var bodyParser =require('body-parser');
var app = express();
var User = require('./models/user')
app.use(bodyParser.urlencoded({ extended: false }))
//ejs
app.set('views', './views');
app.set('view engine', 'ejs');

//몽구스
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("db에 연결되었습니다.");
});
mongoose.connect('mongodb://localhost/login');

//session 미들웨어
app.use(session({
  secret: 'eifiofjw1234',
  resave: false,
  saveUninitialized: true,
  store:new MongoStore({ mongooseConnection: mongoose.connection })
}));
//웰컴페이지
app.get('/', function(req, res){
  res.render('welcome');
});
//로그아웃
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/');
  });
});

app.get('/main', function(req, res){
  if(req.session.displayName){
      res.render('main',{displayName:req.session.displayName});
  } else{
   res.redirect('/');
  }
});
// login post방식
app.post('/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  User.findOne({ username: uname }, function(err, scott) {
    if (scott===null) { return res.send('id를 확인해 주세요 <a href="/login">login</a>'); }
    var rightpassword=scott.password;
    if(rightpassword=== pwd){
      req.session.displayName = scott.displayName;
    return req.session.save(function(){
       res.redirect('main');});
    }else{
        res.send('password를 확인해 주세요 <a href="/login">login</a>');
    }

  });
});
//회원가입 페이지
app.post('/register', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  let displayName = req.body.displayName

  new User({username: username, password: password, displayName: displayName}).save(function(err, doc){
     if(doc) //데이터가 정확히 들어갔는지 체크하는 코드
     {
       console.log(doc)
     }

  })
//유저 들록 밑 회원가입후 처리
//users.push(user);
req.session.displayName = req.body.displayName;
req.session.save(function(){
  res.redirect('/main');
});
});
app.get('/register', function(req, res){
  res.render('register');
})
//첫 login 페이지
app.get('/login', function(req, res){
  res.render('login');
})
//test
app.get('/test', function(req, res){
  User.findOne({ username: 'akswnd119' }, function(err, scott) {
    if (scott===null) { return res.send('id를 확인해 주세요'); }
    var rightpassword=scott.password;
    if(rightpassword==='qkdnf22@@'){
      res.send('환영합니다.'+ scott.displayName + '님');
    }else{
        res.send('password를 확인해 주세요.');
    }

  });

});

//포트설정
app.listen(3003, function(){
  console.log('연결완료!');
});
