const express = require('express');
const controllers = require('../controllers/rooms');
const router = express.Router();

router.post('/rooms', controllers.rooms);

module.exports = router;