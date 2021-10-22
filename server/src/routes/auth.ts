import express from "express";
import { body } from "express-validator";
import controllers from "../controllers/auth";


const router = express.Router();

router.post('/login', controllers.login);
router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    controllers.register,
);
router.get('/logout', controllers.logout);
router.get('/refresh', controllers.refresh);
router.get('/islogin', controllers.isLogin);

export default router;