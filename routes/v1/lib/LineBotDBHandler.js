'use strict';
const LineBotDB = require('./LineBotDB.js');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * CREATE
 */
const linebotcreate = function(ev,destination){
LineBotDB.create({
  bot_destination: destination,
  events_type: ev.type,
  message_timestamp: computeDuration(ev.timestamp),
  source_type: ev.source.type,
  source_userId: ev.source.userId,
  source_groupId: ev.source.groupId || ev.source.roomId,
  message_type: ev.message.type,
  message_content: ev.message.text
}).then(() => {
});
};

/**
 * READ
 */
router.get('/:bot_destination/:source_type/:UserorGroupId',function(req,res){
  switch(req.params.bot_destination){
    case "test":
      var bot_destination = "U0f16903d7c2436ebb99c2459124fd40d";
      default:
        res.status(400).json({ error: 'Invalid bot_destination' });
    break;
  }
  const source_type = req.params.source_type;
  const UserorGroupId = req.params.UserorGroupId;
  console.log(`source_type: ${source_type}`);
  console.log(`UserorGroupId: ${UserorGroupId}`);
  if(!source_type || !UserorGroupId){
    res.status(400).json({ error: 'Invalid source_type or UserorGroupId' });
  }
  const page = req.query.page || 1;
  const perPage = req.query.perpage || 10;
  if(source_type === "user"){
    LineBotDB.findAndCountAll({
      where: {
        [Op.and]: [
          {bot_destination: bot_destination},
          {source_userId: UserorGroupId},
          {source_groupId: null}
        ]
        },
      offset: (page - 1) * perPage,
      limit: perPage
    }).then(userresult => {
      const res_json = {
        page: page,
        line: userresult.rows
      }
      res.json(res_json);
    });
  } else if(source_type === "group" || source_type === "room"){
    LineBotDB.findAndCountAll({
      where: {
        [Op.and]: [
        {bot_destination: bot_destination},
        {source_groupId: UserorGroupId}
        ]
      },
      offset: (page - 1) * perPage,
      limit: perPage
    }).then(groupresult => {
      const res_json = {
        page: page,
        line: groupresult.rows
      }
      res.json(res_json);
    });
  }
  
});


/**
 * DELETE
 */
router.delete('/',function(req,res){
  LineBotDB.destroy({
    where: {
      date:req.body.Date
    }
  }).then(() => {
    LineBotDB.findAll({
      attributes: ['date', 'linebot'],
      order: [
        ['date', 'ASC']
      ]
    }).then(linebot => {
    res.json(linebot);
    });
  });
});

/**
 * 
 * @param {Number} ms ミリ秒を
 */
function computeDuration(ms){
  const date = new Date(ms);
return date.toString();
}

module.exports.linebotcreate = linebotcreate;
module.exports.router = router;