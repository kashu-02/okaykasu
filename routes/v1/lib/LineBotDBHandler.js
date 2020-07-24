'use strict';
const LineBotDB = require('./LineBotDB.js');
const express = require('express');
const router = express.Router();

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
  source_groupId: ev.source.groupId || ev.source.roomId || "null",
  message_type: ev.message.type,
  message_content: ev.message.text
}).then(() => {
});
};

/**
 * READ
 */
router.get('/:source_type/:UserorGroupId',function(req,res){
  const source_type = req.param.source_type;
  const UserorGroupId = req.param.UserorGroupId;
  console.log(`source_type: ${source_type}`);
  console.log(`UserorGroupId: ${UserorGroupId}`);
  if(!source_type || !UserorGroupId){
    res.status(400).json({ error: 'Invalid source_type or UserorGroupId' });
  }
  const page = req.query.page || 1;
  const perPage = req.query.perpage || 10;
  if(source_type === "user"){
    LineBotDB.findAndCountAll({
      offset: (page - 1) * perPage,
      limit: perPage
    },
    {
      where: {
      [Op.and]: {
        source_userId: UserorGroupId,
        source_groupId: null
      }
      }
    }
    ).then(userresult => {
      const res_json = {
        page: page,
        line: userresult
      }
      res.json(JSON.stringify(res_json));
    });
  } else if(source_type === "group" || source_type === "room"){
    LineBotDB.findAndCountAll({
      offset: (page - 1) * perPage,
      limit: perPage
    },
    {
      where: {
        source_groupId: UserorGroupId
      }
    }
    ).then(groupresult => {
      const res_json = {
        page: page,
        line: groupresult
      }
      res.json(JSON.stringify(res_json));
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
    res.json(JSON.stringify(linebot));
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