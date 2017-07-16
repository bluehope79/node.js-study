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


//멀터 storage사용
var _storage = multer.diskStorage({
  destination: function (req, file, cb) { //사용자가 제출한 파일을 어디에 저장?
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {  //저장할 파일명을 어떻게 할것인가?
    cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage}) //dest 는 디렉토리 명
app.use(bodyParser.urlencoded({ extended: false }))
//ejs
//app.set('views', './views');
app.set('view engine', 'ejs');


//소켓 채팅창 라우팅
app.get('/chating', function(req, res){
res.sendFile(__dirname + '/views/index.html');
});
//소켓 미들웨어
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

//파일 업로드
app.get('/upload', function(req, res){
  User.findOne({ username: global.sessionid }, function(err, scott) {
  res.render('upload',{sessionnick:scott.displayName, sessionfile:scott.uploadfile,name:null,destination:'uploads/', id:global.sessionid});
});
});

app.post('/upload', upload.single('userfile'), function(req, res){ //미들웨어 req파일안에 userfile은 업로드 디렉토리의 폼 네임
  console.log(req.file);
  db.collection('users').updateOne(
  { username: global.sessionid },
  { $set: { uploadfile: req.file.filename },
  $currentDate: { lastModified: false } })
  .then(function(result) {
  });
  User.findOne({ username: global.sessionid }, function(err, scott) {
  res.render('upload',{ sessionnick:scott.displayName, sessionfile:scott.uploadfile, destination:req.file.destination, filename:req.file.filename, array:User.uploadfile, id:global.sessionid});
});
});
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
  global.sessionid = null;
  global.sessionpwd = null;
  global.sessionnick = null;
  req.session.save(function(){
    res.redirect('/');
  });
});

app.get('/main', function(req, res){
  if(req.session.displayName){
      res.render('main',{sessionnick:req.session.displayName});
  } else{
   res.redirect('/');
  }
});
// login post방식
app.post('/login', function(req, res){
   var uname = req.body.username;
    var pwd = req.body.password;

  User.findOne({ username: uname }, function(err, scott) {
    if (scott===null) { return res.send(`<script>alert("id를 확인해 주세요");  history.back();</script>` );}
    var rightpassword=scott.password;
    if(rightpassword=== pwd){
      req.session.displayName = scott.displayName;
    return req.session.save(function(){
       global.sessionid = scott.username;
       global.sessionpwd = scott.password;
      global.sessionnick = scott.displayName;
       res.redirect('main');});
    }else{
        res.send(`<script>alert("password를 확인해 주세요");  history.back();</script>`);
    }

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
       global.sessionpwd = password;
       global.sessionnick = displayName
       console.log(doc)
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
//test
app.use('/upload', express.static('uploads'));
//test
app.get('/test', function(req, res){
  User.findOne({ username: 'skekf123@naver.com' }, function(err, scott) {
    if (scott===null) { return res.send('id를 확인해 주세요'); }
    var rightpassword=scott.password;
    if(rightpassword==='qkdnf22@@'){
      res.send('환영합니다.'+ scott.displayName + '님');

      db.collection('users').updateOne(
  { username: global.sessionid },
  { $set: { uploadfile: req.file.filename },
    $currentDate: { lastModified: false } })
.then(function(result) {

})

    }else{
        res.send('password를 확인해 주세요.');
    }

  });

});

//포트설정
http.listen(3003, function(){
  console.log('연결완료!');
});
