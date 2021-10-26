import { typeMessage, typeRoomSnapshot } from "../types";

export default class Room {
  private constructor(
    private _users: string[],
    private _history: typeMessage[]
  ) {}

  public static create(roomSnapshot: typeRoomSnapshot) {
    return new Room(roomSnapshot.users, roomSnapshot.history);
  }

  get members() {
    return this._users;
  }

  get history() {
    return this._history;
  }

  public pushMessage(message: typeMessage) {
    this._history.push(message);
  }

  getSnapshot(): typeRoomSnapshot {
    return {
      users: this._users,
      history: this._history,
    };
  }
}
