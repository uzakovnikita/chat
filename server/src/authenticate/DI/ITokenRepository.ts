export interface ITokenRepository {
  updateToken(id: string, token: string): Promise<boolean>;
  saveToken(id: string, token: string): Promise<boolean>;
  findTokenByUserId(id: string): Promise<string | null>;
}
