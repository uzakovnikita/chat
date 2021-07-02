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

    async getLastMessagesInRooms(rooms) {
        try {
            const messagesByRooms = rooms.map((room) => {
                return Message.find({room}).sort({_id: -1});
            })
            const result = await Promise.all(messagesByRooms);
            return result.reduce((acc, messages) => {
                const newAcc = [...acc, messages[0]];
                return newAcc;
            }, []);
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new MessageService();