const express = require('express');
const controllers = require('../controllers/auth');
const router = express.Router();

const { body } = require('express-validator');

router.post('/login', controllers.login);
router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    controllers.register,
);
router.get('/logout', controllers.logout);
router.get('/refresh', controllers.refresh);

module.exports = router;
