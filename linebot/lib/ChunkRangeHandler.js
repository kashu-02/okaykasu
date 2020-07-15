'use strict';
const ChunkRangeDB = require('./ChunkRange.js');

exports.GetChunkRange = function (req, res) {
  res.status(200).end(); //200番をレスポンスとして返しておく
  ChunkRangeDB.findAll({ limit: 1 }).then((chunkrange) => {
    const chunkdate = new Date(chunkrange.date);
    const chunkyear = chunkdate.getFullYear();
    const chunkday = chunkdate.getDate();
    const chunkmonth = chunkdate.getMonth() + 1;
    const chunkweek = [ "日", "月", "火", "水", "木", "金", "土" ][chunkdate.getDay()] ;
    res.end(JSON.stringify({
      'year': chunkyear,
      'month': chunkmonth,
      'date': chunkday,
      'day': chunkweek,
      'range':chunkrange.chunkrange
    }));
  });
 
}
/* 
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        const content = decoded.split('content=')[1];
        console.info('投稿されました: ' + content);
        contents.push(content);
        console.info('投稿された全内容: ' + contents);
        handleRedirectPosts(req, res);
      });
      break;
    default:
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}
*/