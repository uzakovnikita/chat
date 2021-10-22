import { inject, injectable } from "inversify";

import userService from "../domain/useCases/UserService";

import { IJWTService } from "./DI/IJWTService";
import { ITokenRepository } from "./DI/ITokenRepository";

import { TYPES } from "../types";

@injectable()
export default class AuthService {
  @inject(TYPES.JWTService) private jwtService: IJWTService;
  @inject(TYPES.TokenRepository) private tokenRepository: ITokenRepository;
  public async login(email: string, password: string) {
    try {
      const user = await userService.login(email, password);
      const tokens = this.jwtService.generateTokens(user);
      this.tokenRepository.saveOne({ id: user.id, token: tokens.refreshToken });
      return { ...tokens, user };
    } catch (err) {
      throw err;
    }
  }
}
