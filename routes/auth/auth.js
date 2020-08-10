// Googleログイン認証設定
const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// セッションを使用
const session = require('express-session');

app.use(session({
　　secret: 'secret',
　　resave: false,
　　saveUninitialized: true
}));

app.use(passport.session());

passport.serializeUser(function (user, done) {
      done(null, user);
});

passport.deserializeUser(function (user, done) {
     done(null, user);
});

//Googleログイン認証
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLECLIENTID,
        clientSecret: process.env.GOOGLECLIENTSECRET,
        callbackURL: '/auth/google/callback'
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
router.get('/auth/google', passport.authenticate('google', {
      scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
      ]
}));


//Googleログインコールバック
router.get('/auth/google/callback',
      passport.authenticate('google',
     {
          failureRedirect: '/login', // 失敗したときの遷移先
     }),
     function (req, res) {
         //emailの値を表示
         console.log(req.user.emails[0].value);
     }
);

module.exports = router;