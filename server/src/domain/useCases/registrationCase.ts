import user from "../entity/User";
import { IServiceDB } from "../interfacesDI/IServiceDB";


export const registrationOnEmailCase = (
  email: string,
  password: string,
  serviceDB: IServiceDB
) => {
  user.signin(serviceDB, {
    password,
    identify: {
      nameOfLoginField: "email",
      value: email,
    },
  });
};
