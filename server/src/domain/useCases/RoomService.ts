import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import Room from "../entity/Room";
import { typeMessage, typeRoomSnapshot } from "../entity/types";
import { IRoomRepository } from "./DI/IRoomRepository";

@injectable()
export default class RoomService {
  @inject(TYPES.RoomRepository) private roomRepository: IRoomRepository;

  public async getHistory(roomId: string) {
    try {
      const roomSnapshot = await this.roomRepository.findById(roomId);
      const room = Room.create(roomSnapshot);
      return room.history;
    } catch (err) {
      throw err;
    }
  }

  public async sendMessage(message: Omit<typeMessage, "id">) {
    try {
      const roomSnapshot = await this.roomRepository.findById(message.roomId);
      const room = Room.create(roomSnapshot);
      room.pushMessage({ ...message });
      return this.roomRepository.updateOne(room.getSnapshot());
    } catch (err) {
      throw err;
    }
  }

  public async getRooms(userId: string): Promise<typeRoomSnapshot[]> {
    try {
      const roomSnapshots = await this.roomRepository.findWhere((room) =>
        room.users.includes(userId)
      );
      return roomSnapshots as typeRoomSnapshot[];
    } catch (err) {
      throw err;
    }
  }
}
