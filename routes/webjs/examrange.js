'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  req.session.recentUrl = '/examrange'
  console.log(`req.url:${req.url}`)
  console.log(`req.session.recenturl:${req.session.recentUrl}`)
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