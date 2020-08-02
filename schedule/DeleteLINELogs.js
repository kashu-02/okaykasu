'use strict';
const LineBotDB = require('../routes/v1/lib/LineBotDB.js');
const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});

main();

function main(){
    LineBotDB.count().then(dataCount => {
        console.log(`datacount${dataCount}`)
        if(dataCount >= 30){
            LineBotDB.findAndCountAll({
                offset: 0,
                limit: 20,
                order: [
                    ['id', 'ASC']
                  ]
              }).then(findresult => {
                  console.log(JSON.stringify(findresult))
                    var lastid = findresult[findresult.rows.length - 1].id;
                    console.log(lastid)
                });
        }
    });

}