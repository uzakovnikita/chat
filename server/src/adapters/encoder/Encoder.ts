import bcrypt from "bcryptjs";
import { IEncoder } from "../../domain/useCases/DI/IEncoder";

export default class Encoder implements IEncoder {
  public encoder(value: string) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(value, salt);
  }

  public async compare(value: string, encodedValue: string) {
    return bcrypt.compare(value, encodedValue);
  }
}
