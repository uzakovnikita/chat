const Message = require('../db/models/Message');

class MessageService {
    async getMessage(roomId, count) {
        try {
            const messages = await Message.find({room: roomId}).sort({_id: -1}).skip(+count).limit(20);
            return messages.reverse();
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new MessageService();