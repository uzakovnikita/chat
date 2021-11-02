export interface IJWTService {
  generateTokens(payload: Record<string, unknown>): {
    accessToken: string;
    refreshToken: string;
  };
  validateRefreshToken(refreshToken: string): boolean;
  validateAccessToken(accessToken: string): boolean;
  getUserDataFromToken(token: string): { id: string; email: string } | null;
}
