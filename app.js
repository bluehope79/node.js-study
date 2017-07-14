var express =require('express');
var session = require('express-session');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var bodyParser =require('body-parser');
var app = express();
var User = require('./models/user')
app.use(bodyParser.urlencoded({ extended: false }))

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
//로그아웃
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
app.get('/welcome', function(req, res){
  if(req.session.displayName){
      res.send(`
         <h1> 환영합니다, ${req.session.displayName} 님</h1>
         <a href="/auth/logout">logout</a>
      `);
  } else{
   res.send(`
        <h1>Welcome</h1>
        <ul>
        <li><a href="/auth/login">login</a></li>
        <li><a href="/auth/register">회원가입</a></li>
        </ul>
      `);
  }
});
// login post방식
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  User.findOne({ username: uname }, function(err, scott) {
    if (scott===null) { return res.send('id를 확인해 주세요 <a href="/auth/login">login</a>'); }
    var rightpassword=scott.password;
    if(rightpassword=== pwd){
      req.session.displayName = scott.displayName;
    return req.session.save(function(){
       res.redirect('/welcome');});
    }else{
        res.send('password를 확인해 주세요 <a href="/auth/login">login</a>');
    }

  });
});
//회원가입 페이지
app.post('/auth/register', function(req, res){
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
  res.redirect('/welcome');
});
});
app.get('/auth/register', function(req, res){
  var output =`
  <h1>회원가입</h1>
  <form action="/auth/register" method="post">
    <p>
   <input type ="text" name ="username" placeholder="username">
   </p>
   <p>
   <input type ="password" name ="password" placeholder="password">
    </p>
    <p>
    <input type ="text" name ="displayName" placeholder="displayName">
     </p>
    <p>
    <input type ="submit">
     </p>
  </form>
  `;
  res.send(output);
})
//첫 login 페이지
app.get('/auth/login', function(req, res){
  var output =`
    <h1>로그인</h1>
    <form action="/auth/login" method="post">
      <p>
     <input type ="text" name ="username" placeholder="username">
     </p>
     <p>
     <input type ="text" name ="password" placeholder="password">
      </p>
      <p>
      <input type ="submit">
       </p>
    </form>
  `;
  res.send(output);
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
