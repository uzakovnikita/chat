const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const User = require('../db/models/user');
const Rooms = require('../db/models/rooms');

const MailService = require('./mail-service');
const tokenService = require('./token-service');

const AlreadyExists = require('../errorClasses/AlreadyExists');
const NotValidActivateLink = require('../errorClasses/NotValidActivateLink');

const keys = require('../config/keys');

class UserService {

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

        const salt = bcrypt.genSaltSync(10);

        if (candidate) {
            throw new AlreadyExists('User already exists');
        }

        const activationLink = uuid.v4();

        const user = await new User({
            email,
            password: bcrypt.hashSync(password, salt),
            activationLink,
        });

        await this.createUserInTransaction(user);
        
        await MailService.sendActiovationMail(email, `${keys.API_URL}/api/activate/${activationLink}`);

        const dto = { email, id: user._id, isActivated: user.isActivated };

        const tokens = tokenService.generateTokens(dto);
        await tokenService.saveToken(dto.id, tokens.refreshToken);
        
        return { ...tokens, user: dto };
    }

    async activate(activationLink) {
        const user = User.findOne({activationLink});
        if (!user) {
            throw new NotValidActivateLink();
        }
        user.isActivated = true;
        await user.save();
    }
}

module.exports = new UserService();
