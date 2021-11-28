import { inject, injectable } from "inversify";
import { IRoomRepository } from "./DI/IRoomRepository";
import { IUserRepository } from "./DI/IUserRepository";
import { IEncoder } from "./DI/IEncoder";
import { TYPES } from "../../types";
import { typeMessage } from "../entity/types";
import Room from "../entity/Room";
import User from "../entity/User";

@injectable()
export default class UserService {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;

  @inject(TYPES.RoomRepository) private roomRepository: IRoomRepository;

  @inject(TYPES.Encoder) private encoder: IEncoder;

  public async signin(email: string, password: string) {
    const userIsAlreadyExist = await this.userRepository.findUserByEmail(email);

    if (userIsAlreadyExist) {
      throw new Error("User already exist");
    }

    const existingUsers = await this.userRepository.findAllUsers();

    const newUser = User.create({
      email,
      password: this.encoder.encoder(password),
    });

    const { id } = await this.userRepository.createUser(newUser.getSnapshot());

    existingUsers.forEach(async (existingUser) => {
      const users = [existingUser.id, id];
      const history: typeMessage[] = [];
      const newRoom = Room.create({ users, history });
      await this.roomRepository.createRoom(newRoom.getSnapshot());
    });

    return {
      id,
      ...newUser.getSnapshot(),
    };
  }

  public async login(email: string, password: string) {
    const userSnapshot = await this.userRepository.findUserByEmail(email);
    const isEqualPassword = await this.encoder.compare(password, userSnapshot.password);

    if (isEqualPassword) {
      return userSnapshot;
    }

    throw new Error("Password is not valid");
  }
}
