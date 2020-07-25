'use strict';
const LineFriendDB = require('./LineFriendDB.js');
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
const linefriendcreate = function(ev,destination,pro){
    switch(destination){
        case "U0f16903d7c2436ebb99c2459124fd40d":
            var bottype = 'test';
        break;
        case "U8270a125113318537d1d4eb2a53fd740":
            var bottype = 'rikei';
            break;
        case "U0f141a37a3b6b606b01b5696f916ea2b":
             var bottype = 'bunkei';
             break;
    }
LineFriendDB.create({
    friend_bottype: bottype,
    friend_talktype: ev.source.type,
    displayname: pro,
    userorgroupID: ev.source.groupId || ev.source.roomId || ev.source.userId
}).then(() => {
});
};

/**
 * READ
 */
router.get('/',function(req,res){
  const UserorGroupId = req.query.UserorGroupId;
  const bot_type = req.query.Bottype;
  console.log(`source_type: ${source_type}`);
  console.log(`UserorGroupId: ${UserorGroupId}`);
  if(!UserorGroupId && !bot_type){
    OkaykasuDB.findAll({
        where: {
            [Op.and]: [
              {userorgroupID: UserorGroupId},
              {friend_bottype: bot_type}
            ]
            }
        }).then(linefriends => {
        res.json(linefriends);
        });
  }else if(!UserorGroupId){
    OkaykasuDB.findAll({
        where: {
            userorgroupID: UserorGroupId
        }}).then(linefriends => {
        res.json(linefriends);
        });
  }else if(!bot_type){
    OkaykasuDB.findAll({
        where: {
            friend_bottype: bot_type
        }}).then(linefriends => {
        res.json(linefriends);
        });
  }else {
    OkaykasuDB.findAll().then(linefriends => {
        res.json(linefriends);
        });
  }
});

/**
 * UPDATE
 * @param {*} ev line_events
 * @param {*} destination linebot_destination
 * @param {*} pro linebot_profile
 */
const linefriendupdate = function(ev,destination,pro){
    switch(destination){
        case "U0f16903d7c2436ebb99c2459124fd40d":
            var bottype = 'test';
        break;
        case "U8270a125113318537d1d4eb2a53fd740":
            var bottype = 'rikei';
            break;
        case "U0f141a37a3b6b606b01b5696f916ea2b":
             var bottype = 'bunkei';
             break;
    }
    LineFriendDB.findOrCreate({
            where: {
                [Op.and]: [
                  {userorgroupID: ev.source.groupId || ev.source.roomId || ev.source.userId},
                  {friend_bottype: bottype}
                ]
            },
        defaults:{
        friend_bottype: bottype,
        friend_talktype: ev.source.type,
        displayname: pro,
        userorgroupID: ev.source.groupId || ev.source.roomId || ev.source.userId
    }}).then(() => {
    });
  LineFriendDB.update({
    displayname: pro
  },{
    where: {
        [Op.and]: [
          {userorgroupID: ev.source.groupId || ev.source.roomId || ev.source.userId},
          {friend_bottype: bottype}
        ]
        }
  }).then(() => {});
};

/**
 * DELETE
 */
const linefrienddelete = function(ev,destination){
    switch(destination){
        case "U0f16903d7c2436ebb99c2459124fd40d":
            var bottype = 'test';
        break;
        case "U8270a125113318537d1d4eb2a53fd740":
            var bottype = 'rikei';
            break;
        case "U0f141a37a3b6b606b01b5696f916ea2b":
             var bottype = 'bunkei';
             break;
    }
  LineFriendDB.destroy({
    where: {
        [Op.and]: [
          {userorgroupID: ev.source.groupId || ev.source.roomId || ev.source.userId},
          {friend_bottype: bottype}
        ]
        }
  }).then(() => {});
};


module.exports.linefriendcreate = linefriendcreate;
module.exports.linefrienddelete = linefrienddelete;
module.exports.linefriendupdate = linefriendupdate;
module.exports.router = router;