'use strict';
const express = require('express');
const router = express.Router();
const ChunkRangeDB = require('../v1/lib/ChunkRangeDB');
const NextStageRangeDB = require('../v1/lib/NextStageRangeDB');
const OkaykasuDB = require('../v1/lib/OkaykasuDB');

/* GET home page. */
router.get('/', (req, res, next) => {
  Promise.all([ChunkRangeDB.findAndCountAll({
    attributes: ['date', 'chunkrange'],
    order: [
      ['date', 'ASC']
    ],
    offset: 0,
    limit: 1
  }),NextStageRangeDB.findAndCountAll({
    attributes: ['date', 'nextstagerange'],
    order: [
      ['date', 'ASC']
    ],
    offset: 0,
    limit: 1
  }),OkaykasuDB.findAll({
    attributes: ['okaykasu'],
    order: [
      ['id', 'ASC']
    ]
  })]).then(function(results){
    const okaykasucontent = results[2];
    if(req.user){
    if(req.user.emails[0].value.match(/@urawareimei.ed.jp/)){　//ドメイン認証
    res.render('index', { 
      chunkrange: results[0].rows[0],
      nextstagerange: results[1].rows[0],
      okaykasudata: JSON.stringify(okaykasucontenthandler(okaykasucontent))
    });
  }else{
    res.render('index', { 
      chunkrange: results[0].rows[0],
      nextstagerange: results[1].rows[0]
    });
  }
  }else{
    res.render('index', { 
      chunkrange: results[0].rows[0],
      nextstagerange: results[1].rows[0]
    });
  }
  console.log(req.user.emails[0].value);
});
  });

module.exports = router;

function okaykasucontenthandler(okaykasucontent) {
  let webcontent = [];
  for(let i = 0;i < okaykasucontent.length;i++){
    let linemessage = JSON.parse(okaykasucontent[i].okaykasu);
  switch(linemessage.type){
    case 'flex':
      webcontent.push(okaykasuFlex(linemessage));
      break;
    case 'text':
      break;
    case 'image':
      break;
  }
}
 return webcontent;
}

function okaykasuFlex(linemessage){
  let returnwebmessage
  if(linemessage.contents.type == 'carousel'){
    for(let i = 0;i < linemessage.contents.contents.length;i++){
      console.log(linemessage.contents.contents[i].header.contents[0].text)
        returnwebmessage += `<${linemessage.contents.contents[i].header.contents[0].text}> \n ${linemessage.contents.contents[i].body.contents[0].text}`
    }
  }
return returnwebmessage;
}