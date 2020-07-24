'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: true,
    operatorsAliases: false,
    timezone: 'Asia/Tokyo'
  });
const OkaykasuDB = sequelize.define('okaykasudata', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  okaykasu: {
    type: Sequelize.TEXT
  }});

OkaykasuDB.sync();
module.exports = OkaykasuDB;