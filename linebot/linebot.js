'use strict';
const line = require("@line/bot-sdk");
const LineBotDB = require('../routes/v1/lib/LineBotDBHandler.js');
const ChunkRangeDB = require('../routes/v1/lib/ChunkRangeDB.js');
const NextStageRangeDB = require('../routes/v1/lib/NextStageRangeDB.js');
const test_config = {
    channelAccessToken: process.env.TEST_ACCESS_TOKEN,
    channelSecret: process.env.TEST_SECRET_KEY
  }; 
  const client = new line.Client(test_config);
  const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.lang('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});

exports.lineBot = function (req, res) {
    res.status(200).end(); //200番をレスポンスとして返しておく
    const events = req.body.events;
    console.log(`linebot内のevents`);
    console.log(events);  // console.log(`eventsは${events}、と${req.body.events}`); \\この書き方だと中身の配列が見えなかった。
    const promises = [];
   const destination = req.body.destination
   console.log(`LINEBOTdestination: ${destination}`);
    for (let i = 0, l = events.length; i < l; i++) {
      const ev = events[i];
      console.log(`${i}番目のイベントの中身は`);
      console.log(events[i]);
      console.log(`ev.typeは`);
      console.log(ev.type);
      LineBotDB.linebotcreate(ev,destination);//DB書き込み
      switch (ev.type) {
        case "join":
          promises.push( //promisesにechoman(ev)の処理を配列として入れるメソッドぽい。
            join(ev) //return の内容が、Promise のthenのコールバック関数に渡る.ここではpromise.push()
          );
        case "leave":
          promises.push(
            leave(ev) 
          );
        case "follow":
          promises.push(
            follow(ev) 
          );
        case "unfollow":
          promises.push(
            unfollow(ev) 
          );
        case "message":
          promises.push(
            replyline(ev)
          );
      } 
    }
    Promise.all(promises).then(console.log("pass")); 
   }
   
   async function replyline(ev) {
    const pro =  await client.getProfile(ev.source.userId);
    switch(ev.message.text){
      case "おk粕":

      break;
      case "チャンク":
        ChunkRangeDB.findAndCountAll({
          attributes: ['date', 'chunkrange'],
          order: [
            ['date', 'ASC']
          ],
          offset: 0,
          limit: 1
        }).then(chunkrange => {
          const chunkday = moment(chunkrange.rows[0].date).format('DD日(dd)');
          return client.replyMessage(ev.replyToken, {
            type: "flex",
            altText: "This is a Flex Message",
            contents: {
              type: "bubble",
              size: "kilo",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: chunkday,
                    color: "#FFFFFF"
                  }
                ],
                backgroundColor: "#008000"
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: chunkrange.rows[0].chunkrange
                  }
                ]
              }
            }
          })
        });
      break;
      case "ネクステ":
        NextStageRangeDB.findAndCountAll({
          attributes: ['date', 'nextstagerange'],
          order: [
            ['date', 'ASC']
          ],
          offset: 0,
          limit: 1
        }).then(nextstagerange => {
          console.log("NextStageRange" + JSON.stringify(nextstagerange));
          const nextstageday = moment(nextstagerange.rows[0].date).format('DD日(dd)');
          return client.replyMessage(ev.replyToken, {
            type: "flex",
            altText: "This is a Flex Message",
            contents: {
              type: "bubble",
              size: "kilo",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: nextstageday,
                    color: "#FFFFFF"
                  }
                ],
                backgroundColor: "#FFA500"
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: nextstagerange.rows[0].nextstagerange
                  }
                ]
              }
            }
          })
        });
      break;
    }
   }
   
   async function follow(ev) {
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
   
   async function join(ev) {
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

 