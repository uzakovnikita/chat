import { user, room } from "../entity";
import { IServiceSubscribe } from "../interfacesDI";


export const loginCase = async (email: string, password: string, serviceSubscribe: IServiceSubscribe) => {
  const userDTO = await user.login(password, {
    nameOfLoginField: "email",
    value: email,
  });
  const allRooms = room.getAllRooms(userDTO.id).map(({ id }) => id);
  user.subscribeOnMessages(serviceSubscribe, allRooms);
};
