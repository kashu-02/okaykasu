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
  res.json(okaykasu);
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
    res.json(okaykasu);
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
      id:req.body.Id
    }
  }).then(() => {
    OkaykasuDB.findAll({
      attributes: ['id', 'okaykasu'],
      order: [
        ['id', 'ASC']
      ]
    }).then(okaykasu => {
    res.json(okaykasu);
    });
  });
});

/**
 * DELETE
 */
router.delete('/',function(req,res){
  OkaykasuDB.destroy({
    where: {
      id:req.body.Id
    }
  }).then(() => {
    OkaykasuDB.findAll({
      attributes: ['id', 'okaykasu'],
      order: [
        ['id', 'ASC']
      ]
    }).then(okaykasu => {
    res.json(okaykasu);
    });
  });
});

module.exports = router;