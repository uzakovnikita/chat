const roomService = require('../db/models/Rooms');

module.exports.rooms = async function (req, res, next) {
    const { userId } = req.body;
    try {
        const dialogs = await roomService.getDialogs(userId);
        return res.json({
            message: 'get rooms success',
            dialogs,
        });
    } catch (err) {
        next(err);
    }
};
