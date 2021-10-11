import room from "../Room";
import {
  IServiceDB,
  IServiceSubscribe,
  IServiceMessageSend,
} from "../../interfacesDI";
import { IUser } from "./IUser";
import { userDTO } from "../../../types";

export default {
  sendMessage(
    from: string,
    to: string,
    room: string,
    body: string,
    serviceDB: IServiceDB,
    serviceMessageSend: IServiceMessageSend
  ) {
    const date = Date.now();
    serviceDB.saveOne("user", { from, to, room, body, date });
    serviceMessageSend.send(from, to, room, body);
    return new Promise<boolean>((r) => r(true));
  },
  subscribeOnMessages(subscribeService: IServiceSubscribe, emitters: string[]) {},
  unsubscribeOnMessages(subscribeService: IServiceSubscribe) {},
  joinInRoom(userId: string, roomId: string) {
    room.notUserHasJoin();
    return new Promise<boolean>((r) => r(true));
  },
  leaveRoom(userId: string, roomId: string) {
    room.noteUserHasLeave();
  },
  async signin(
    serviceDB: IServiceDB,
    credentials: {
      password: string;
      identify: {
        nameOfLoginField: string;
        value: string;
      };
    }
  ) {
    const allExistingUsers = await serviceDB.findAll("user");
    const IsThisUserAlreadyExist = allExistingUsers.find((el) => el);
    return new Promise<boolean>((r) => r(true));
  },
  async login(
    password: string,
    credentials: { nameOfLoginField: string; value: string }
  ): Promise<userDTO> {
    const {nameOfLoginField, value} = credentials;
    return {
      id: "1",
      credentials: {
        nameOfLoginField,
        value,
      },
    };
  },
  logout() {
    return new Promise<boolean>((r) => r(true));
  },
};
