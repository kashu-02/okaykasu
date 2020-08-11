/**
 * チャンク範囲DB処理
 */

'use strict';
const ChunkRangeDB = require('./ChunkRangeDB.js');
const express = require('express');
const moment = require('moment');//時間操作ライブラリ
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');//タイムゾーン設定
const router = express.Router();

/**
 * CREATE
 * 
 * URL : https://okaykasu.herokuapp.com/api/v1/ChunkRange
 * Authorization: required
 * METHOD: POST
 * RequestBody: Date {String} YYYY-MM-DD チャンクの日付　(required)
 *              Range {String} チャンク範囲　(required)
 * RequestBodyErrorHandling:
 *              DateまたはRangeが不正の場合、HTTPステータスコード400，JSONで{ error: 'Invalid request body' }。
 * Return: 200 {JSON Array} 登録されているチャンク範囲
 *       ex) [
 *            {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             },
 *            {
 *              date:2020-08-25,
 *              chunkrange: pp.102-117
 *            },
 *                ...
 *           ]
 */
router.post('/',function(req,res){
  console.log(req.body);
  const chunkdate = moment(req.body.Date).format('YYYY-MM-DD');
if(!req.body.Range || !chunkdate || chunkdate === 'Invalid date'){　//リクエストボディのDateまたはRangeが不正のときエラー処理
  res.status(400).json({ error: 'Invalid request body' });//400番HTTPエラー
  return false;
}
ChunkRangeDB.create({
  date:chunkdate,
  chunkrange:req.body.Range
}).then(() => {
  ChunkRangeDB.findAll({
    attributes: ['date', 'chunkrange'],
    order: [
      ['date', 'ASC']
    ]
  }).then(chunkrange => {
  res.json(chunkrange);
  });
});
});

/**
 * READ
 * 
 * URL : https://okaykasu.herokuapp.com/api/v1/ChunkRange
 * Authorization: required
 * METHOD: GET
 * RequestQuery: latestchunk　{Boolean} 最新の1件を表示　(Optional)
 *               chunkdate {String} YYYY-MM-DDで指定された日時のチャンク範囲を表示 (Optional)
 * Return: 200 {JSON Array} 登録されているチャンク範囲
 *       ex) [
 *            {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             },
 *            {
 *              date:2020-08-25,
 *              chunkrange: pp.102-117
 *            },
 *                ...
 *           ]
 *         latestchunkまたはhunkdate指定がある場合
 * 　　　　200　{JSON} 
 *       ex) {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             }
 */
router.get('/',function(req,res){
  console.log(`latestchunk ${req.query.latestchunk}`);
  if(req.query.latestchunk){
    ChunkRangeDB.findAndCountAll({
      attributes: ['date', 'chunkrange'],
      order: [
        ['date', 'ASC']
      ],
      offset: 0,
      limit: 1
    }).then(chunkrange => {
      res.json(chunkrange.rows[0]);
    });
  }else if(req.query.chunkdate){
    ChunkRangeDB.findAll({
      attributes: ['date', 'chunkrange'],
      order: [
        ['date', 'ASC']
      ],
      where:{
        date: req.query.chunkdate
      }
    }).then(chunkrange => {
    res.json(chunkrange[0]);
    });
  }else{
    ChunkRangeDB.findAll({
      attributes: ['date', 'chunkrange'],
      order: [
        ['date', 'ASC']
      ]
    }).then(chunkrange => {
    res.json(chunkrange);
    });
  }
    
});

/**
 * UPDATE
 * 
 * URL : https://okaykasu.herokuapp.com/api/v1/ChunkRange
 * Authorization: required
 * METHOD: PUT
 * RequestBody: Date {String} YYYY-MM-DD チャンクの日付　(required)
 *              Range {String} チャンク範囲　(required)
 * RequestBodyErrorHandling:
 *              DateまたはRangeが不正の場合、HTTPステータスコード400，JSONで{ error: 'Invalid request body' }。
 * Return: 200 {JSON Array} 登録されているチャンク範囲
 *       ex) [
 *            {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             },
 *            {
 *              date:2020-08-25,
 *              chunkrange: pp.102-117
 *            },
 *                ...
 *           ]
 */
router.put('/',function(req,res){
  console.log(req.body);
  if(!req.body.Range || !chunkdate || chunkdate === 'Invalid date'){
    res.status(400).json({ error: 'Invalid request body' });
    return false;
  }
  const chunkdate = moment(req.body.Date).format('YYYY-MM-DD');
  ChunkRangeDB.update({
    chunkrange:req.body.Range
  },
  { 
    where: {
      date:chunkdate
    }
  }).then(() => {
    ChunkRangeDB.findAll({
      attributes: ['date', 'chunkrange'],
      order: [
        ['date', 'ASC']
      ]
    }).then(chunkrange => {
    res.json(chunkrange);
    });
  });
});

/**
 * DELETE
 * 
 * URL : https://okaykasu.herokuapp.com/api/v1/ChunkRange
 * Authorization: required
 * METHOD: DELETE
 * RequestBody: Date {String} YYYY-MM-DD チャンクの日付　(required)
 * RequestBodyErrorHandling:
 *              Dateが不正の場合、HTTPステータスコード400，JSONで{ error: 'Invalid request body' }。
 * Return: 200 {JSON Array} 登録されているチャンク範囲
 *       ex) [
 *            {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             },
 *            {
 *              date:2020-08-25,
 *              chunkrange: pp.102-117
 *            },
 *                ...
 *           ]
 */
router.delete('/',function(req,res){
  const chunkdate = moment(req.body.Date).format('YYYY-MM-DD');
  if(!chunkdate || chunkdate === 'Invalid date'){
    res.status(400).json({ error: 'Invalid request body' });
    return false;
  }
  ChunkRangeDB.destroy({
    where: {
      date:chunkdate
    }
  }).then(() => {
    ChunkRangeDB.findAll({
      attributes: ['date', 'chunkrange'],
      order: [
        ['date', 'ASC']
      ]
    }).then(chunkrange => {
    res.json(chunkrange);
    });
  });
});

module.exports = router;