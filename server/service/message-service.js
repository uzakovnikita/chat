const Message = require('../db/models/Message');

class MessageService {
    async getMessage(roomId, count) {
        try {
            const messages = await Message.find({room: roomId}).skip(+count).limit(10);
            console.log(messages)
            return messages;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new MessageService();