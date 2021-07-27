'use strict';
const express = require('express');
const router = express.Router();
const ChunkRangeDB = require('../v1/lib/ChunkRangeDB');
const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});
/* GET home page. */
router.get('/', (req, res, next) => {
  ChunkRangeDB.findAll({
    attributes: ['date', 'chunkrange'],
    order: [
      ['date', 'ASC']
    ]
  }).then(function (results) {
    let ranges = Array.prototype.push.apply(ranges, results.map(result => [{
      date: moment(result.date).format("MM月DD日(ddd)"),
      chunkrange: result.chunkrange
    }]))
    console.log(JSON.stringify(ranges));
      res.render('allchunkranges', { 
        allchunkranges: ranges
    });
  });
});

module.exports = router;