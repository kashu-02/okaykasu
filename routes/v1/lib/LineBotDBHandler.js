'use strict';
const LineBotDB = require('./LineBotDB.js');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');
/**
 * CREATE
 */
const linebotcreate = function(ev,destination,pro){
  if(!pro){
    var username = 'undefined';
  }else{
    var username = pro.displayName;
  }
  if(!ev.message.type){
    var messagetype = 'undefined';
  }else{
    var messagetype = ev.message.type;
  }
  if(!ev.message.text){
    var messagecontent = 'undefined';
  }else{
    var messagecontent = ev.message.text;
  }
LineBotDB.create({
  bot_destination: destination,
  events_type: ev.type,
  message_timestamp: computeDuration(ev.timestamp),
  source_type: ev.source.type,
  source_userId: ev.source.userId,
  source_groupId: ev.source.groupId || ev.source.roomId,
  source_username: username,
  message_type: messagetype,
  message_content: messagecontent
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
 * @param {Number} ms ミリ秒をYYYY-MM-DD HH:mm:ss
 */
function computeDuration(ms){
return moment(ms).format('YYYY-MM-DD HH:mm:ss');
}

module.exports.linebotcreate = linebotcreate;
module.exports.router = router;