import { inject, injectable } from "inversify";

import User from "../entity/User";

import { IRoomRepository } from "./DI/IRoomRepository";
import { IUserRepository } from "./DI/IUserRepository";
import { IEncoder } from "./DI/IEncoder";

import { TYPES } from "../../types";
import { typeMessage, typeUserDTO } from "../entity/types";
import Room from "../entity/Room";

@injectable()
class UserService {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;
  @inject(TYPES.RoomRepository) private roomRepository: IRoomRepository;
  @inject(TYPES.Encoder) private encoder: IEncoder;

  public async signin(email: string, password: string) {
    const existingUsers = this.userRepository.findAll();
    if (existingUsers.find((existingUser) => existingUser.email === email)) {
      throw new Error("User already exist");
    }
    const userId = (Date.now() * Math.random() * 1000 + "").slice(8);
    const newUser = User.create({
      id: userId,
      email,
      password: this.encoder.encoder(password),
    });
    await existingUsers.forEach(async (existingUser) => {
      const roomId = (Date.now() * Math.random() * 1000 + "").slice(8);
      const users = [existingUser.id, userId];
      const history: typeMessage[] = [];
      const newRoom = Room.create({ id: roomId, users, history });
      try {
        await this.roomRepository.saveOne(newRoom.getSnapshot());
      } catch (err) {
        throw err;
      }
    });
    try {
      return this.userRepository.saveOne(newUser.getSnapshot());
    } catch (err) {
      throw err;
    }
  }

  public async login(email: string, password: string) {
    try {
      const userSnapshot = this.userRepository.findOne(email);
      const isEqualPassword = await this.encoder.compare(
        password,
        userSnapshot.password
      );
      if (isEqualPassword) {
        return userSnapshot;
      }
      throw new Error('Password is not valid');
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();
