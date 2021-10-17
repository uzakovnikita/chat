import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import Room from "../entity/Room";
import { typeMessage, typeUserDTO } from "../entity/types";
import User from "../entity/User";
import { IRoomRepository } from "./DI/IRoomRepository";
import { IUserRepository } from "./DI/IUserRepository";

@injectable()
export default class UserService {
  @inject(TYPES.UserRepository) private repository: IUserRepository;
  @inject(TYPES.RoomRepository) private roomRepository: IRoomRepository;
  private currentUser: User | null;

  public signin(email: string, password: string) {
    const existingUsers = this.repository.findAll();
    if (existingUsers.find((existingUser) => existingUser.email === email)) {
      return false;
    }
    const id = Date.now() * Math.random() + "";
    const newUser = User.create(id, email);
    this.repository.saveOne(newUser.getSnapshot());
  }

  public login(userDTO: typeUserDTO) {
    const { id, email } = userDTO;
    const user = User.create(id, email);
    const listOfRooms = this.roomRepository.findAll();
    user.login(listOfRooms);
    this.currentUser = user;
  }

  public joinInRoom(id: string) {
    this.currentUser.joinInRoom(id);
    const roomSnapshot = this.roomRepository.findOne(id);
    const room = Room.create(roomSnapshot);
    const interlocutor = this.repository.findById(
      room.members.find((id) => id !== this.currentUser.id)
    );
    return { history: room.history, interlocutor };
  }

  public sendMessage(message: Omit<typeMessage, "id">) {
    const id = Date.now() * Math.random() + "";
    this.currentUser.sendMessage({ ...message, id });
    const room = this.currentUser.currentRoom;
    this.roomRepository.update(room.getSnapshot());
  }
}
