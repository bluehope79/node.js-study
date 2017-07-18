var express =require('express');
var ejs = require('ejs');
var session = require('express-session');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var bodyParser =require('body-parser');
var app = express();
var User = require('../models/user');
var multer = require('multer');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var server = require('http').createServer(app);


//라우터를 사용하기 위한 모듈화
module.exports = function (app) {

  //멀터 storage사용
var _storage = multer.diskStorage({
  destination: function (req, file, cb) { //사용자가 제출한 파일을 어디에 저장?
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {  //저장할 파일명을 어떻게 할것인가?
    cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage}) //dest 는 디렉토리 명

//body Parser 미들 웨어
app.use(bodyParser.urlencoded({ extended: false }))

//ejs 미들 웨어
app.set('views', './views');
app.set('view engine', 'ejs');



//파일 업로드
app.get('/upload', function(req, res){
  //전역변수인 회원 id(sessionid)를 통해 user db에 uploadfile(회원이 저장한 파일 명)을 보여줌
  User.findOne({ username: global.sessionid }, function(err, scott) {
  res.render('upload',{sessionnick:scott.displayName, sessionfile:scott.uploadfile,name:null,destination:'uploads/', id:global.sessionid});
});
});

app.post('/upload', upload.single('userfile'), function(req, res){ //미들웨어 req파일안에 userfile은 업로드 디렉토리의 폼 네임
  console.log(req.file); //업로드된 파일 콘솔을 통해 확인
  db.collection('users').updateOne( //user collection에 uploadfile를 null 값에서 filename으로 수정함
  { username: global.sessionid }, //전역변수인 회원 id를 기준으로 db 검색 및 수정
  { $set: { uploadfile: req.file.filename }, //req.file.filename -> 제출된 파일명 ex) 증명사진.jpg
  $currentDate: { lastModified: false } })
  .then(function(result) {
  });
  User.findOne({ username: global.sessionid }, function(err, scott) {
  res.render('upload',{ sessionnick:scott.displayName, sessionfile:scott.uploadfile, destination:req.file.destination, filename:req.file.filename, array:User.uploadfile, id:global.sessionid});
});  //upload post방식으로 라우팅
});
//몽구스 및 connect-mongo 사용
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
//웰컴페이지 (첫 페이지) 라우팅
app.get('/', function(req, res){
  res.render('welcome');
});
//로그아웃 기능
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;  //->session 삭제
  global.sessionid = null;
  global.sessionpwd = null;   // -> 저장되있던 전역 변수들도 null값으로 바꿈
  global.sessionnick = null;
  req.session.save(function(){
    res.redirect('/');  //시작페이지로 이동
  });
});

app.get('/main', function(req, res){  //->로그인 뒤 기능을 이용할 수 있는 메인 페이지
  if(req.session.displayName){  //세션을 가지고 있다면
      res.render('main',{sessionnick:req.session.displayName});  //main page로 라우팅 및 닉네임 변수 저장
  } else{
   res.redirect('/'); //세션을 가지고 있지 않다면 시작 페이지로
  }
});
// login post방식
app.post('/login', function(req, res){
   var uname = req.body.username;
    var pwd = req.body.password;

  User.findOne({ username: uname }, function(err, scott) {   //db 에서 같은 id값을 찾는다.
    if (scott===null) { return res.send(`<script>alert("id를 확인해 주세요");  history.back();</script>` );}
    var rightpassword=scott.password;      //db에 입력한 id 가지고 있지 않다면 경고창
    if(rightpassword=== pwd){   //id가 있다면, db에서 pw를 찾는다.
      req.session.displayName = scott.displayName;
    return req.session.save(function(){  //db에 pwd가 있다면 session을 저장하고 각 테이블을 전역변수 저장
       global.sessionid = scott.username;
       global.sessionpwd = scott.password;
      global.sessionnick = scott.displayName;
       res.redirect('main');}); //id pwd 확인 되었으면 메인으로 이동
    }else{
        res.send(`<script>alert("password를 확인해 주세요");  history.back();</script>`);
    } //pwd가 없다면 경고창 생성

  });
});
//회원가입 페이지
app.post('/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var displayName = req.body.displayName;


  new User({username: username, password: password, displayName: displayName, uploadfile: null}).save(function(err, doc){
     if(doc) //데이터가 정확히 들어갔는지 체크하는 코드
     {
       global.sessionid = username;
       global.sessionpwd = password; //->입력한 데리터를 db에 저장함과 동시에 각 정보를 전역변수화
       global.sessionnick = displayName
       console.log(doc)  //가입시 콘솔창 정보생성
     }

  })
//유저 등록 밑 회원가입후 처리
//users.push(user);
req.session.displayName = req.body.displayName;
req.session.save(function(){    //req.session.을 기억한다.
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
//upload시 실행
app.use('/upload', express.static('uploads'));


};
