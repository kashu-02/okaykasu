/**
 * LINEBotのDB処理
 */

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
 * @param {*} ev LINEから渡されたイベント
 * @param {*} destination 受信すべきBotのUserId
 * @param {*} pro ユーザープロフィール
 */
const linebotcreate = function(ev,destination,pro){
  if(!pro){
    var username = null;
  }else{
    var username = pro;
  }
LineBotDB.create({
  bot_destination: destination,
  events_type: ev.type,
  message_timestamp: computeDuration(ev.timestamp),
  source_type: ev.source.type,
  source_userId: ev.source.userId,
  source_groupId: ev.source.groupId || ev.source.roomId,
  source_username: username,
  message_type: ev.message.type || null,
  message_content: ev.message.text || null
}).then(() => {
});
};

/**
 * READ
 * 
 * URL : https://okaykasu.herokuapp.com/api/v1/LineBot/
 * Authorization: required
 * RequestQuery: page ページ番号(Optional)
 *               perPage 1ページあたりの表示件数(Optional)
 * METHOD: GET
 * Return: 200 {JSON Array} 登録されているチャンク範囲
 *       ex) [
 *            {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             },
 *            {
 *              date:2020-08-25,
 *              chunkrange: pp.102-117
 *            },
 *                ...
 *           ]
 *         latestchunkまたはhunkdate指定がある場合
 * 　　　　200　{JSON} 
 *       ex) {
 *              date:2020-08-24,
 *              chunkrange: pp.102-111
 *             }
 */
router.get('/',function(req,res){
  const page = req.query.page || 1;
  const perPage = req.query.perpage || 10;
  /* 
  switch(req.query.bot_destination){
    case "test":
      var bot_destination = "U0f16903d7c2436ebb99c2459124fd40d";
      break;
    case "rikei":
      var bot_destination = "U8270a125113318537d1d4eb2a53fd740";
      break;
    case "bunkei":
        var bot_destination = "U0f141a37a3b6b606b01b5696f916ea2b";
        break;  
    default:
    break;
  }
  const source_type = req.query.source_type;
  const UserorGroupId = req.query.UserorGroupId;
  console.log(`source_type: ${source_type}`);
  console.log(`UserorGroupId: ${UserorGroupId}`);
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
  */
 LineBotDB.findAndCountAll({
  where: {},
  offset: (page - 1) * perPage,
  limit: perPage
}).then(userresult => {
  const res_json = {
    page: page,
    line: userresult.rows
  }
  res.json(res_json);
});
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