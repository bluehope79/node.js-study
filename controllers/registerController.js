var User = require('../models/user');
var session = require('express-session');

var registerGet = function(req, res){
  res.render('register');
}


var registerPost = function(req, res){
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
};

module.exports = {
  registerGet: registerGet,
  registerPost: registerPost

};
