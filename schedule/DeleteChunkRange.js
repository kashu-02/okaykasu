'use strict';
const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});
const ChunkRangeDB = require('../routes/v1/lib/ChunkRangeDB.js');

DeleteChunkRange()

function DeleteChunkRange(){
    const nowday = moment().format("YYYY-MM-DD");
    console.log(nowday)
    ChunkRangeDB.findAndCountAll({
        attributes: ['date', 'chunkrange'],
        order: [
          ['date', 'ASC']
        ],
        offset: 0,
        limit: 1
      }).then(chunkrange => {
          console.log(chunkrange.rows[0].date);
        const chunkday = moment(chunkrange.rows[0].date);
        if(chunkday.isSameOrBefore(nowday)){
            ChunkRangeDB.destroy({
                where: {
                  date: chunkday.format("YYYY-MM-DD")
                }
              }).then(() => {}); 
        };
      });
}