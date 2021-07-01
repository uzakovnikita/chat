const express = require('express');
const controllers = require('../controllers/messages');
const router = express.Router();

router.get('/messages', controllers.messages);
router.get('/lastmessagesinrooms', controllers.lastmessagesinrooms);
module.exports = router;