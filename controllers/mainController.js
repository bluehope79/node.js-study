var main = function(req, res){  //->로그인 뒤 기능을 이용할 수 있는 메인 페이지
  if(req.session.displayName){  //세션을 가지고 있다면
      res.render('main',{sessionnick:req.session.displayName});  //main page로 라우팅 및 닉네임 변수 저장
  } else{
   res.redirect('/'); //세션을 가지고 있지 않다면 시작 페이지로
  }
};

module.exports = {
  main: main

};
