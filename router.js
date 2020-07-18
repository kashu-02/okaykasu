'use strict';
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const line = require("@line/bot-sdk");
const test_config = {
  channelAccessToken: process.env.TEST_ACCESS_TOKEN,
  channelSecret: process.env.TEST_SECRET_KEY
}; 
const client = new line.Client(test_config);
const lineBot = require('./linebot/linebot.js');
const router = require('./routes/v1/');
var bodyParser = require('body-parser');

express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .use('/api/v1/', router)
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  .post("/hook/", line.middleware(test_config), (req, res) => lineBot.lineBot(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))