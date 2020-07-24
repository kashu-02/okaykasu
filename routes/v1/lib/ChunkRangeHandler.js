'use strict';
const ChunkRangeDB = require('./ChunkRangeDB.js');
const express = require('express');
const router = express.Router();

/**
 * CREATE
 */
router.post('/',function(req,res){
  console.log(req.body);
ChunkRangeDB.create({
  date:req.body.Date,
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
      offset: 1,
      limit: 1
    }).then(chunkrange => {
      res.json(chunkrange.rows);
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
  ChunkRangeDB.update({
    chunkrange:req.body.Range
  },
  { 
    where: {
      date:req.body.Date
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
  ChunkRangeDB.destroy({
    where: {
      date:req.body.Date
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