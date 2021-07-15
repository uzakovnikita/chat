const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const config = require('../config/keys');
const tokenModel = require('../db/models/Token')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {accessToken, refreshToken};
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            await tokenData.save();
            return tokenData;
        }
        const token = await tokenModel.create({user: userId, refreshToken});
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
    async validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, keys.JWT_REFRESH_SECRET, {
                maxAge: '30m'
            });
            return userData;
        } catch (err) {
            return null;
        }
    }
    async validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, keys.JWT_ACCESS_SECRET, {
                maxAge: '15m'
            });
            return userData;
        } catch (err) {
            return null;
        }
    }
    async findRefreshToken(refreshToken) {
        try {
            const tokenData = await tokenModel.findOne({refreshToken});
            return tokenData;
        } catch (err) {
            return null;
        }
    }
};

module.exports = new TokenService();