import { typeRoomSnapshot } from "../../../domain/entity/types";

export interface IRoomRepository {
  createRoom(
    room: typeRoomSnapshot
  ): Promise<typeRoomSnapshot & { id: string }>;
}
