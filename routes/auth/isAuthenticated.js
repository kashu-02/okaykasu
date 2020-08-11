'use strict';
function isAuthenticated(req, res, next){
  if (req.isAuthenticated()) {  // 認証済
    console.log(`isAuth${req.isAuthenticated()}`);
      return next();
  }
  else {  // 認証されていない
    console.log(`isAuth${req.isAuthenticated()}`);
      res.redirect('/auth/google');  // ログイン画面に遷移
  }
}

module.exports = isAuthenticated;