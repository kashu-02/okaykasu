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
    if(req.user){
    if(req.user.emails[0].value.match(`/${matchdomain}/`)){　//ドメイン認証
    res.render('index', { 
      chunkrange: results[0].rows[0],
      nextstagerange: results[1].rows[0],
      okaykasudata: JSON.parse(results[2][0].okaykasu)　
    });
  }else{
    res.render('index', { 
      chunkrange: results[0].rows[0],
      nextstagerange: results[1].rows[0]
    });
  }
  }else{
    res.render('index', { 
      chunkrange: results[0].rows[0],
      nextstagerange: results[1].rows[0]
    });
  }
  console.log(req.user.emails[0].value);
});
  });

module.exports = router;