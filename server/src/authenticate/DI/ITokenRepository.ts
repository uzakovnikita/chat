export interface ITokenRepository {
  updateToken(id: string, token: string): Promise<string>;
  saveToken(id: string, token: string): Promise<string>;
  findTokenByUserId(id: string): Promise<string>;
}
