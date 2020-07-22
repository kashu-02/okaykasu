'use strict';
const NextStageRangeDB = require('./NextStageRangeDB.js');
const express = require('express');
const router = express.Router();

/**
 * CREATE
 */
router.post('/',function(req,res){
  console.log(req.body);
NextStageRangeDB.create({
  date:req.body.Date,
  nextstagerange:req.body.Range
}).then(() => {
  NextStageRangeDB.findAll({
    attributes: ['date', 'nextstagerange']
  }).then(nextstagerange => {
  res.json(JSON.stringify(nextstagerange));
  });
});
});

/**
 * READ
 */
router.get('/',function(req,res){
  NextStageRangeDB.findAll({ limit: 1 }).then(nextstagerange => {
    console.log(`nextstagerange:${nextstagerange[0]}`); 
    NextStageRangeDB.findAll({
      attributes: ['date', 'nextstagerange']
    }).then(nextstagerange => {
    res.json(JSON.stringify(nextstagerange));
    });
  });
});

/**
 * UPDATE
 */
router.put('/',function(req,res){
  console.log(req.body);
  NextStageRangeDB.update({
    nextstagerange:req.body.Range
  },
  { 
    where: {
      date:req.body.Date
    }
  }).then(() => {
    NextStageRangeDB.findAll({
      attributes: ['date', 'nextstagerange']
    }).then(nextstagerange => {
    res.json(JSON.stringify(nextstagerange));
    });
  });
});

/**
 * DELETE
 */
router.delete('/',function(req,res){
  NextStageRangeDB.destroy({
    where: {
      date:req.body.Date
    }
  }).then(() => {
    NextStageRangeDB.findAll({
      attributes: ['date', 'nextstagerange']
    }).then(nextstagerange => {
    res.json(JSON.stringify(nextstagerange));
    });
  });
});

module.exports = router;