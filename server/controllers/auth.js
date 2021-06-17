const { validationResult } = require('express-validator');

const ApiError = require('../exceptions/api-error');
const userService = require('../service/user-service');

module.exports.register = async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validate error', errors.array()));
        }
        const userData = await userService.register(email, password);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.status(200).json(userData);
    } catch (err) {
        next(err);
    }
};

module.exports.login = async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const userData = await userService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.logout = async function (req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        console.log(`refresh token in logout controller from cookies ${refreshToken}`);
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json({message: 'Logout success'});
    } catch (err) {
        next(err);
    }
};

module.exports.refresh = async function (req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        const userData = await userService.refreshToken(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json(userData);
    } catch (err) {
        next(err);
    }
}