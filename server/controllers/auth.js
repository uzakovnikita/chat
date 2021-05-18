const bcrypt = require('bcryptjs');

const User = require('../db/models/User');

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
        console.log('tut')
        await user.save();
        res.status(201).json({
            message: 'user was created'
        })
    } catch (err) {
        console.log(err)
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
        res.status(200).json({message: 'login success', userID: candidate._id});
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