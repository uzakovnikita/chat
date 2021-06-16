const userService = require('../service/user-service');

const AlreadyExists = require('../errorClasses/AlreadyExists');

module.exports.register = async function (req, res) {
    const { email, password } = req.body;

    try {
        const userData = await userService.register(email, password);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });
        res.status(200).json(userData);
    } catch (err) {
        if (err instanceof AlreadyExists) {
            res.status(400).json({ message: err.message });
        } else {
            console.log(err);
            res.status(500).end();
        }
    }
};

module.exports.login = async function (req, res) {
    // const candidate = await User.findOne({ name: req.body.name });

    // if (!candidate) {
    //     res.status(404).json({
    //         message: 'User with this name is not exists',
    //     });
    //     return;
    // }

    // const isEqualPassword = bcrypt.compareSync(
    //     String(req.body.password),
    //     candidate.password,
    // );

    // if (isEqualPassword) {
    //     res.status(200).cookie();

    //     return;
    // }

    // res.status(401).json({
    //     message: 'Invalid password',
    // });
};

module.exports.logout = function (req, res) {
    res.status(200).json({
        logout: true,
    });
};
