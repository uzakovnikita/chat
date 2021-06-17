const Message = require('../db/models/Message');

class MessageService {
    async getMessage(roomId) {
        try {
            const messages = await Message.find({room: roomId});
            return messages;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new MessageService();