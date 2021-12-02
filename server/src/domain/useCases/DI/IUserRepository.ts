import { typeUserSnapshot } from "../../entity/types";
import { typeUserModel } from "../../../db/models/types";

export interface IUserRepository {
  findAllUsers(): Promise<typeUserModel[]>;
  findUserByEmail(email: string): Promise<typeUserModel | null>;
  createUser(user: typeUserSnapshot): Promise<typeUserModel>;
}
