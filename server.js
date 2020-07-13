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

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/g/", (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post("/p/", (req, res) => res.json({ method: "こんにちは、postさん" }))
  .post("/hook/", line.middleware(test_config), (req, res) => lineBot(req, res)) 
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

  function lineBot(req, res) {
    res.status(200).end(); //200番をレスポンスとして返しておく
    const events = req.body.events;
    console.log(`linebot内のevents`)
    console.log(events);  // console.log(`eventsは${events}、と${req.body.events}`); \\この書き方だと中身の配列が見えなかった。
    const promises = [];
   
    for (let i = 0, l = events.length; i < l; i++) {
      const ev = events[i];
      console.log(`${i}番目のイベントの中身は`);
      console.log(events[i]);
      console.log(`ev.typeは`);
      console.log(ev.type);
   
      switch (ev.type) {
        case "join":
          promises.push( //promisesにechoman(ev)の処理を配列として入れるメソッドぽい。
            greeting_join(ev) //return の内容が、Promise のthenのコールバック関数に渡る.ここではpromise.push()
          );
   
        case "follow":
          promises.push(
            greeting_follow(ev) 
          );
   
        case "message":
          promises.push(
            echoman(ev)
          );
      } 
    }
    Promise.all(promises).then(console.log("pass")); 
   }
   
   async function echoman(ev) {
    const pro =  await client.getProfile(ev.source.userId); //awaitがあるので、この処理を待ってから次の行にいく。
    return client.replyMessage(ev.replyToken, {
      type: "text",
      text: `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
    })
   }
   
   async function greeting_follow(ev) {
    const pro =  await client.getProfile(ev.source.userId);
    return client.replyMessage(ev.replyToken, [
      {
      type: "text",
      text: `${pro.displayName}さん、こんにちは。調整くんです。\\n${pro.displayName}さんの代わりに、ぼくがスケジュール調整をするよ。`
      },
      {
        type: "text",
        text: `このリンクから依頼してね。`
      },  
      {
        type: "text",
        text: "https://scheduler-linebot.herokuapp.com/"
      }
    ])
   }
   
   async function greeting_join(ev) {
    return client.replyMessage(ev.replyToken, [
      {
      type: "text",
      text: `みなさん、こんにちは。調整くんです。みんなの代わりに、ぼくがスケジュール調整をするよ。`
      },
      {
        type: "text",
        text: `このリンクから依頼してね。`
      },  
      {
        type: "text",
        text: "https://scheduler-linebot.herokuapp.com/"
      }
    ])
   }