const express = require('express');
const controllers = require('../controllers/messages');
const router = express.Router();

router.get('/messages', controllers.messages);
module.exports = router;