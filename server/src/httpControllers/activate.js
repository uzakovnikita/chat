const keys = require('../config/keys');

const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(keys.API_URL);
    } catch (err) {
        next(err);
    }
};

module.exports = activate;