/* eslint-disable no-underscore-dangle */
import User from "../../../db/models/User";

import { IUserRepository } from "../../../domain/useCases/DI/IUserRepository";

import { typeUserSnapshot } from "../../../domain/entity/types";

export default class UserRepository implements IUserRepository {
  async findAllUsers() {
    const users = await User.find({}).exec();
    const result = users.map((user) => ({
      id: `${user._id}`,
      email: user.email,
      password: user.password,
    }));

    return result;
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({ email }).exec();

    return {
      id: `${user._id}`,
      email: user.email,
      password: user.password,
    };
  }

  async createUser(user: typeUserSnapshot) {
    const createdUser = await User.create(user);

    return {
      id: createdUser._id,
      email: createdUser.email,
      password: createdUser.password,
    };
  }
}
