'use strict';
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const line = require("@line/bot-sdk"); 
//const client = new line.Client(config);

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
    res.status(200).end(); //200番をレスポンスとして返しておく
    const events = req.body.events;
    console.log(req.body.destination);
    const promises = [];
   switch(req.body.destination){
     case "U9fbd92ef983647f16311a476520fc987"://test
      var config = {
        channelAccessToken: process.env.TEST_ACCESS_TOKEN,
        channelSecret: process.env.TEST_SECRET_KEY
      };
      var rikeibunkeiflug = 'test';
      break;
   }
   var client = new line.Client(config);
    for (let i = 0, l = events.length; i < l; i++) {
      const ev = events[i];
      console.log(`${i}番目のイベントの中身は`);
      console.log(events[i]);
      console.log(`ev.typeは`);
      console.log(ev.type);
   
      switch (ev.type) {
        case "follow":
          promises.push(
            greeting_follow(ev,rikeibunkeiflug) 
          );
   
//case "unfollow":
  //case"leave":

  case "join":
          //promises.push( //promisesにechoman(ev)の処理を配列として入れるメソッドぽい。
            //greeting_join(ev,rikeibunkeiflug) //return の内容が、Promise のthenのコールバック関数に渡る.ここではpromise.push()
         // );
        case "message":
          promises.push(
            echoman(ev,rikeibunkeiflug)
          );
      } 
    }
    Promise.all(promises).then(console.log("pass")); 
   }
   
   async function echoman(ev,rikeibunkeiflug) {
    const pro =  await client.getProfile(ev.source.userId); //awaitがあるので、この処理を待ってから次の行にいく。
    return client.replyMessage(ev.replyToken, {
      type: "text",
      text: `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
    })
   }
   
   async function greeting_follow(ev,rikeibunkeiflug) {
    const pro =  await client.getProfile(ev.source.userId);
    switch(rikeibunkeiflug){
      case "test":
        var bottype = "テスト"
    }
    return client.replyMessage(ev.replyToken, [
      {
      type: "text",
      text: `${pro.displayName}さん。友だち追加ありがとうございます。/n${bottype}は日々の連絡事項や課題を配信するbotです。`
      },
    ])
   }
   
   async function greeting_join(ev,rikeibunkeiflug) {
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