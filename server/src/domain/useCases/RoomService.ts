import { inject, injectable } from "inversify";
import { IRoomRepository } from "./DI/IRoomRepository";
import { TYPES } from "../../types";
import Room from "../entity/Room";
import { typeMessage, typeRoomSnapshot } from "../entity/types";

@injectable()
export default class RoomService {
  @inject(TYPES.RoomRepository) private roomRepository: IRoomRepository;

  public async getHistory(roomId: string, startHistory: number, offsetHistory: number) {
    // eslint-disable-next-line max-len
    const roomSnapshot = await this.roomRepository.findRoomById(roomId, startHistory, offsetHistory);
    const room = Room.create(roomSnapshot);

    return room.history;
  }

  public async sendMessage(message: typeMessage) {
    const roomSnapshot = await this.roomRepository.findRoomById(message.roomId);
    const { id } = roomSnapshot;

    const room = Room.create(roomSnapshot);
    room.pushMessage({ ...message });

    return this.roomRepository.addNewMessage({ id, ...room.getSnapshot() });
  }

  public async getRooms(userId: string): Promise<typeRoomSnapshot[]> {
    const roomSnapshots = await this.roomRepository.findRoomsByUser(userId);

    return roomSnapshots;
  }
}
