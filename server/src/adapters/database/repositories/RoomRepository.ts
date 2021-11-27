/* eslint-disable no-underscore-dangle */
import Room from "../../../db/models/Rooms";
import Message from "../../../db/models/Message";

import { typeMessage, typeRoomSnapshot } from "../../../domain/entity/types";
import { IRoomRepository } from "../../../domain/useCases/DI/IRoomRepository";

export default class RoomRepository implements IRoomRepository {
  async createRoom(room: Omit<typeRoomSnapshot, "history">) {
    const { users } = room;
    const roomSaved = await new Room({ members: users }).save();

    return { id: roomSaved._id, users, history: [] as typeMessage[] };
  }

  async findRoomById(roomId: string, startHistory = 0, offsetHistory = 10) {
    const findedRoom = await Room.findById(roomId);
    const messages = (
      await Message.find({ room: roomId })
        .sort({ _id: -1 })
        .skip(+startHistory)
        .limit(offsetHistory)
    ).reverse();

    return { id: findedRoom._id, users: findedRoom.members, history: messages };
  }

  async findRoomsByUser(userId: string) {
    const findedRooms = await Room.find({ members: userId });
    const result = await Promise.all(
      findedRooms.map(async (room) => ({
        id: room._id,
        users: room.members,
        history: await Message.find({ roomId: room._id }),
      }))
    );

    return result;
  }

  async addNewMessage(room: typeRoomSnapshot & { id: string }) {
    const msg = room.history[room.history.length - 1];
    const savedMsg = await new Message({ ...msg }).save();
    await Room.updateOne({ _id: room.id }, { $push: { messages: savedMsg._id } });

    return {
      id: savedMsg._id,
      ...msg,
    };
  }
}
