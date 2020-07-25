'use strict';
const line = require("@line/bot-sdk");
const LineBotDB = require('../routes/v1/lib/LineBotDBHandler.js');
const LineFriend = require('../routes/v1/lib/LineFriendHandler.js')
const ChunkRangeDB = require('../routes/v1/lib/ChunkRangeDB.js');
const NextStageRangeDB = require('../routes/v1/lib/NextStageRangeDB.js');
const OkaykasuDB = require('../routes/v1/lib/OkaykasuDB.js');
const bunkei_config = {
    channelAccessToken: process.env.BUNKEI_ACCESS_TOKEN,
    channelSecret: process.env.BUNKEI_SECRET_KEY
  }; 
  const client = new line.Client(bunkei_config);
  const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});

exports.bunkei_lineBot = function (req, res) {
    res.status(200).end(); //200番をレスポンスとして返しておく
    const events = req.body.events;
    console.log(`linebot内のevents`);
    console.log(events); 
    const promises = [];
   const destination = req.body.destination
   console.log(`LINEBOTdestination: ${destination}`);
    for (let i = 0, l = events.length; i < l; i++) {
      const ev = events[i];
      console.log(`${i}番目のイベントの中身は`);
      console.log(events[i]);
      console.log(`ev.typeは`);
      console.log(ev.type);
      switch (ev.type) {
        case "join":
          promises.push( 
            join(ev,destination)
          );
          break;
        case "leave":
          promises.push(
            leave(ev,destination) 
          );
          break;
        case "follow":
          promises.push(
            follow(ev,destination) 
          );
          break;
        case "unfollow":
          promises.push(
            unfollow(ev,destination) 
          );
          break;
        case "message":
          promises.push(
            replyline(ev,destination)
          );
          break;
      } 
    }
    Promise.all(promises).then(console.log("pass")); 
   }
   
   async function replyline(ev,destination) {
    const pro =  await (await client.getProfile(ev.source.userId)).displayName;
    LineFriend.linefriendupdate(ev,destination,pro);//友だちDB書き込み
    LineBotDB.linebotcreate(ev,destination,pro);//DB書き込み
    switch(ev.message.text){
      case 'ちゃんく':
      case 'チャンク':
      case 'おk粕　チャンク':
      case 'おk粕 チャンク': 
      case 'おけかす　チャンク':
      case 'チ':
      case 'ち':
      case 'お':
        ChunkRangeDB.findAndCountAll({
          attributes: ['date', 'chunkrange'],
          order: [
            ['date', 'ASC']
          ],
          offset: 0,
          limit: 1
        }).then(chunkrange => {
          const chunkday = moment(chunkrange.rows[0].date).format('DD日(ddd)');
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
      case 'ネクステ':
      case 'ネ':
      case 'ね':
        NextStageRangeDB.findAndCountAll({
          attributes: ['date', 'nextstagerange'],
          order: [
            ['date', 'ASC']
          ],
          offset: 0,
          limit: 1
        }).then(nextstagerange => {
          console.log("NextStageRange" + JSON.stringify(nextstagerange));
          const nextstageday = moment(nextstagerange.rows[0].date).format('DD日(ddd)');
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
      case "おk粕 bye":
      case "おk粕　bye":
      case "おｋ粕 bye":
      case "おｋ粕　bye":
      case "おk粕bye":
      case "おｋ粕bye":
        LineFriend.linefrienddelete(ev,destination,pro);//友だちDB書き込み
        if(ev.source.type === "group"){
          client.replyMessage(ev.replyToken, {
            type: 'text',
            text: 'バイバイ…'
          }).then(() => {
            client.leaveGroup(ev.source.groupId).then(() => {})
          })
        }else if(ev.source.type === "room"){
          client.replyMessage(ev.replyToken, {
            type: 'text',
            text: 'バイバイ…'
          }).then(() => {
            client.leaveRoom(ev.source.roomId).then(() => {})
          })
        }else if(ev.source.type === "user"){
          client.replyMessage(ev.replyToken, {
            type: 'text',
            text: 'グループ、複数人トークルーム以外ではBOTは退出できません。'
          }).then(() => {})
        }
      break;
    }
   }
   
   async function follow(ev,destination) {
    const pro =  await (await client.getProfile(ev.source.userId)).displayName;
    LineFriend.linefriendcreate(ev,destination,pro);//友だちDB書き込み
    return client.replyMessage(ev.replyToken, [
      {
      type: "text",
      text: `${pro}さん、友だち追加ありがとうございます！\n\nおk粕は日々の連絡事項や課題を配信するbotです。\n\n主な機能は、下のメニューから送信でき、\n\n「チャンク」=チャンクの範囲を取得\n\nといった感じです。`
      },
      {
        type: "text",
        text: `なお、LINEだけでなく、Webブラウザからも閲覧できます。LINEが入っていない端末やiPadで使えます。\nWEBブラウザから閲覧するには生徒であることを確認するため、麗明のGoogleアカウントでのログインが必要となります。`
      },  
      {
        type: "text",
        text: "https://okaykasu.herokuapp.com/"
      }
    ])
   }
   
   async function unfollow(ev,destination){
    LineFriend.linefrienddelete(ev,destination);//友だちDB書き込み
   }

   async function join(ev,destination) {
     const GrouporRoomId = ev.source.groupId || ev.source.roomId
     if(ev.source.type === 'room'){
       var pro = null;
     }else{
      var pro =  await (await client.getGroupSummary(GrouporRoomId)).groupName;
      console.log(pro);
     }
    LineFriend.linefriendcreate(ev,destination,pro);//友だちDB書き込み
    return;
   }

   async function leave(ev,destination){
    LineFriend.linefrienddelete(ev,destination);//友だちDB書き込み
   }

 