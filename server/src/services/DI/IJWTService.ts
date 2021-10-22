export interface IJWTService {
  generateTokens(payload: Record<string, unknown>): {
    accessToken: string;
    refreshToken: string;
  };
  validateRefreshToken(refreshToken: string): Promise<boolean>;
  validateAccessToken(accessToken: string): Promise<boolean>;
}
