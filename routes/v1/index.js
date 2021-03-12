const express = require('express');
const auth = require('../auth/api_auth');
const router = express.Router();

router.use(auth)
router.use('/ChunkRange', require('./lib/ChunkRangeHandler.js'));
router.use('/NextStageRange', require('./lib/NextStageHandler.js'));
router.use('/Okaykasu', require('./lib/OkaykasuHandler.js'));
router.use('/LineBot', require('./lib/LineBotDBHandler.js').router);
router.use('/LineFriends', require('./lib/LineFriendHandler.js').router);
router.use('/SendOkaykasu', require('./lib/SendOkaykasu.js').router);
module.exports = router;