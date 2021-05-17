const bcrypt = require('bcryptjs');

const User = require('../db/models/User');

module.exports.register = async function(req, res) {
    const candidate = await User.findOne({
        email: req.body.email,
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
        email: req.body.email,
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
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        const passwordResult = bcrypt.compareSync
    } else {
        res.status(404).json({
            message: 'User with this name is not exists'
        })
    }
    res.status(200).json({
        register: true,
    });
};

module.exports.logout = function(req, res) {
    res.status(200).json({
        logout: true,
    });
};