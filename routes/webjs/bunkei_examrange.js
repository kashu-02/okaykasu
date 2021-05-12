'use strict';
const express = require('express');
const router = express.Router();
//const { noExtendLeft } = require('sequelize/types/lib/operators');

/* GET home page. */
router.get('/', (req, res, next) => {
    /* 削除
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
    attributes: ['okaykasu'],
    order: [
      ['id', 'ASC']
    ]
  })]
).then(function(results){
*/
    if(req.user){
    if(req.user.emails[0].value.match(/@urawareimei.ed.jp/)){　//ドメイン認証
      res.render('bunkei_examrange', { 
        isLogined: 'Logined'
    });
    }else{
      res.render('bunkei_examrange', {
      });
    }
    }else{
      res.render('bunkei_examrange', { 
      });
    }
  });


module.exports = router;
