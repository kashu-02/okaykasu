/*
const express = require('express');
const line = require('@line/bot-sdk');

const SECRET_KEY = process.env.TEST_SECRET_KEY;
const ACCESS_TOKEN = process.env.TEST_SECRET_KEY;
const config = {
  channelAccessToken: ACCESS_TOKEN,
  channelSecret: SECRET_KEY
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(3000);
*/

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const line = require("@line/bot-sdk"); 
const config = {
  channelAccessToken: process.env.TEST_ACCESS_TOKEN,
  channelSecret: process.env.TEST_SECRET_KEY
};

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  .post("/hook/", line.middleware(config), (req, res) => lineBot(req, res)) 
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function lineBot(req, res) {
  res.json({ test: "hook" });
  console.log("pass"); 
}