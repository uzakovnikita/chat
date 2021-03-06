const roomService = require('../service/room-service');
const tokenService = require('../service/token-service');

module.exports.rooms = async function (req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(' ')[1];
    try {
        const user = await tokenService.validateAccessToken(accessToken);
        const rooms = await roomService.getRooms(user.id);
        return res.json({
            message: 'get rooms success',
            rooms,
        });
    } catch (err) {
        next(err);
    }
};
