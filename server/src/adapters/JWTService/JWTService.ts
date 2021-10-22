import { IJWTService } from "../../services/DI/IJWTService";

export default class JWTService implements IJWTService {
  public generateTokens(payload: Record<string, unknown>): {
    accessToken: string;
    refreshToken: string;
  } {
    return { accessToken: "", refreshToken: "" };
  }
  validateRefreshToken(refreshToken: string): Promise<boolean> {
    return new Promise((res) => res(true));
  }
  validateAccessToken(accessToken: string): Promise<boolean> {
    return new Promise((res) => res(true));
  }
}
