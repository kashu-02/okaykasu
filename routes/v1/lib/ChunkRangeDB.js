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
const ChunkRangeDB = sequelize.define('chunk_ranges', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.DATE
  },
  chunkrange: {
    type: Sequelize.STRING
  }});

ChunkRangeDB.sync();
module.exports = ChunkRangeDB;