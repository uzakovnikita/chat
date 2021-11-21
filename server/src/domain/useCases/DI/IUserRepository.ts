import { typeUserSnapshot } from "../../entity/types";

export interface IUserRepository {
  findAllUsers(): Promise<(typeUserSnapshot & { id: string })[]>;
  findUserByEmail(email: string): Promise<(typeUserSnapshot & { id: string }) | null>;
  createUser(user: typeUserSnapshot): Promise<typeUserSnapshot & { id: string }>;
}
