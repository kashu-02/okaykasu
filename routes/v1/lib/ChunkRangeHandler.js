'use strict';
const ChunkRangeDB = require('./ChunkRangeDB.js');
const express = require('express');
const router    = express.Router();

router.get('/',function(req,res){
  ChunkRangeDB.findAll({ limit: 1 }).then((chunkrange) => {
    console.log(`chunkrange:${chunkrange}`)
    const chunkdate = new Date(chunkrange.date);
    const chunkyear = chunkdate.getFullYear();
    const chunkday = chunkdate.getDate();
    const chunkmonth = chunkdate.getMonth() + 1;
    const chunkweek = [ "日", "月", "火", "水", "木", "金", "土" ][chunkdate.getDay()] ;
    res.json(JSON.stringify({
      year: chunkyear,
      month: chunkmonth,
      date: chunkday,
      day: chunkweek,
      range:chunkrange.chunkrange
    }));
  });
});


router.post('/',function(req,res){
  console.log(req.body);
ChunkRangeDB.create({
  date:req.body.Date,
  chunkrange:req.body.Range
}).then(() => {
  res.status(200).end();
});
});

module.exports = router;