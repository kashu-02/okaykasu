'use strict';
const express = require('express');
const router = express.Router();
const ChunkRangeDB = require('../v1/lib/ChunkRangeDB');
const NextStageRangeDB = require('../v1/lib/NextStageRangeDB');

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
  })]).then(function(results){
      res.render('bunkei', { 
        chunkrange: results[0].rows[0],
        nextstagerange: results[1].rows[0]
    });
  });
});

module.exports = router;