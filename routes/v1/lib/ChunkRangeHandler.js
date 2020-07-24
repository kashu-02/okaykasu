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
  res.json(JSON.stringify(chunkrange));
  });
});
});

/**
 * READ
 */
router.get('/',function(req,res){
    console.log(`chunkrange:${chunkrange[0]}`); 
    ChunkRangeDB.findAll({
      attributes: ['date', 'chunkrange'],
      order: [
        ['date', 'ASC']
      ]
    }).then(chunkrange => {
    res.json(JSON.stringify(chunkrange));
    });
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
    res.json(JSON.stringify(chunkrange));
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
    res.json(JSON.stringify(chunkrange));
    });
  });
});

module.exports = router;