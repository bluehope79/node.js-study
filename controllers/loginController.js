var User = require('../models/user');

//첫 login 페이지
var loginGet = function(req, res){
  res.render('login');
}

var loginPost = function(req, res){
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
};

module.exports = {
  loginPost: loginPost,
  loginGet: loginGet
};
