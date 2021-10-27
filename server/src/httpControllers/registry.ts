import { serviceDB } from "../adapters/serviceDB";
import { registrationOnEmailCase } from "../domain/useCases/registrationCase";


export const registry = (req: any, res: any) => {
    const {email, password} = req;
    const result = registrationOnEmailCase(email, password, serviceDB);
};
