import Room from '../../../db/models/Rooms';

import { typeRoomSnapshot } from "../../../domain/entity/types";
import { IRoomRepository } from "../../../domain/useCases/DI/IRoomRepository";

export default class RoomRepository implements IRoomRepository {
  async createRoom(room: typeRoomSnapshot) {
    
  }
}
