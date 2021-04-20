'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if(req.user){
    if(req.user.emails[0].value.match(/@urawareimei.ed.jp/)){　//ドメイン認証
      res.render('lunch_menu', { 
        isLogined: 'Logined'
    });
    }else{
      res.render('lunch_menu', {
      });
    }
    }else{
      res.render('luch_menu', { 
      });
    }
  });


module.exports = router;
