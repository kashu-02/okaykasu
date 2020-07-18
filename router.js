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
const ChunkRange = require('./linebot/lib/ChunkRangeHandler.js');


express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  .get("/GetChunkRange/", (req, res) => res.json(JSON.stringify(ChunkRange.GetChunkRange())))
  //.post("/POSTChunkRange/",(req,res) => )
  .post("/hook/", line.middleware(test_config), (req, res) => lineBot.lineBot(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))