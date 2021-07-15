const express = require('express');
const controllerActivate = require('../controllers/activate');
const router = express.Router();

router.get('/activate/:link', controllerActivate);
module.exports = router;