import { ITokenRepository } from "../../../authenticate/DI/ITokenRepository";

import Token from "../../../db/models/Token";

export default class TokenRepository implements ITokenRepository {
  public async updateToken(id: string, token: string) {
    const updateResult = await Token.updateOne(
      { user: id },
      { refreshToken: token }
    );
    if (updateResult.ok === 1) {
      return true;
    }
    return false;
  }
  public async saveToken(id: string, token: string) {
    const newToken = new Token({ user: id, refreshToken: token });
    const result = await newToken.save();
    return result === newToken;
  }
  public async findTokenByUserId(id: string) {
    const result = await Token.findOne({ user: id });
    if (result) {
      return result.refreshToken;
    }
    return null;
  }
}
