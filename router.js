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
const indexRouter = require('./routes/webjs/index');
const bunkeiRouter = require('./routes/webjs/bunkei');
const AllChunkRanges = require('./routes/webjs/allchunkranges')
const AllNextRanges = require('./routes/webjs/allnextranges')
// セッションを使用
const session = require('express-session');

app.use(helmet())
app.post("/test_hook/", line.middleware(test_config), (req, res) => test_lineBot.test_lineBot(req, res))
app.post("/rikei_hook/", line.middleware(rikei_config), (req, res) => rikei_lineBot.rikei_lineBot(req, res))
app.post("/bunkei_hook/", line.middleware(bunkei_config), (req, res) => bunkei_lineBot.bunkei_lineBot(req, res))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));
app.use('/api/v1/', apirouter);
app.use(session({
  　　secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false 
  }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
      done(null, user);
});
passport.deserializeUser(function (user, done) {
     done(null, user);
});
app.use('/auth', googleauth);
//app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use('/',indexRouter);
app.use('/bunkei',bunkeiRouter);
app.use('/allchunkranges',AllChunkRanges);
app.use('/allnextranges',AllNextRanges);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

  