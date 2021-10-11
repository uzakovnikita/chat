import { IServiceDB } from "../../interfacesDI/IServiceDB";

export interface IUser {
  sendMessage(
    adress: string,
    room: string,
    body: string,
    serviceDB: IServiceDB,
  ): Promise<boolean>;
  joinInRoom(where: string): Promise<boolean>;
  signin(
    serviceDB: IServiceDB,
    credentials: {
      password: string;
      identify: {
        nameOfLoginField: string;
        value: string;
      };
    }
  ): Promise<boolean>;
  login(): Promise<boolean>;
  logout(): Promise<boolean>;
}
