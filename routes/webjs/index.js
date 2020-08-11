'use strict';
const express = require('express');
const router = express.Router();
const ChunkRangeDB = require('../v1/lib/ChunkRangeDB');
const NextStageRangeDB = require('../v1/lib/NextStageRangeDB');
const OkaykasuDB = require('../v1/lib/OkaykasuDB');

/* GET home page. */
router.get('/', (req, res, next) => {
  Promise.all([ChunkRangeDB.findAndCountAll({
    attributes: ['date', 'chunkrange'],
    order: [
      ['date', 'ASC']
    ],
    offset: 0,
    limit: 1
  }),NextStageRangeDB.findAndCountAll({
    attributes: ['date', 'nextstagerange'],
    order: [
      ['date', 'ASC']
    ],
    offset: 0,
    limit: 1
  }),OkaykasuDB.findAll({
    attributes: ['id', 'okaykasu'],
    order: [
      ['id', 'ASC']
    ]
  })]).then(function(results){
    res.json(results);
});
    //res.render('index', { title: title　});
  });

module.exports = router;