'use strict';
const ChunkRangeDB = require('./ChunkRangeDB.js');
const express = require('express');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');
const router = express.Router();

/**
 * CREATE
 */
router.post('/',function(req,res){
  console.log(req.body);
  const chunkdate = moment(req.body.Date).format('YYYY-MM-DD');

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
    res.json(chunkrange);
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
 */
router.put('/',function(req,res){
  console.log(req.body);
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
 */
router.delete('/',function(req,res){
  const chunkdate = moment(req.body.Date).format('YYYY-MM-DD');
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