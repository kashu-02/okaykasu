'use strict';
const express = require('express');
const router = express.Router();
//const { noExtendLeft } = require('sequelize/types/lib/operators');

/* GET home page. */
router.get('/', (req, res, next) => {
    /* 削除
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
*/
    if(req.user){
    if(req.user.emails[0].value.match(/@urawareimei.ed.jp/)){　//ドメイン認証
      res.render('examrange', { 
        isLogined: 'Logined'
    });
    }else{
      res.render('examrange', {
      });
    }
    }else{
      res.render('examrange', { 
      });
    }
  });


module.exports = router;

/* 削除
function okaykasucontenthandler(okaykasucontent) {
  let webcontent = [];
  for(let i = 0;i < okaykasucontent.length;i++){
    let linemessage = JSON.parse(okaykasucontent[i].okaykasu);
  switch(linemessage.type){
    case 'flex':
      webcontent.push({type: 'text',
                       linemessage: okaykasuFlex(linemessage)
                      });
      break;
    case 'text':
      webcontent.push({type: 'text',
                      linemessage: linemessage.text
                      });
      break;
    case 'image':
      webcontent.push({type: 'image',
                      linemessage: linemessage.originalContentUrl
                      })
      break;
  }
}
 return webcontent;
}

function okaykasuFlex(linemessage){
  let returnwebmessage = "";
  if(linemessage.contents.type == 'carousel'){
    for(let i = 0;i < linemessage.contents.contents.length;i++){
        returnwebmessage += `<${linemessage.contents.contents[i].header.contents[0].text}> \n ${linemessage.contents.contents[i].body.contents[0].text} \n\n`
    }
  }
return returnwebmessage;
}
*/
