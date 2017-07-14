var express =require('express');
var session = require('express-session');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var bodyParser =require('body-parser');
var app = express();
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
         <h1> Hello, ${req.session.displayName} </h1>
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
  for(var i=0; i<users.length; i++){
    var user = users[i];
  if(uname === user.username && pwd===user.password){
    req.session.displayName = user.displayName;
    return req.session.save(function(){
       res.redirect('/welcome');
    });
  }
}
  res.send('who are you?<a href="/auth/login">login</a>');
});
//회원가입 페이지
var users = [
  {
  username : 'skekf123',
  password : 'qkdnf22@@',
  displayName:'Skekf123'
}
];
app.post('/auth/register', function(req, res){
  var user ={
  username:req.body.username,
  password:req.body.password,
  displayName:req.body.displayName
};
//유저 들록 밑 회원가입후 처리
users.push(user);
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
//포트설정
app.listen(3003, function(){
  console.log('연결완료!');
});
