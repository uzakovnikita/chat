import user from "../entity/User";
import { IServiceDB, IServiceMessageSend } from "../interfacesDI";


export const sendMessageCase = (
  from: string,
  to: string,
  room: string,
  body: string,
  serviceDB: IServiceDB,
  serviceMessageSend: IServiceMessageSend,
) => {
  user.sendMessage(from, to, room, body, serviceDB, serviceMessageSend);
};
