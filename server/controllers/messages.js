const Rooms = require('../db/models/Rooms');
const User = require('../db/models/User');
const Message = require('../db/models/Message');

module.exports.messages = async function (req, res) {
    const { userID, roomId } = req.query;
    try {
        const messages = await Message.find({
            room: roomId
        });
        console.log(messages);
        res.status(200).json({messages})
    } catch (err) {
        console.log(`this error in rooms controller, error: ${err}`);
        res.status(500).json({
            message: 'get rooms failed'
        });
    }
};
