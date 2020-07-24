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
    timezone: 'Asia/Tokyo' 
  });
const Op = Sequelize.Op;
const LineBotDB = sequelize.define('LineBot', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bot_destination: {
    type: Sequelize.STRING
  },
  events_type: {
    type: Sequelize.STRING
  },
  message_timestamp: {
    type: Sequelize.DATE
  },
  source_type: {
    type: Sequelize.STRING
  },
  source_userId: {
    type: Sequelize.STRING
  },
  source_groupId: {
    type: Sequelize.STRING
  },
  message_type: {
    type: Sequelize.STRING
  },
  message_content: {
    type: Sequelize.STRING
  }
});

LineBotDB.sync();
module.exports = LineBotDB;