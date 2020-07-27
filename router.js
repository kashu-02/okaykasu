'use strict';
const express = require('express')
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
const router = require('./routes/v1/');
const bodyParser = require('body-parser');

express()
  .use(helmet())
  .post("/test_hook/", line.middleware(test_config), (req, res) => test_lineBot.test_lineBot(req, res))
  .post("/rikei_hook/", line.middleware(rikei_config), (req, res) => rikei_lineBot.rikei_lineBot(req, res))
  .post("/bunkei_hook/", line.middleware(bunkei_config), (req, res) => bunkei_lineBot.bunkei_lineBot(req, res))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, "public")))
  .use('/api/v1/', router)
  .set("views", path.join(__dirname, "views"))
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" })) 
  .listen(PORT, () => console.log(`Listening on ${PORT}`))