/**
 * チャンク範囲データベース設定
 */


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
const ChunkRangeDB = sequelize.define('chunk_ranges', {
  id: {// id
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {　//チャンク日時　YYYY-MM-DD　String
    type: Sequelize.STRING
  },
  chunkrange: {// チャンク範囲　String
    type: Sequelize.STRING
  }});

ChunkRangeDB.sync();
module.exports = ChunkRangeDB;
