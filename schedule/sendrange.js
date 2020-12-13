'use strict';
const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});
const line = require("@line/bot-sdk");
/*
const bunkei_config = {
  channelAccessToken: process.env.BUNKEI_ACCESS_TOKEN,
  channelSecret: process.env.BUNKEI_SECRET_KEY
}; 
*/
const bunkei_config = {
  channelAccessToken: process.env.TEST_ACCESS_TOKEN,
  channelSecret: process.env.TEST_SECRET_KEY
}; 
const client = new line.Client(bunkei_config);
const ChunkRangeDB = require('../routes/v1/lib/ChunkRangeDB.js');
const NextStageRangeDB = require('../routes/v1/lib/NextStageRangeDB.js');

SendChunkRange();
SendNeststageRange();


function SendChunkRange(){
    const judgeday = moment().add(1, 'days');
    console.log(judgeday)
    ChunkRangeDB.findAndCountAll({
        attributes: ['date', 'chunkrange'],
        order: [
          ['date', 'ASC']
        ],
        offset: 0,
        limit: 1
      }).then(chunkrange => {
          console.log(chunkrange.rows[0].date);
        const chunkday = moment(chunkrange.rows[0].date);
        if(chunkday.isSame(judgeday)){
          return client.broadcast({
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
                backgroundColor: "#0000FF"
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
        }else{
          return;
        };
      });
};


function SendNeststageRange(){
  const judgeday = moment().add(1, 'days');
  console.log(judgeday)
  NextStageRangeDB.findAndCountAll({
    attributes: ['date', 'nextstagerange'],
    order: [
      ['date', 'ASC']
    ],
    offset: 0,
    limit: 1
  }).then(nextstagerange => {
        console.log(nextstagerange.rows[0].date);
      const nextstageday = moment(nextstagerange.rows[0].date);
      if(nextstageday.isSame(judgeday)){
        return client.broadcast({
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
      }else{
        return;
      };
    });
};