// Googleログイン認証設定
const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


//Googleログイン認証
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLECLIENTID,
        clientSecret: process.env.GOOGLECLIENTSECRET,
        callbackURL: 'https://okaykasu.herokuapp.com/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        if (profile) {
             return done(null, profile);
        }
        else {
             return done(null, false);
        }
     }
));


//Googleログイン認証（スコープ設定）へ
router.get('/google', passport.authenticate('google', {
      scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
      ]
}));


//Googleログインコールバック
router.get('/google/callback',
      passport.authenticate('google',
     {
          failureRedirect: '/login', // 失敗したときの遷移先
     }),
     function (req, res) {
         //emailの値を表示
         console.log(req.user.emails[0].value);
         if(req.user.emails[0].value.match(/@urawareimei.ed.jp/)){
            res.redirect('/');
         }else{
            req.logout();
            res.redirect('/');
         }
         
     }
);

module.exports = router;