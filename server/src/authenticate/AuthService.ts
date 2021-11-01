import { inject, injectable } from "inversify";

import { IJWTService } from "./DI/IJWTService";
import { ITokenRepository } from "./DI/ITokenRepository";

import { TYPES } from "../types";

@injectable()
export default class AuthService {
  @inject(TYPES.JWTService) private jwtService: IJWTService;
  @inject(TYPES.TokenRepository) private tokenRepository: ITokenRepository;

  public async login(email: string, id: string) {
    const tokens = this.jwtService.generateTokens({ email, id });
    this.tokenRepository.updateToken(email, tokens.refreshToken);
    return { ...tokens };
  }

  public async signin(email: string, id: string) {
    const tokens = this.jwtService.generateTokens({ email, id });
    this.tokenRepository.saveToken(email, tokens.refreshToken);
    return { ...tokens };
  }

  public async refresh(refreshTokenOld: string) {
    const userData = this.jwtService.getUserDataFromToken(refreshTokenOld);

    const tokenFromRepository = await this.tokenRepository.findTokenByUserId(
      userData.id
    );

    const isValidRefreshToken =
      this.jwtService.validateRefreshToken(refreshTokenOld) &&
      tokenFromRepository === refreshTokenOld;

    if (!isValidRefreshToken) {
      throw new Error("Unathorized error");
    }

    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      ...userData,
    });
    // Запись в БД для того чтобы отслеживать количество залогиненных устройств
    // в нашем случае дозволительно логинится только с 1 устройства
    // подробнее: https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc
    await this.tokenRepository.updateToken(userData.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
