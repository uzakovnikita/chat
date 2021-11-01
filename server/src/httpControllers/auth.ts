import { userService } from "../domain/useCases";
import { authService } from "../authenticate";

import { omit } from "../utils";

const login = async (
  req: { body: { email: string; password: string; userId?: string } },
  res: any,
  next: (arg0?: undefined) => void
) => {
  try {
    const { email, password } = req.body;
    const userData = omit(await userService.login(email, password), "password");
    const tokens = await authService.login(email, userData.id);
    return res
      .status(200)
      .cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: "success",
        user: userData,
        accessToken: tokens.accessToken,
      });
  } catch (err) {
    next(err);
  }
};

const register = async (
  req: { body: { email: any; password: any } },
  res: any,
  next: any
) => {
  try {
    const { email, password } = req.body;
    const userData = omit(await userService.login(email, password), "password");
    const { refreshToken, accessToken } = await authService.signin(
      email,
      userData.id
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: "success",
        user: userData,
        accessToken: accessToken,
      });
  } catch (err) {
    next(err);
  }
};

const logout = async (
  _: any,
  res: {
    clearCookie: (arg0: string) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { message: string }): void; new (): any };
    };
  },
  next: (arg0: any) => void
) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout success" });
  } catch (err) {
    next(err);
  }
};

const refresh = async (
  req: { cookies: { refreshToken: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      cookie: {
        (
          arg0: string,
          arg1: string,
          arg2: { maxAge: number; httpOnly: boolean }
        ): {
          (): any;
          new (): any;
          json: {
            (arg0: { message: string; accessToken: string }): any;
            new (): any;
          };
        };
        new (): any;
      };
    };
  },
  next: (arg0: any) => void
) => {
  try {
    const refreshTokenOld = req.cookies.refreshToken;
    const { accessToken, refreshToken } = await authService.refresh(
      refreshTokenOld
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({ message: "success refresh", accessToken });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  register,
  logout,
  refresh,
};
