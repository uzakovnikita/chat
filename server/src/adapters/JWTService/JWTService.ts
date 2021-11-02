import jwt from "jsonwebtoken";

import { keys } from "../../config/keys";

import { IJWTService } from "../../authenticate/DI/IJWTService";

export default class JWTService implements IJWTService {
  generateTokens(payload: Record<string, unknown>): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign(payload, keys.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, keys.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }
  validateRefreshToken(refreshToken: string) {
    const verify = jwt.verify(refreshToken, keys.JWT_REFRESH_SECRET);
    return Boolean(verify);
  }
  validateAccessToken(accessToken: string) {
    const verify = jwt.verify(accessToken, keys.JWT_ACCESS_SECRET);
    return Boolean(verify);
  }
  getUserDataFromToken(token: string) {
    const result = jwt.decode(token);
    if (typeof result === "object" && "email" in result && "id" in result) {
      return { email: result.email, id: result.id };
    }
    return null;
  }
}
