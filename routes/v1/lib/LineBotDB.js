'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: true,
    operatorsAliases: false 
  });
const Op = Sequelize.Op;
const LineBotDB = sequelize.define('LineBot', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  events_type: {
    type: Sequelize.STRING
  },
  message_timestamp: {
    type: Sequelize.INTEGER  
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