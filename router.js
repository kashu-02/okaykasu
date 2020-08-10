'use strict';
const express = require('express')
const app = express();
const path = require('path')
const helmet = require('helmet');
const PORT = process.env.PORT || 5000;
const line = require("@line/bot-sdk");
const test_config = {
  channelAccessToken: process.env.TEST_ACCESS_TOKEN,
  channelSecret: process.env.TEST_SECRET_KEY
}; 
const rikei_config = {
  channelAccessToken: process.env.RIKEI_ACCESS_TOKEN,
  channelSecret: process.env.RIKEI_SECRET_KEY
}; 
const bunkei_config = {
  channelAccessToken: process.env.BUNKEI_ACCESS_TOKEN,
  channelSecret: process.env.BUNKEI_SECRET_KEY
}; 
const test_lineBot = require('./linebot/test_linebot.js');
const rikei_lineBot = require('./linebot/rikei_linebot.js');
const bunkei_lineBot = require('./linebot/bunkei_linebot.js');
const apirouter = require('./routes/v1/');
const bodyParser = require('body-parser');
const passport = require('passport');
const googleauth = require('./routes/auth/auth.js');

// セッションを使用
const session = require('express-session');
/*
app.use(session({
　　secret: 'okaykasusecretsecret'
}));
app.use(passport.session());
*/
passport.serializeUser(function (user, done) {
      done(null, user);
});

passport.deserializeUser(function (user, done) {
     done(null, user);
});


express()
  .use(helmet())
  .post("/test_hook/", line.middleware(test_config), (req, res) => test_lineBot.test_lineBot(req, res))
  .post("/rikei_hook/", line.middleware(rikei_config), (req, res) => rikei_lineBot.rikei_lineBot(req, res))
  .post("/bunkei_hook/", line.middleware(bunkei_config), (req, res) => bunkei_lineBot.bunkei_lineBot(req, res))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  //.use(cookieParser())
  .use(express.static(path.join(__dirname, "public")))
  .use(passport.initialize())
  .use('/api/v1/', apirouter)
  .use('/auth', googleauth)
  //.set("views", path.join(__dirname, "views"))
  .set('view engine', 'pug')
  .get("/",isAuthenticated, (req, res) => res.render("index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

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