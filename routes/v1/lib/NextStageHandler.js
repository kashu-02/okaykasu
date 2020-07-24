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
    attributes: ['date', 'nextstagerange'],
    order: [
        ['date', 'ASC']
      ]
  }).then(nextstagerange => {
  res.json(nextstagerange);
  });
});
});

/**
 * READ
 */
router.get('/',function(req,res){
    if(req.query.latestnextstage){
      NextStageRangeDB.findAndCountAll({
        attributes: ['date', 'nextstagerange'],
        order: [
          ['date', 'ASC']
        ],
        offset: 0,
        limit: 1
      }).then(nextstagerange => {
        res.json(nextstagerange.rows[0]);
      });
    }else if(req.query.nextstagedate){
      NextStageRangeDB.findAll({
        attributes: ['date', 'nextstagerange'],
        order: [
          ['date', 'ASC']
        ],
        where:{
          date: req.query.chunkdate
        }
      }).then(nextstagerange => {
      res.json(nextstagerange);
      });
    }else{
      NextStageRangeDB.findAll({
        attributes: ['date', 'nextstagerange'],
        order: [
          ['date', 'ASC']
        ]
      }).then(nextstagerange => {
      res.json(nextstagerange);
      });
    }
      
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
      attributes: ['date', 'nextstagerange'],
      order: [
        ['date', 'ASC']
      ]
    }).then(nextstagerange => {
    res.json(nextstagerange);
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
      attributes: ['date', 'nextstagerange'],
      order: [
        ['date', 'ASC']
      ]
    }).then(nextstagerange => {
    res.json(nextstagerange);
    });
  });
});

module.exports = router;