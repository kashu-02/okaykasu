const express = require('express');
const router = express.Router();

router.use('/ChunkRange', require('./lib/ChunkRangeHandler.js'));
router.use('/NextStageRange', require('./lib/NextStageHandler.js'));
module.exports = router;