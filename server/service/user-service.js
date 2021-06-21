const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const User = require('../db/models/user');
const Rooms = require('../db/models/rooms');

const MailService = require('./mail-service');
const tokenService = require('./token-service');

const ApiError = require('../exceptions/api-error');

const keys = require('../config/keys');

class UserService {

    static getDto(user) {
        return { email: user.email, id: user._id, isActivated: user.isActivated };
    }

    async createUserInTransaction(user) {
        const users = await User.find();
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = { session };
            await user.save(opts);
            if (users.length > 0) {
                const rooms = users.map((oldUser) => {
                    return (new Rooms({members: [oldUser._id, user._id]})).save(opts);
                });
                await Promise.all(rooms);
            }
            await session.commitTransaction();
            session.endSession();
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(err);
        }
    }

    async register(email, password) {

        const candidate = await User.findOne({ email });

        if (candidate) {
            throw ApiError.BadRequest('User already exists');
        }

        const activationLink = uuid.v4();
        const salt = bcrypt.genSaltSync(10);
        const user = await new User({
            email,
            password: bcrypt.hashSync(password, salt),
            activationLink,
        });

        await this.createUserInTransaction(user);
        
        await MailService.sendActiovationMail(email, `${keys.API_URL}/api/activate/${activationLink}`);

        const dto = UserService.getDto(user);

        const tokens = tokenService.generateTokens(dto);
        await tokenService.saveToken(dto.id, tokens.refreshToken);
        
        return { ...tokens, user: dto };
    }

    async activate(activationLink) {
        const user = User.findOne({activationLink});
        if (!user) {
            throw new ApiError.BadRequest('User with this activation link is not exists');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('User is not found');
        }
        const isEqualPassword = await bcrypt.compare(password, user.password);
        if (!isEqualPassword) {
            throw ApiError.BadRequest('Wrong password');
        }
        const dto = UserService.getDto(user);

        const tokens = tokenService.generateTokens(dto);

        await tokenService.saveToken(dto.id, tokens.refreshToken);
        
        return { ...tokens, user: dto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError('Token is empty');
        }
        const tokenFromDb = await tokenService.findRefreshToken(refreshToken);
        console.log(`tokenFromDb in refreshToken in user-service ${tokenFromDb}`);
        const userData = await tokenService.validateRefreshToken(refreshToken);
        console.log(`userData in refreshToken in user-service = ${JSON.stringify(userData, null, 2)}`)
        if (!tokenFromDb || !userData) {
            throw ApiError.UnauthorizedError('Not valid refresh token');
        }
        const user = await User.findById(userData.id);
        console.log(`user in refreshToken in user-service ${JSON.stringify(user, null, 2)}`)
        const dto = UserService.getDto(user);


        const tokens = tokenService.generateTokens(dto);

        await tokenService.saveToken(dto.id, tokens.refreshToken);
        
        return { ...tokens, user: dto };
    }

    async isLogined(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError('Token is empty');
        }
        const tokenFromDb = await tokenService.findRefreshToken(refreshToken);
        const userData = await tokenService.validateRefreshToken(refreshToken);
        console.log(`userData in userService in isLogined ${JSON.stringify(userData, null, 2)}`)
        if (!tokenFromDb || !userData) {
            throw ApiError.UnauthorizedError('Not valid refresh token');
        }
        const user = await User.findById(userData.id);
        const dto = UserService.getDto(user);
        const tokens = tokenService.generateTokens(dto);
        return { ...dto, accessToken: tokens.accessToken};
    }
}

module.exports = new UserService();
