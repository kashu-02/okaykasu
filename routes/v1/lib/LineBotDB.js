/**
 * LINEBotDB設定
 */
'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: true,
    operatorsAliases: false,
    dialectOptions: {
      useUTC: false,
    },
    timezone: '+09:00' 
  });
const Op = Sequelize.Op;
const LineBotDB = sequelize.define('LineBot', {
  id: {//Id
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bot_destination: {//受信すべきボットのUserId　{String}
    type: Sequelize.STRING
  },
  events_type: {//イベントのタイプ　ex)message,follow,unfollow
    type: Sequelize.STRING
  },
  message_timestamp: {//メッセージが送信された時刻　YYYY-MM-DD hh:mm:ss
    type: Sequelize.STRING
  },
  source_type: {//送信元のトークルームタイプ　ex)user,group,room
    type: Sequelize.STRING
  },
  source_userId: {//送信元のUserId
    type: Sequelize.STRING
  },
  source_groupId: {//送信元のGroupId　なければNULL
    type: Sequelize.STRING
  },
  source_username: {//送信元のユーザー名　取得できなければCouldn't get displayName
    type: Sequelize.STRING
  },
  message_type: {//メッセージの種類　ex)text,image
    type: Sequelize.STRING
  },
  message_content: {//メッセージの本文　textのみ対応
    type: Sequelize.STRING
  }
});

LineBotDB.sync();
module.exports = LineBotDB;