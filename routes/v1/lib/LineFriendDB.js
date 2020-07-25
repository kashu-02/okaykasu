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
const LineBotDB = sequelize.define('LineFriend', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  friend_bottype: {
    type: Sequelize.STRING
  },
  friend_talktype: {
    type: Sequelize.STRING
  },
  displayname: {
    type: Sequelize.STRING
  },
  userorgroupID: {
    type: Sequelize.STRING
  }
});

LineFriend.sync();
module.exports = LineFriend;