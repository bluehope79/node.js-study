
var logout = function(req, res){
  delete req.session.displayName;  //->session 삭제
  global.sessionid = null;
  global.sessionpwd = null;   // -> 저장되있던 전역 변수들도 null값으로 바꿈
  global.sessionnick = null;
  req.session.save(function(){
    res.redirect('/');  //시작페이지로 이동
  });
};

module.exports = {
  logout: logout

};
