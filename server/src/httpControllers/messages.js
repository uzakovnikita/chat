// const messageService = require('../service/message-service');

// module.exports.messages = async function (req, res, next) {
//     const { roomId, count } = req.query;
//     try {
//         const messages = await messageService.getMessage(roomId, count);
//         res.json({messages});
//     } catch (err) {
//         next(err);
//     }
// };

// module.exports.lastmessagesinrooms = async function (req, res, next) {
//     const rooms = req.body;

//     try {
//         const messages = await messageService.getLastMessagesInRooms(rooms);
//         res.json({lastMessagesInRooms: messages});
//     } catch (err) {
//         next(err);
//     }
// }