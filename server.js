const express = require('express');
const line = require('@line/bot-sdk');

const SECRET_KEY = process.env.TEST_SECRET_KEY;
const ACCESS_TOKEN = process.env.TEST_SECRET_KEY;
const config = {
  channelAccessToken: ACCESS_TOKEN,
  channelSecret: SECRET_KEY
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(3000);