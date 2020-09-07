'use strict';
const express = require('express');
const router = express.Router();
const ChunkRangeDB = require('../v1/lib/ChunkRangeDB');
const NextStageRangeDB = require('../v1/lib/NextStageRangeDB');

/* GET home page. */
router.get('/', (req, res, next) => {
  ChunkRangeDB.findAll({
    attributes: ['date', 'chunkrange'],
    order: [
      ['date', 'ASC']
    ]
  }).then(function(results){
    console.log(JSON.stringify(results));
     // res.render('allchunkranges', { 
        
    //});
  });
});

module.exports = router;