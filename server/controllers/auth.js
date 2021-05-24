const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../db/models/User');
const Rooms = require('../db/models/Rooms');

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({
        name: req.body.name,
    });

    if (candidate) {
        res.status(409).json({
            message: 'user already exists',
        });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const password = String(req.body.password);

    const user = new User({
        name: req.body.name,
        password: bcrypt.hashSync(password, salt),
    });

    const users = await User.find();

    async function createUser() {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = {session};
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
            res.status(501).json({
                message: "user wasn't created",
            });
            throw new Error(err);
        }
    }
    
    try {
        await createUser();
    } catch (err) {
        console.log(`user didn't created`);
    }

    res.status(201).json({
        message: 'user was created',
    });

};

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({ name: req.body.name });

    if (!candidate) {
        res.status(404).json({
            message: 'User with this name is not exists',
        });
        return;
    }

    // const rooms = await Rooms.find({ members: candidate._id });
    // const users = await User.find();
    // const dialogs = rooms.map(room => {
    //     const interlocutorId = room.members.filter(id => String(id) !== String(candidate._id))[0];
    //     const interlocutorName = users.find(({_id}) => String(_id) === String(interlocutorId)).name;
    //     return {roomId: room._id, interlocutorName, interlocutorId};
    // });

    const isEqualPassword = bcrypt.compareSync(
        String(req.body.password),
        candidate.password,
    );

    if (isEqualPassword) {
        res.status(200).json({
            message: 'login success',
            userID: candidate._id,
            // dialogs
        });
        return;
    }

    res.status(401).json({
        message: 'Invalid password',
    });
};

module.exports.logout = function (req, res) {
    res.status(200).json({
        logout: true,
    });
};
