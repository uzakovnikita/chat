const messageService = require('../service/message-service');

module.exports.messages = async function (req, res, next) {
    const { roomId } = req.query;
    try {
        const messages = await messageService.getMessage(roomId);
        res.json({messages});
    } catch (err) {
        next(err);
    }
};
