'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false,
    operatorsAliases: false,
    dialectOptions: {
      useUTC: false,
      ssl: {
         require: true,
         rejectUnauthorized: false
    }
    },
    timezone: '+09:00' 
  });
const Op = Sequelize.Op;
const LineFriendDB = sequelize.define('LineFriend', {
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

LineFriendDB.sync();
module.exports = LineFriendDB;
