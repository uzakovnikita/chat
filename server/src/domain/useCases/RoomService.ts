import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import Room from "../entity/Room";
import { typeMessage, typeRoomSnapshot } from "../entity/types";
import { IRoomRepository } from "./DI/IRoomRepository";

@injectable()
export default class RoomService {
  @inject(TYPES.RoomRepository) private roomRepository: IRoomRepository;

  public async getHistory(
    roomId: string,
    startHistory: number,
    offsetHistory: number,
  ) {
    try {
      const roomSnapshot = await this.roomRepository.findRoomById(
        roomId,
        startHistory,
        offsetHistory,
      );
      const room = Room.create(roomSnapshot);
      return room.history;
    } catch (err) {
      throw err;
    }
  }

  public async sendMessage(message: typeMessage) {
    try {
      const roomSnapshot = await this.roomRepository.findRoomById(
        message.roomId,
      );
      const { id } = roomSnapshot;

      const room = Room.create(roomSnapshot);
      room.pushMessage({ ...message });

      return this.roomRepository.addNewMessage({ id, ...room.getSnapshot() });
    } catch (err) {
      throw err;
    }
  }

  public async getRooms(userId: string): Promise<typeRoomSnapshot[]> {
    try {
      const roomSnapshots = await this.roomRepository.findRoomsByUser(userId);
      return roomSnapshots;
    } catch (err) {
      throw err;
    }
  }
}
