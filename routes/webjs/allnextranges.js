'use strict';
const express = require('express');
const router = express.Router();
const NextStageRangeDB = require('../v1/lib/NextStageRangeDB');
const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});

/* GET home page. */
router.get('/', (req, res, next) => {
  NextStageRangeDB.findAll({
    attributes: ['date', 'nextstagerange'],
    order: [
      ['date', 'ASC']
    ]
  }).then(function (results) {
    let ranges = results.map(result => [{
      date: moment(result.date).format(MM月DD日(ddd)),
      nextstagerange: result.nextstagerange
    }])
    console.log(JSON.stringify(ranges));
      res.render('allnextranges', { 
        allnextranges: ranges
    });
  });
});

module.exports = router;