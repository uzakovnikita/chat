import { typeMessage, typeRoomSnapshot } from "../../../domain/entity/types";

export interface IRoomRepository {
  createRoom(
    room: typeRoomSnapshot
  ): Promise<typeRoomSnapshot & { id: string }>;
  findRoomById(
    roomId: string,
    startHistory?: number,
    offsetHistory?: number
  ): Promise<typeRoomSnapshot & { id: string }>;
  findRoomsByUser(
    userId: string
  ): Promise<(typeRoomSnapshot & { id: string })[]>;
  addNewMessage(room: typeRoomSnapshot & { id: string }): Promise<typeMessage>;
}
