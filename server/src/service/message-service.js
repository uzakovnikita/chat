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
            
            const resultOfMessagesPromises = await Promise.all(messagesByRooms);
            
            const lastMessagesInRooms = resultOfMessagesPromises.reduce((acc, messages) => {
                if (messages.length === 0) {
                    return {...acc};
                }
                const message = {
                    _id: messages[0]._id.toString(),
                    messageBody: messages[0].messageBody,
                    from: messages[0].from,
                    to: messages[0].to,
                    roomId: messages[0].room,
                };
                const newAcc = {...acc, [message.roomId.toString()]: 
                    message
                }
                return newAcc;
            }, {});
            
            return lastMessagesInRooms;

        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new MessageService();