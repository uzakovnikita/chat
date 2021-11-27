import express from "express";
import { userService } from "../domain/useCases";
import { authService } from "../authenticate";
import { omit } from "../utils";

const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = omit(await userService.login(email, password), "password");
    const tokens = await authService.login(email, userData.id);

    res
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

const register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = omit(await userService.login(email, password), "password");
    const { refreshToken, accessToken } = await authService.signin(email, userData.id);

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: "success",
        user: userData,
        accessToken,
      });
  } catch (err) {
    next(err);
  }
};

const logout = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout success" });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const refreshTokenOld = req.cookies.refreshToken;
    const { accessToken, refreshToken } = await authService.refresh(refreshTokenOld);

    res
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
