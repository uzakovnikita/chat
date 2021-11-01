import jwt from "jsonwebtoken";

import { IJWTService } from "../../authenticate/DI/IJWTService";

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
  getUserDataFromToken(token: string) {
    const result = jwt.decode(token);
    if (typeof result === "object" && "email" in result && "id" in result) {
      return result as { email: string; id: string };
    }
    return null;
  }
}
