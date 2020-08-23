'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false,
    operatorsAliases: false,
    dialectOptions: {
      useUTC: false,
    },
    timezone: '+09:00'
  });
const NextStageRangeDB = sequelize.define('nextstage_ranges', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.STRING
  },
  nextstagerange: {
    type: Sequelize.STRING
  }});

NextStageRangeDB.sync();
module.exports = NextStageRangeDB;
