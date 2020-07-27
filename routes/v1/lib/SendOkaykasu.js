'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const line = require("@line/bot-sdk");
const test_config = {
  channelAccessToken: process.env.TEST_ACCESS_TOKEN,
  channelSecret: process.env.TEST_SECRET_KEY
}; 
const rikei_config = {
  channelAccessToken: process.env.RIKEI_ACCESS_TOKEN,
  channelSecret: process.env.RIKEI_SECRET_KEY
}; 
const bunkei_config = {
  channelAccessToken: process.env.BUNKEI_ACCESS_TOKEN,
  channelSecret: process.env.BUNKEI_SECRET_KEY
}; 
const OkaykasuDB = require('./OkaykasuDB.js');

router.post('/',function(req,res){
    const db_type = req.body.db_type;
    const bot_destination = req.body.bot_destination;
    if(bot_destination === 'rikei'){
        var client = new line.Client(rikei_config);
    }else if(bot_destination === 'bunkei'){
        var client = new line.Client(bunkei_config);
    }else if(bot_destination === 'test'){
        var client = new line.Client(test_config);
    }
    const message_type = req.body.message_type;
    const send_type = req.body.send_type;
    let message = {
        'type': message_type
    }
    if(message_type === 'text'){
        const text = req.body.text;
        message.text = text;
    }else if(message_type === 'image'){
        const originalContentUrl = req.body.originalContentUrl;
        const previewImageUrl = req.body.previewImageUrl;
        message.originalContentUrl = originalContentUrl;
        message.previewImageUrl = previewImageUrl;
    }else if(message_type === 'flex'){
        const altText = req.body.altText;
        const contents = req.body.contents;
        message.altText = altText;
        message.contents = contents;
    }else {
        res.status(400).json({ error: 'Invalid request body. "message_type"'});
    }

    if(db_type === 'replace'){
        OkaykasuDB.destroy().then(() => {
            OkaykasuDB.create({
                okaykasu:message
              }).then(() => {});
        });
    }else if(db_type === 'add'){
        OkaykasuDB.create({
            okaykasu:message
          }).then(() => {});
    }

    if(send_type === 'push'){
        var to = req.body.to;
        client.pushMessage(to, message)
        .then(() => {
            res.status(200);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    }else if(send_type === 'multicast'){
        var to = req.body.to;
        client.multicast(to, message)
        .then(() => {
            res.status(200);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    }else if (send_type === 'broadcast'){
        client.broadcast(message)
        .then(() => {
            res.status(200);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    }else{
        res.status(400).json({ error: 'Invalid request body. "send_type"'});
    }

    
        
});

module.exports.router = router;

/*

const encodedData = a;// Base64エンコーディングされたファイルデータ

// Buffer
const fileData = encodedData.replace(/^data:\w+\/\w+;base64,/, '')
const decodedFile = new Buffer(fileData, 'base64')

// ファイルの拡張子(png)
const fileExtension = encodedData.toString().slice(encodedData.indexOf('/') + 1, encodedData.indexOf(';'))

// ContentType(image/png)
const contentType = encodedData.toString().slice(encodedData.indexOf(':') + 1, encodedData.indexOf(';'))
*/