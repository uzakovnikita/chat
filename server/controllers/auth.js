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
        return res.status(200).cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        }).status(200).json({message: 'success', user: userData});
    } catch (err) {
        next(err);
    }
};

module.exports.login = async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const userData = await userService.login(email, password);
        return res.status(200).cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        }).json({message: 'success', user: userData});
    } catch (err) {
        next(err);
    }
};

module.exports.logout = async function (req, res, next) {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({message: 'Logout success'});
    } catch (err) {
        next(err);
    }
};

module.exports.refresh = async function (req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userData = await userService.refreshToken(refreshToken);
        return res.status(200).cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        }).json({message: 'success refresh'});
    } catch (err) {
        next(err);
    }
};

module.exports.isLogin = async function (req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken || req.headers.authorization.split(' ')[1];
        const userData = await userService.isLogined(refreshToken);
        return res.json({message: 'check is succes', user: {...userData}});
    } catch (err) {
        next(err);
    }
}