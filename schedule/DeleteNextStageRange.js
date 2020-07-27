'use strict';
const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});
const NextStageRangeDB = require('../routes/v1/lib/NextStageRangeDB.js');

DeleteNextStageRange()

function DeleteNextStageRange(){
    const nowday = moment().format("YYYY-MM-DD");
    console.log(nowday)
    NextStageRangeDB.findAndCountAll({
        attributes: ['date', 'nextstagerange'],
        order: [
          ['date', 'ASC']
        ],
        offset: 0,
        limit: 1
      }).then(nextstagerange => {
          console.log(nextstagerange.rows[0].date);
        const nextstageday = moment(nextstagerange.rows[0].date);
        if(nextstageday.isSameOrBefore(nowday)){
            NextStageRangeDB.destroy({
                where: {
                  date: nextstageday.format("YYYY-MM-DD")
                }
              }).then(() => {}); 
        };
      });
}