'use strict';
const OkaykasuDB = require('./OkaykasuDB.js');
const express = require('express');
const router = express.Router();

/**
 * CREATE
 */
router.post('/',function(req,res){
  console.log(req.body);
OkaykasuDB.create({
  okaykasu:req.body.Content
}).then(() => {
  OkaykasuDB.findAll({
    attributes: ['id', 'okaykasu'],
    order: [
        ['id', 'ASC']
      ]
  }).then(okaykasu => {
  res.json(JSON.stringify(okaykasu));
  });
});
});

/**
 * READ
 */
router.get('/',function(req,res){
    OkaykasuDB.findAll({
      attributes: ['id', 'okaykasu'],
      order: [
        ['id', 'ASC']
      ]
    }).then(okaykasu => {
    res.json(JSON.stringify(okaykasu));
    });
});

/**
 * UPDATE
 */
router.put('/',function(req,res){
  console.log(req.body);
  OkaykasuDB.update({
    okaykasu:req.body.Content
  },
  { 
    where: {
      Id:req.body.Id
    }
  }).then(() => {
    OkaykasuDB.findAll({
      attributes: ['id', 'okaykasu'],
      order: [
        ['id', 'ASC']
      ]
    }).then(okaykasu => {
    res.json(JSON.stringify(okaykasu));
    });
  });
});

/**
 * DELETE
 */
router.delete('/',function(req,res){
  OkaykasuDB.destroy({
    where: {
      Id:req.body.Id
    }
  }).then(() => {
    OkaykasuDB.findAll({
      attributes: ['id', 'okaykasu'],
      order: [
        ['id', 'ASC']
      ]
    }).then(okaykasu => {
    res.json(JSON.stringify(okaykasu));
    });
  });
});

module.exports = router;