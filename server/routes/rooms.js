const express = require('express');
const controllers = require('../controllers/rooms');
const router = express.Router();

router.get('/rooms', controllers.rooms);

module.exports = router;