/* eslint-disable no-underscore-dangle */
import { typeUserDTO } from "../../../types/";

export default class User {
  private constructor(private email: string, private _password?: string) {}

  public static create(userDTO: typeUserDTO & { password: string }) {
    const { email, password } = userDTO;
    const instance = new User(email, password);

    return instance;
  }

  getSnapshot() {
    return {
      email: this.email,
      password: this._password,
    };
  }
}
