const Room = require('../db/models/Rooms');
const User = require('../db/models/User');

class RoomService {
    async getRooms(userId) {
        try {
            const rooms = await Room.find({ members: userId });
            const users = await User.find();
            const result = rooms.map((room) => {
                const interlocutorId = room.members.filter(
                    (id) => String(id) !== String(userId),
                )[0];
                const interlocutorName = users.find(
                    ({ _id }) => String(_id) === String(interlocutorId),
                ).email;
                return { roomId: room._id, interlocutorName, interlocutorId };
            });
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new RoomService();
