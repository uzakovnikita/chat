import { inject, injectable } from "inversify";

import { IJWTService } from "./DI/IJWTService";
import { ITokenRepository } from "./DI/ITokenRepository";

import { TYPES } from "../types";

@injectable()
export default class AuthService {
  @inject(TYPES.JWTService) private jwtService: IJWTService;
  @inject(TYPES.TokenRepository) private tokenRepository: ITokenRepository;
  public async login(email: string, id: string) {
    try {
      const tokens = this.jwtService.generateTokens({ email, id });
      this.tokenRepository.updateToken(email, tokens.refreshToken);
      return { ...tokens };
    } catch (err) {
      throw err;
    }
  }
  public async signin(email: string, id: string) {
    try {
      const tokens = this.jwtService.generateTokens({email, id});
      this.tokenRepository.saveToken(email, tokens.refreshToken);
      return { ...tokens };
    } catch (err) {
      throw err;
    }
  }
}
