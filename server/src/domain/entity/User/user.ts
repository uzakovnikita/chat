import Room from "../Room";
import { typeMessage, typeRoomSnapshot } from "../types";

export default class User {
  private _currentRoom: Room | null = null;
  private listOfRooms: Room[] = [];
  private messages: typeMessage[] | null = null;

  private constructor(private _id: string, private email: string) {}

  public static create(id: string, email: string) {
    const instance = new User(id, email);
    return instance;
  }

  login(listOfRoomsDTO: typeRoomSnapshot[]) {
    this.listOfRooms = listOfRoomsDTO.map((roomDTO) => Room.create(roomDTO));
  }

  logout() {
    this.listOfRooms = null;
  }

  joinInRoom(id: string) {
    this._currentRoom = this.listOfRooms.find((room) => room.id === id);
    this.messages = this._currentRoom.history;
  }

  leaveRoom() {
    this._currentRoom = null;
    this.messages = null;
  }

  sendMessage(message: typeMessage) {
    this._currentRoom.pushMessage(message);
  }

  getMessages() {
    return this.messages;
  }

  getSnapshot() {
    return {
      id: this._id,
      email: this.email,
    };
  }

  get currentRoom() {
    return this._currentRoom;
  }

  get id() {
    return this._id;
  }
}
