const keys = require('../config/keys');

const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(keys.API_URL);
    } catch (err) {
        console.log(err);
    }
};

module.exports = activate;