const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../db/models/User');
const { JWT } = require('../config/keys');

module.exports.register = async function(req, res) {
    const candidate = await User.findOne({
        name: req.body.name,
    });

    if (candidate) {
        res.status(409).json({
            message: 'user already exists'
        });
        return;
    } 
    
    const salt = bcrypt.genSaltSync(10);
    const password = String(req.body.password);
    const user = new User({
        name: req.body.name,
        password: bcrypt.hashSync(password, salt),
    });

    try {
        await user.save();
        res.status(201).json({
            message: 'user was created'
        })
    } catch (err) {
        res.status(501).json({
            message: 'user wasn\'t created'
        })
    }   
}

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({name: req.body.name});

    if (!candidate) {
        res.status(404).json({
            message: 'User with this name is not exists'
        });
        return;
    }

    const isEqualPassword = bcrypt.compareSync(String(req.body.password), candidate.password);
    
    if (isEqualPassword) {
        const token = jwt.sign({
            name: candidate.name,
            userId: candidate._id,
        }, JWT, {expiresIn: 60*60});
        res.status(200).json({
            token: `Bearer ${token}`,
        });
        return;
    }

    res.status(401).json({
        message: 'Invalid password'
    })
};

module.exports.logout = function(req, res) {
    res.status(200).json({
        logout: true,
    });
};