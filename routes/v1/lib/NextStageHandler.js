'use strict';
const NextStageRangeDB = require('./NextStageRangeDB.js');
const express = require('express');
const router = express.Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');
/**
 * CREATE
 */
router.post('/',function(req,res){
  console.log(req.body);
  const nextstagedate = moment(req.body.Date).format('YYYY-MM-DD');
  if(!req.body.Range || !nextstagedate || nextstagedate === 'Invalid date'){
    res.status(400).json({ error: 'Invalid request body' });
    break;
  }
NextStageRangeDB.create({
  date:nextstagedate,
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
  const nextstagedate = moment(req.body.Date).format('YYYY-MM-DD');
  if(!req.body.Range || !nextstagedate || nextstagedate === 'Invalid date'){
    res.status(400).json({ error: 'Invalid request body' });
    break;
  }
  NextStageRangeDB.update({
    nextstagerange:req.body.Range
  },
  { 
    where: {
      date:nextstagedate
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
    const nextstagedate = moment(req.body.Date).format('YYYY-MM-DD');
    if(!req.body.Range || !nextstagedate || nextstagedate === 'Invalid date'){
        res.status(400).json({ error: 'Invalid request body' });
        break;
      }
  NextStageRangeDB.destroy({
    where: {
      date:nextstagedate
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