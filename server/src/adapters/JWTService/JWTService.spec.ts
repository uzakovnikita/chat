import jwt from "jsonwebtoken";
import { keys } from "../../config/keys";
import { jwtService } from ".";

describe("Test adapters: JWTService", () => {
  const payload = {
    email: "nikita",
    id: "u-1996-und",
  };
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("Should generate tokens", () => {
    const jwtSpy = jest.spyOn(jwt, "sign");
    jwtService.generateTokens(payload);
    const accessTokenArg = [
      payload,
      `${keys.JWT_ACCESS_SECRET}`,
      { expiresIn: "30m" },
    ];
    const refreshTokenArg = [
      payload,
      `${keys.JWT_REFRESH_SECRET}`,
      { expiresIn: "30d" },
    ];
    expect(jwtSpy.mock.calls[0]).toEqual(accessTokenArg);
    expect(jwtSpy.mock.calls[1]).toEqual(refreshTokenArg);
  });
  it("Should validate refresh token", () => {
    const { refreshToken } = jwtService.generateTokens(payload);

    expect(jwtService.validateRefreshToken(refreshToken)).toBeTruthy();

    const laterTwoMonth = new Date().setMonth(new Date().getMonth() + 2);
    jest.setSystemTime(laterTwoMonth);

    expect(jwtService.validateRefreshToken(refreshToken)).toBeFalsy();
  });
  it("Should validate access token", () => {
    const { accessToken } = jwtService.generateTokens(payload);

    expect(jwtService.validateAccessToken(accessToken)).toBeTruthy();

    const laterThirtyMinutes = new Date().setMinutes(
      new Date().getMinutes() + 30
    );
    jest.setSystemTime(laterThirtyMinutes);
    expect(jwtService.validateAccessToken(accessToken)).toBeFalsy();
  });
  it("Should return user data from token", () => {
    const { accessToken, refreshToken } = jwtService.generateTokens(payload);
		const userDataFromAT = jwtService.getUserDataFromToken(accessToken);
		const userDataFromRT = jwtService.getUserDataFromToken(refreshToken);
		expect(userDataFromAT).toEqual(payload);
		expect(userDataFromRT).toEqual(payload);
  });
});
