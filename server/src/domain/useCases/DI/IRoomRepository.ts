import { typeMessage, typeRoomSnapshot } from "../../entity/types";
import { typeRoomModel } from "../../../db/models/types";

export interface IRoomRepository {
  createRoom(room: Omit<typeRoomSnapshot, "history">): Promise<typeRoomModel>;
  findRoomById(
    roomId: string,
    startHistory?: number,
    offsetHistory?: number
  ): Promise<typeRoomSnapshot & { id: string }>;
  findRoomsByUser(userId: string): Promise<typeRoomModel[]>;
  addNewMessage(room: typeRoomSnapshot & { id: string }): Promise<typeMessage>;
}
