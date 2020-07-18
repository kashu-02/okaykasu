const express = require('express');
const router = express.Router();

router.use('/ChunkRange', require('./lib/ChunkRangeHandler.js'));

module.exports = router;