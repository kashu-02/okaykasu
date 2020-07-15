'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false,
    operatorsAliases: false 
  });
const ChunkRange = sequelize.define('chunk_range', {
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

ChunkRange.sync();
module.exports = ChunkRange;