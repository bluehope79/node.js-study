//파일 업로드
var User = require('../models/user');
var session = require('express-session');
var mongoose    = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var multer = require('multer');

//////////////////////////////////////////////////////////////////////////////////////config
var _storage = multer.diskStorage({   //  //멀터 storage사용을 위한 설정
  destination: function (req, file, cb) { //사용자가 제출한 파일을 어디에 저장?
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {  //저장할 파일명을 어떻게 할것인가?
    cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage}) //몽구스 및 connect-mongo 사용
//////////////////////////////////////////////////////////////////////////////////////config
var db = mongoose.connection;   //db 사용을 위한 설정
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("db에 연결되었습니다.");
});
mongoose.connect('mongodb://localhost/login');
///////////////////////////////////////////////////////////////////////////////////////config

var uploadGet = function(req, res){
  //전역변수인 회원 id(sessionid)를 통해 user db에 uploadfile(회원이 저장한 파일 명)을 보여줌
  User.findOne({ username: global.sessionid }, function(err, scott) {
    console.log(global.sessionid);
  res.render('upload',{sessionnick:scott.displayName, sessionfile:scott.uploadfile,name:null,destination:'uploads/', id:global.sessionid});
});
}

var uploadPost = function(req, res){ //미들웨어 req파일안에 userfile은 업로드 디렉토리의 폼 네임
  if(req.file!=null){
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
}else{ return res.send(`<script>alert("파일을 선택해 주세요");  history.back();</script>` );}
};

module.exports = {
  uploadPost: uploadPost,
  uploadGet: uploadGet,
  upload: upload
};
