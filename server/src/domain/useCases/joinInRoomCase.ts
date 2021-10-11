import {room, user} from '../entity';


export const joinInRoomCase = (userId: string, roomId: string) => {
    user.joinInRoom(userId, roomId);
    room.fetchHistory();
};