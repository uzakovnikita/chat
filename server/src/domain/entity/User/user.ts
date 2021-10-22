import Room from "../Room";
import { typeMessage, typeRoomSnapshot, typeUserDTO } from "../types";

export default class User {
  private _currentRoom: Room | null = null;
  private listOfRooms: Room[] = [];
  private messages: typeMessage[] | null = null;

  private constructor(
    private _id: string,
    private email: string,
    private _password?: string
  ) {}

  public static init(userDTO: typeUserDTO) {
    const { id, email } = userDTO;
    return new User(id, email);
  }

  public static create(userDTO: typeUserDTO & { password: string }) {
    const { id, email, password } = userDTO;
    const instance = new User(id, email, password);
    return instance;
  }

  login(listOfRoomsDTO: typeRoomSnapshot[]) {
    this.listOfRooms = listOfRoomsDTO.map((roomDTO) => Room.create(roomDTO));
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
      password: this._password,
    };
  }

  get currentRoom() {
    return this._currentRoom;
  }

  get id() {
    return this._id;
  }
}
